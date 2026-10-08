#!/usr/bin/env bun
/**
 * 基于 TypeScript AST 的硬编码英文界面文本扫描（补充 check-translations.ts）。
 * 列出 JSX 文本节点与 aria-label/title/placeholder/alt/label 等属性里未经 t() 的英文。
 * 用法：bun scripts/scan-hardcoded-ui.ts [文件或目录...]
 * 默认扫描桌面端 webview 与桌面端实际引用的 @cline/ui 组件。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const ROOT = join(import.meta.dir, "..");
const targets = process.argv.slice(2).length
	? process.argv.slice(2)
	: [
			join(ROOT, "apps/examples/desktop-app/webview"),
			join(ROOT, "sdk/packages/ui/components"),
		];
const ATTRS = new Set([
	"aria-label",
	"title",
	"placeholder",
	"alt",
	"label",
	"description",
	"emptyMessage",
	"tooltip",
]);
const isEnglish = (s: string) =>
	/[A-Za-z]{2,}/.test(s) && !/[\u4e00-\u9fff]/.test(s);
const ignore = (s: string) =>
	/^(?:https?:|\/|~|\.|sk-|[a-z0-9_.-]*[_.\-/][a-z0-9_.-]*$|[A-Z0-9_]+$|e\.g\.)/.test(
		s.trim(),
	) ||
	/^(?:Cline|MCP|SSH|URL|JSON|API Key|GitHub|PNG|OpenAI|Anthropic|Gemini|OpenRouter|DeepSeek|Mermaid)$/.test(
		s.trim(),
	);

function walk(p: string, out: string[] = []) {
	const st = statSync(p);
	if (st.isFile()) {
		if (/\.tsx$/.test(p) && !/\.(test|spec|stories)\./.test(p)) out.push(p);
		return out;
	}
	for (const n of readdirSync(p))
		if (!["node_modules", ".next", "out", "dist"].includes(n))
			walk(join(p, n), out);
	return out;
}
let total = 0;
for (const file of targets.flatMap((t) => walk(t))) {
	const src = readFileSync(file, "utf8");
	const sf = ts.createSourceFile(
		file,
		src,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	const hits: string[] = [];
	const report = (node: ts.Node, kind: string, text: string) => {
		const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
		hits.push(
			`  ${line + 1}: [${kind}] ${JSON.stringify(text.trim().replace(/\s+/g, " "))}`,
		);
	};
	const visit = (node: ts.Node) => {
		if (ts.isJsxText(node)) {
			const txt = node.getText();
			if (isEnglish(txt) && !ignore(txt)) report(node, "text", txt);
		} else if (ts.isJsxAttribute(node) && ATTRS.has(node.name.getText())) {
			const init = node.initializer;
			const lit =
				init && ts.isStringLiteral(init)
					? init
					: init &&
							ts.isJsxExpression(init) &&
							init.expression &&
							(ts.isStringLiteral(init.expression) ||
								ts.isNoSubstitutionTemplateLiteral(init.expression))
						? init.expression
						: undefined;
			if (lit && isEnglish(lit.text) && !ignore(lit.text))
				report(node, node.name.getText(), lit.text);
		} else if (
			ts.isJsxExpression(node) &&
			node.expression &&
			ts.isStringLiteral(node.expression) &&
			ts.isJsxElement(node.parent)
		) {
			if (isEnglish(node.expression.text) && !ignore(node.expression.text))
				report(node, "expr", node.expression.text);
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
	if (hits.length) {
		total += hits.length;
		console.log(relative(ROOT, file));
		console.log(hits.join("\n"));
	}
}
console.log(`\n共 ${total} 处`);
