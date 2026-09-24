import { randomUUID } from "node:crypto";
import { createServer } from "node:net";

const approvalToken = randomUUID();
const children: ReturnType<typeof Bun.spawn>[] = [];

async function reserveAvailablePort(): Promise<number> {
	return await new Promise((resolve, reject) => {
		const server = createServer();
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			if (!address || typeof address === "string") {
				server.close();
				reject(new Error("Failed to reserve a sidecar port"));
				return;
			}
			server.close((error) => (error ? reject(error) : resolve(address.port)));
		});
	});
}

async function getSidecarPort(): Promise<number> {
	return await new Promise((resolve) => {
		const server = createServer();
		server.once("error", async () => {
			resolve(await reserveAvailablePort());
		});
		server.listen(3126, "127.0.0.1", () => {
			server.close(() => resolve(3126));
		});
	});
}

function spawn(command: string[], env: Record<string, string>) {
	const child = Bun.spawn(command, {
		cwd: import.meta.dir + "/..",
		env: { ...process.env, ...env },
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});
	children.push(child);
	return child;
}

function stopChildren(): void {
	for (const child of children) {
		if (!child.killed) child.kill();
	}
}

process.on("SIGINT", stopChildren);
process.on("SIGTERM", stopChildren);

function freePortsOnWindows(ports: number[]): void {
	if (process.platform === "win32") {
		try {
			const portList = ports.join(",");
			const cmd = `Get-NetTCPConnection -LocalPort ${portList} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`;
			Bun.spawnSync(["powershell", "-NoProfile", "-Command", cmd]);
		} catch {}
	}
}

async function main(): Promise<void> {
	freePortsOnWindows([3125, 3126]);
	const sidecarPort = await getSidecarPort();
	const endpoint = `ws://127.0.0.1:${sidecarPort}/transport?approval_token=${approvalToken}`;
	const sidecar = spawn([process.execPath, "run", "sidecar/index.ts"], {
		CLINE_SIDECAR_APPROVAL_TOKEN: approvalToken,
		CLINE_SIDECAR_PORT: String(sidecarPort),
	});
	const web = spawn(
		[process.execPath, "run", "next", "dev", "webview", "-p", "3125", "--turbo"],
		{ NEXT_PUBLIC_SIDECAR_WS_ENDPOINT: endpoint },
	);

	const exitCode = await Promise.race([sidecar.exited, web.exited]);
	stopChildren();
	await Promise.allSettled(children.map((child) => child.exited));
	process.exit(exitCode);
}

void main();
