#!/usr/bin/env bash
# Cline 中文版 —— Gitleaks 密钥泄露扫描（本地与 GitHub Actions 共用）
#
# 用法（仓库根目录）：bash scripts/security-scan.sh
# 依赖：git、gitleaks（>= 8.19）、python3
#
# 做三件事，所有报告都用 --redact 脱敏，不会在日志里打印密钥原文：
#   1. 扫描完整 Git 历史（含上游 cline/cline 历史）。
#   2. 扫描当前工作区里「相对上游 desktop-v* 标签有改动」的文件（覆盖合并提交里的冲突解决内容）。
#   3. 区分来源：我们自己的提交 / 改动文件里的发现 → 失败（退出码 1，阻止发布）；
#      上游官方历史里的发现 → 只告警（多为 Firebase/PostHog 等公开客户端标识或测试占位符，
#      不在我们控制范围内，也不随我们的提交新增）。
# 误报处理：逐条确认后，把 gitleaks 输出的 Fingerprint 写进 .gitleaksignore 并注明理由；
# 不要关闭规则、不要整文件/整目录忽略。
set -euo pipefail

UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/cline/cline.git}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

command -v gitleaks >/dev/null || { echo "gitleaks 未安装：https://github.com/gitleaks/gitleaks#installing"; exit 2; }

# 拉取上游 desktop-v* 标签，用来判断哪些提交属于官方历史。拉取失败时按“全部视为我们的提交”处理（宁可误拦，不漏放）。
if [ "${SKIP_UPSTREAM_FETCH:-0}" != "1" ]; then
	git fetch --no-tags --quiet "$UPSTREAM_URL" '+refs/tags/desktop-v*:refs/tags/desktop-v*' \
		|| echo "::warning::无法拉取上游 desktop-v* 标签，所有历史发现都会按我们自己的提交处理"
fi

git rev-list HEAD --not --tags='desktop-v*' > "$WORK/own-commits.txt"
echo "我们自己的提交（不在上游 desktop-v* 标签里）：$(wc -l < "$WORK/own-commits.txt") 个"

echo "== 1/2 扫描完整 Git 历史"
gitleaks git --redact --no-banner --exit-code 0 -c .gitleaks.toml \
	--log-opts="HEAD" -f json -r "$WORK/history.json" .

echo "== 2/2 扫描相对上游有改动的文件"
BASE="$(git describe --tags --abbrev=0 --match 'desktop-v*' HEAD 2>/dev/null || true)"
mkdir -p "$WORK/changed"
if [ -n "$BASE" ]; then
	echo "上游基线：$BASE"
	git diff -z --name-only --diff-filter=d "$BASE" HEAD \
		| (cd "$ROOT" && xargs -0 -r cp --parents -t "$WORK/changed" --)
else
	echo "::warning::找不到上游 desktop-v* 基线标签，改为扫描整个工作区"
	git ls-files -z | xargs -0 -r cp --parents -t "$WORK/changed" --
fi
(cd "$WORK/changed" && gitleaks dir --redact --no-banner --exit-code 0 \
	-c "$ROOT/.gitleaks.toml" --gitleaks-ignore-path "$ROOT/.gitleaksignore" \
	-f json -r "$WORK/changed.json" .)

python3 - "$WORK" <<'PY'
import json, os, sys
work = sys.argv[1]
own = set(open(f"{work}/own-commits.txt").read().split())
hist = json.load(open(f"{work}/history.json")) or []
changed = json.load(open(f"{work}/changed.json")) or []
gh = os.environ.get("GITHUB_ACTIONS") == "true"
summary = os.environ.get("GITHUB_STEP_SUMMARY")

def where(f):
    c = f.get("Commit", "")[:9]
    return f"{f['File']}:{f['StartLine']}" + (f" @ {c}" if c else "")

ours = [f for f in hist if f.get("Commit") in own] + changed
upstream = [f for f in hist if f.get("Commit") not in own]

lines = ["## Gitleaks 扫描结果（已脱敏）", "",
         f"- 我们自己的提交 / 改动文件：**{len(ours)}** 条疑似密钥",
         f"- 上游官方历史：{len(upstream)} 条（只告警，不阻止发布）", ""]
for f in ours:
    msg = f"疑似密钥 [{f['RuleID']}] {where(f)}  fingerprint={f.get('Fingerprint','')}"
    print(f"::error file={f['File']},line={f['StartLine']}::{msg}" if gh else f"  ❌ {msg}")
    lines.append(f"- ❌ `{f['RuleID']}` `{where(f)}`")
for f in upstream:
    print(f"  ⚠️  上游 [{f['RuleID']}] {where(f)}")
if upstream:
    lines.append("<details><summary>上游历史发现（只告警）</summary>\n")
    lines += [f"- `{f['RuleID']}` `{where(f)}`" for f in upstream]
    lines.append("\n</details>")
if summary:
    with open(summary, "a") as fh:
        fh.write("\n".join(lines) + "\n")
if ours:
    print(f"\n发现 {len(ours)} 条来自我们自己提交的疑似密钥，已阻止。请撤销/轮换对应凭据；确认是误报时把 fingerprint 写入 .gitleaksignore 并注明理由。")
    sys.exit(1)
print(f"\n✅ 我们自己的提交与改动文件中未发现疑似密钥（上游历史告警 {len(upstream)} 条）。")
PY
