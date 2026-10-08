#!/usr/bin/env bun
/**
 * Cline Desktop 简体中文汉化 —— 词典健康度与漏译雷达
 *
 * 用法（仓库根目录）：
 *   bun scripts/check-translations.ts                       # 全量检查
 *   bun scripts/check-translations.ts desktop-v0.0.44 desktop-v0.0.45   # 额外扫描上游这两个版本之间新增的硬编码英文
 *
 * 检查项：
 *  1. zh-CN.json 是否为合法 JSON、是否有重复键
 *  2. 插值占位符 {name} / {{name}} 与 HTML 标签在原文与译文间是否一致
 *  3. 代码里 t("...") 字面量是否都在词典里（漏键）
 *  4. 译文是否仍为英文原文（未翻译）
 *  5. 红线词：API 密钥 / 机密 / Agent 译法 等
 *  6. （可选）上游 diff 中新增的、未包 t() 的硬编码英文界面文本
 * 有错误时退出码为 1。
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const APP = join(ROOT, "apps/examples/desktop-app");
const DICT_PATH = join(APP, "webview/locales/zh-CN.json");
const SCAN_DIRS = [
	join(APP, "webview"),
	join(ROOT, "sdk/packages/ui/components"),
];

let errors = 0;
let warnings = 0;
const err = (m: string) => {
	errors++;
	console.log(`  ❌ ${m}`);
};
const warn = (m: string) => {
	warnings++;
	console.log(`  ⚠️  ${m}`);
};

// ---------- 1. JSON 合法性与重复键 ----------
console.log("\n[1] zh-CN.json 合法性 / 重复键");
const raw = readFileSync(DICT_PATH, "utf8");
let dict: Record<string, string> = {};
try {
	dict = JSON.parse(raw);
} catch (e) {
	err(`JSON 解析失败: ${(e as Error).message}`);
	process.exit(1);
}
{
	const seen = new Map<string, number>();
	const keyRe = /^\s*("(?:[^"\\]|\\.)*")\s*:/gm;
	for (const m of raw.matchAll(keyRe)) {
		const k = JSON.parse(m[1]) as string;
		seen.set(k, (seen.get(k) ?? 0) + 1);
	}
	for (const [k, n] of seen)
		if (n > 1) err(`重复键 x${n}: ${JSON.stringify(k)}`);
	for (const [k, v] of Object.entries(dict))
		if (typeof v !== "string") err(`值不是字符串: ${JSON.stringify(k)}`);
	console.log(`  共 ${Object.keys(dict).length} 条`);
}

// ---------- 2. 占位符 / 标签 / 首尾空格 ----------
console.log("\n[2] 占位符 / HTML 标签 / 首尾空格一致性");
const ph = (s: string) =>
	[...s.matchAll(/\{\{?\s*[\w.]+\s*\}?\}/g)]
		.map((m) => m[0])
		.sort()
		.join("|");
const tags = (s: string) =>
	[...s.matchAll(/<\/?[a-zA-Z][\w-]*[^>]*>/g)]
		.map((m) => m[0].replace(/\s.*?>/, ">"))
		.sort()
		.join("|");
for (const [k, v] of Object.entries(dict)) {
	if (ph(k) !== ph(v))
		err(`占位符不一致: ${JSON.stringify(k)} -> ${JSON.stringify(v)}`);
	if (tags(k) !== tags(v))
		err(`HTML 标签不一致: ${JSON.stringify(k)} -> ${JSON.stringify(v)}`);
	if (/^\s/.test(k) !== /^\s/.test(v))
		warn(
			`开头空格不一致(拼接时可能粘连/多空格): ${JSON.stringify(k)} -> ${JSON.stringify(v)}`,
		);
	if (/\s$/.test(k) && !/\s$/.test(v) && !/[：:，,。]$/.test(v))
		warn(`结尾空格丢失: ${JSON.stringify(k)} -> ${JSON.stringify(v)}`);
	if (v.trim() === "" && k.trim() !== "") err(`空译文: ${JSON.stringify(k)}`);
}

// ---------- 3. t() 字面量漏键 ----------
console.log('\n[3] 代码中 t("...") 是否都有译文');
function walk(dir: string, out: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		if (["node_modules", ".next", "out", "dist"].includes(name)) continue;
		const p = join(dir, name);
		const st = statSync(p);
		if (st.isDirectory()) walk(p, out);
		else if (/\.(tsx?|jsx?)$/.test(name) && !/\.test\.|\.spec\./.test(name))
			out.push(p);
	}
	return out;
}
const files = SCAN_DIRS.flatMap((d) => walk(d));
const tCall = /\b(?:t|uiText)\(\s*(["'`])((?:\\.|(?!\1)[^\\])*?)\1\s*[,)]/g;
const used = new Set<string>();
for (const f of files) {
	const src = readFileSync(f, "utf8");
	for (const m of src.matchAll(tCall)) {
		if (m[1] === "`" && m[2].includes("${")) continue;
		let key = m[2];
		try {
			key =
				m[1] === "`"
					? key
					: JSON.parse(
							`"${key.replace(/\\'/g, "'").replace(/(?<!\\)"/g, '\\"')}"`,
						);
		} catch {}
		used.add(key);
		if (!(key in dict))
			err(`缺少译文: ${JSON.stringify(key)}  (${relative(ROOT, f)})`);
	}
}
console.log(`  代码中引用 ${used.size} 个不同的 t() 键`);

// ---------- 3b. t(变量.prop) 动态翻译的数据源 ----------
console.log("\n[3b] 以 t(x.label) 等方式动态翻译的字面量是否都有译文");
for (const f of files) {
	const src = readFileSync(f, "utf8");
	const props = new Set<string>();
	for (const m of src.matchAll(
		/\b(?:t|uiText)\(\s*[\w?.!\[\]]*?\.(\w+)\s*(?:\?\?[^)]*)?\)/g,
	))
		props.add(m[1]);
	if (!props.size) continue;
	const propRe = new RegExp(
		`\\b(${[...props].join("|")}):\\s*(["'])((?:\\\\.|(?!\\2).)*?)\\2`,
		"g",
	);
	for (const m of src.matchAll(propRe)) {
		const v = m[3];
		if (
			!/[A-Za-z]{2,}/.test(v) ||
			/^[a-z0-9_-]+$/.test(v) ||
			/^[A-Z_]+$/.test(v) ||
			/^(?:https?:|\/|\.)/.test(v)
		)
			continue;
		if (!(v in dict))
			warn(
				`动态键缺译文 [${m[1]}] ${JSON.stringify(v)}  (${relative(ROOT, f)})`,
			);
	}
}

// ---------- 4. 未翻译 ----------
console.log("\n[4] 译文与原文相同（疑似未翻译）");
const allowSame =
	/^[\s\d.:/()\-+%…{}]*$|^(?:[A-Z][\w.-]*|[A-Z0-9 ._/-]+|MCP|API Key|URL|JSON|SSH|Git|GitHub|Gmail|Slack|Cline|PNG)$/;
for (const [k, v] of Object.entries(dict))
	if (k === v && /[a-z]{3,}/i.test(k) && !allowSame.test(k))
		warn(`译文=原文: ${JSON.stringify(k)}`);

// ---------- 5. 红线 ----------
console.log("\n[5] 红线术语");
for (const [k, v] of Object.entries(dict)) {
	if (/API\s*密钥|API\s*秘钥/.test(v))
		err(`API Key 被翻成密钥: ${JSON.stringify(k)} -> ${v}`);
	if (/API key|api key|API KEY|Api key/.test(v))
		err(`API Key 大小写不统一: ${JSON.stringify(k)} -> ${v}`);
	if (/(?<!主)机密/.test(v)) err(`出现“机密”: ${JSON.stringify(k)} -> ${v}`);
	if (/\b[Ss]ub-?agents?\b/.test(k) && !/子代理/.test(v))
		warn(`Sub-agent 未译为子代理: ${JSON.stringify(k)} -> ${v}`);
	if (
		/(?<!sub-?)\bagents?\b/i.test(k) &&
		!/sub-?agent/i.test(k) &&
		/(?<!子)代理/.test(v) &&
		!/proxy/i.test(k)
	)
		warn(`Agent 被译为“代理”（应为智能体）: ${JSON.stringify(k)} -> ${v}`);
	if (/\bAgent Teams?\b/i.test(k) && !/智能体团队/.test(v))
		warn(`Agent Team 未译为智能体团队: ${JSON.stringify(k)} -> ${v}`);
	if (/你们/.test(v)) warn(`出现“你们”: ${JSON.stringify(k)} -> ${v}`);
}

// ---------- 6. 上游 diff 硬编码英文 ----------
const argv = process.argv.slice(2);
const full = argv.includes("--full");
const [fromRef, toRef] = argv.filter((a) => !a.startsWith("--"));
if (full || (fromRef && toRef)) {
	const paths = [
		"apps/examples/desktop-app/webview",
		"apps/examples/desktop-app/src-tauri/src",
		"sdk/packages/ui/components",
	];
	console.log(
		full
			? "\n[6] 全量扫描未包 t() 的硬编码英文界面文本"
			: `\n[6] ${fromRef}..${toRef} 新增行中的硬编码英文界面文本`,
	);
	const diff = full
		? execFileSync(
				"git",
				[
					"grep",
					"-n",
					"--no-color",
					"-e",
					".",
					"--",
					...paths.map((p) => `${p}/*.tsx`),
					...paths.map((p) => `${p}/*.ts`),
				],
				{ cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 },
			)
				.split("\n")
				.map((l) => {
					const m = /^([^:]+):(\d+):(.*)$/.exec(l);
					return m ? `+++ b/${m[1]}\n+${m[3]}` : "";
				})
				.join("\n")
		: execFileSync("git", ["diff", "-U0", fromRef, toRef, "--", ...paths], {
				cwd: ROOT,
				encoding: "utf8",
				maxBuffer: 1 << 28,
			});
	let file = "";
	let hits = 0;
	for (const line of diff.split("\n")) {
		if (line.startsWith("+++ ")) {
			file = line.slice(6);
			continue;
		}
		if (!line.startsWith("+") || /\.test\.|\.spec\./.test(file)) continue;
		const l = line.slice(1);
		if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(l)) continue;
		const attr =
			/\b(?:aria-label|title|placeholder|label|alt|description|tooltip)=["']([^"'{]*[A-Za-z]{2,}[^"'{]*)["']/.exec(
				l,
			);
		const jsxText = /^\s*([A-Z][A-Za-z ,.'’!?…:-]{1,}[A-Za-z.!?…])\s*$/.exec(l);
		const toast =
			/\b(?:toast(?:\.\w+)?|setError|setActivityLabel|throw new Error)\(\s*["'`]([^"'`]*[A-Za-z]{3,}[^"'`]*)["'`]/.exec(
				l,
			);
		const objLabel =
			/\b(?:label|title|description|placeholder|message):\s*["']([A-Z][^"']{2,})["']/.exec(
				l,
			);
		const hit = attr?.[1] ?? jsxText?.[1] ?? toast?.[1] ?? objLabel?.[1];
		// 词典里已有该原文时，通常是在渲染处用 t(变量) 翻译的，跳过
		if (hit && !/\bt\(/.test(l) && !(hit in dict) && !(hit.trim() in dict)) {
			hits++;
			warn(`${file}: ${l.trim()}`);
		}
	}
	console.log(`  命中 ${hits} 行（需人工判断是否为用户可见文案）`);
}

console.log(`\n结果：${errors} 个错误，${warnings} 个警告`);
process.exit(errors ? 1 : 0);
