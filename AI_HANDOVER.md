# Grok Bot 维护接管指南 (AI_HANDOVER.md)

本文件是专为 **Grok Bot**（及后续协作 AI）准备的完整维护交接手册。
阅读本文件后，你可以完全接管并长期维护 **Cline Desktop 简体中文汉化版**。

---

## 1. 项目使命与基本信息

- **项目全称**：Cline Desktop 简体中文汉化版
- **GitHub 仓库**：[mzssma/cline-desktop-zh-cn](https://github.com/mzssma/cline-desktop-zh-cn)
- **主开发分支**：`desktop-zh-cn`
- **上游官方源**：[cline/cline](https://github.com/cline/cline)
- **维护者**：mzssma
- **核心目标**：紧密跟进官方版本更新，提供 100% 完整、自然、深度汉化的 Cline 桌面客户端，并通过 GitHub Actions 实现关机全自动云端打包与静默升级发布。

---

## 2. 架构设计与独立共存规范（Side-by-Side）

为了让汉化版与官方英文原版在同一台 Windows 电脑上和谐共存，不互相干扰：

1. **产品显示名称**：固定为 **`Cline 中文版`**（定义于 `src-tauri/tauri.conf.json` 与 `src-tauri/tauri.windows.conf.json`）。
2. **应用唯一标识 (Bundle ID)**：固定为 **`bot.cline.app.zhcn`**。
   - 官方原版是 `bot.cline.app`。
   - 独立的 Bundle ID 保证了单实例互斥锁（Mutex）互不影响，两者可以同时启动，不会抢占窗口焦点。
3. **数据共享原则**：
   - 官方版、中文版以及 Cline CLI 统一读写系统主目录下的 `~/.cline`（Windows 下为 `C:\Users\<用户名>\.cline`）。
   - 所有的 API Key、模型提供商配置、MCP 服务设置与会话历史 100% 互通共享，用户无需重新配置。
4. **自建在线更新检测**：
   - 客户端配置的更新检测端点：`https://github.com/mzssma/cline-desktop-zh-cn/releases/latest/download/latest.json`。
   - 避免被官方英文版覆盖，且能自动检测到我们自己仓库发布的中文版更新。

---

## 3. 核心红线与翻译规范（绝不可违背）

汉化必须遵循以下红线约定，严禁擅自修改：

### 核心红线术语：
1. **API Key 统一保留英文**：
   - 界面中所有涉及 API Key 的地方，统一写作 **`API Key`**。
   - **绝对禁止**翻译为“API 密钥”。
2. **密码输入框状态切换**：
   - 统一写作 **“显示密码”** / **“隐藏密码”**。
   - **绝对禁止**翻译为“显示机密 / 隐藏机密”。
3. **专有名词统一**：
   - `Sub-agent` 统一翻译为 **“子代理”**。
   - `Agent` 统一翻译为 **“智能体”**。
   - `Agent Team` 统一翻译为 **“智能体团队”**。
   - `Provider` 翻译为 **“模型提供商”** 或 **“服务提供商”**。
   - 品牌名全部保留英文（`OpenAI`、`Anthropic`、`Gemini`、`OpenRouter`、`DeepSeek`、`Cline` 等）。
4. **翻译边界**：
   - **只翻译**用户直接看到的界面层（按钮、菜单、Tooltip、Toast、设置项、原生系统托盘等）。
   - **严禁翻译**发给 LLM 的 Prompt、协议内部通信 JSON、CLI 底层命令、变量名、API 路由等。

---

## 4. 关键文件与代码地图

| 相对路径 | 角色与用途 | 维护注意事项 |
| :--- | :--- | :--- |
| `apps/examples/desktop-app/webview/locales/zh-CN.json` | **前端核心中文词典** | 绝大部分界面文案集中在此，遵循键值对结构。 |
| `apps/examples/desktop-app/src-tauri/src/main.rs` | **Windows 系统托盘原生代码** | 托盘右键菜单文案，修改时需同步更新底部的测试断言。 |
| `apps/examples/desktop-app/src-tauri/tauri.conf.json` | **Tauri 桌面配置** | 版本号 `version`、标识 `bot.cline.app.zhcn`、公钥与更新地址。 |
| `apps/examples/desktop-app/src-tauri/tauri.windows.conf.json` | **Windows 窗口与打包配置** | 保证包含 `"targets": ["nsis"]`。 |
| `scripts/check-translations.ts` | **汉化健康度与雷达扫描脚本** | 词典 JSON/重复键/占位符/红线/漏键检查，可附带扫描上游两个 tag 间新增的硬编码英文。 |
| `scripts/scan-hardcoded-ui.ts` | **硬编码英文 AST 扫描** | 列出 webview 与 `@cline/ui` 组件中未经 `t()`/`uiText()` 的 JSX 英文文本与属性。 |
| `sdk/packages/ui/components/ui-text.ts` | **共享组件翻译桥** | `@cline/ui` 组件用 `uiText()` 取文案；桌面端在 `webview/lib/i18n.ts` 注册 `t()`，词条同样写进 `zh-CN.json`。测试环境返回英文原文。 |
| `.github/workflows/release.yml` | **GitHub Actions 云端自动流水线** | 微软云端 Windows 机器自动打包、签名并发布 Release。 |
| `.github/workflows/security-scan.yml` + `scripts/security-scan.sh` | **云端密钥扫描（Gitleaks）** | 推送 / PR / 每周 / 发布前自动跑，脱敏报告；我们自己的提交里有疑似密钥就失败并阻止发布。本地也可直接运行 `bash scripts/security-scan.sh`。 |
| `.gitleaksignore` | **Gitleaks 误报白名单** | 只能逐条写 Fingerprint 并注明理由，禁止整文件 / 整规则关闭。 |

---

## 5. 官方发布新版本时的标准维护流程 (SOP)

当 Cline 官方发布新版本（例如 `v0.0.44`）时，Grok Bot 应按以下 4 步执行：

### 步骤 1：同步官方上游代码
```bash
# 确保已添加官方 upstream 源
git remote add upstream https://github.com/cline/cline.git 2>/dev/null || true
git fetch upstream --tags

# 将官方最新版本合并到本地工作分支
git merge v0.0.44
```

### 步骤 2：运行汉化雷达扫描
```bash
# 全量词典检查 + 上游两个版本间新增硬编码英文扫描（有错误时退出码为 1）
bun scripts/check-translations.ts desktop-v0.0.44 desktop-v0.0.45
# 补充：AST 级硬编码英文扫描（需先 bun install）
bun scripts/scan-hardcoded-ui.ts
```

### 步骤 3：增量精准翻译与配置同步
1. 将雷达扫描出的新增英文，严格按照本文第 3 节的红线规范，翻译后追加到 `apps/examples/desktop-app/webview/locales/zh-CN.json`。
2. 如系统托盘 `apps/examples/desktop-app/src-tauri/src/main.rs` 有菜单变更，同步汉化并更新其中的单元测试。
3. 修改 `apps/examples/desktop-app/src-tauri/tauri.conf.json` 中的版本号为对应的新版本：
   ```json
   "version": "0.0.44"
   ```
4. 再次运行 `bun scripts/check-translations.ts`，确保 0 个错误、无未翻译词条。

### 步骤 4：打包前强制自检（主人要求，不可跳过）
汉化完成后、打包之前，必须逐项检查并记录：
1. **是否引入 bug**：`zh-CN.json` 合法、无重复键；`{name}` 等占位符与 HTML 标签与原文一致；`bun run build:sdk` 后在 `apps/examples/desktop-app` 跑 `bun run typecheck`、`bun run build:web`，以及 `bunx vitest run webview --config vitest.config.ts`（测试环境为英文，`t()` 的键必须与官方英文原文一字不差，否则测试会失败）。
2. **是否漏译 / 译得含糊 / 译错**：上面两个扫描脚本无遗漏；术语符合第 3 节红线（API Key、显示 / 隐藏密码、子代理 / 智能体、MCP 服务器、模型提供商）。

### 步骤 5：提交并打包（先出构建产物，主人确认后再发 Release）
提交前先确认只提交本次应改的文件，**禁止 `git add -A` 一把梭，禁止 `--no-verify` 跳过检查**：
```bash
git status --short                # 逐个确认改动；evals/cline-bench 等与本次无关的变动不要提交
git diff --stat                   # 审一遍 diff，确认没有 .env / 私钥 / 日志 / 个人路径等敏感内容
git add <逐个列出本次改动的文件或目录>
gitleaks git --pre-commit --redact --staged --verbose   # 与 pre-commit 钩子同一检查，可提前跑
git commit -m "chore: release v0.0.45 zh-cn"            # 会自动执行 .husky/pre-commit（Gitleaks）
bash scripts/security-scan.sh                           # 全历史 + 改动文件扫描（与云端一致）
git push origin desktop-zh-cn

# 只打包、不发布：手动触发工作流（publish_release 默认 false），产物在 Actions 运行页的 Artifacts 里
# 注意加 -R：本地同时有 upstream 远端，不加时 gh 可能默认指向官方 cline/cline 仓库
gh workflow run release.yml -R mzssma/cline-desktop-zh-cn --ref desktop-zh-cn
```
主人确认后再正式发布（二选一）：
- **推荐**：推送 Tag：`git tag v0.0.45 && git push origin v0.0.45`（自动构建并发布 Release）。`v*` 标签受仓库规则集保护：只有仓库管理员（主人账号）能创建，任何人都不能移动或删除；
- 仅用于重试（标签已存在且指向同一提交，比如上次发布中途失败）：`gh workflow run release.yml -R mzssma/cline-desktop-zh-cn --ref desktop-zh-cn -f publish_release=true -f version_tag=v0.0.45`。标签不存在时工作流会直接报错，因为 GITHUB_TOKEN 无权创建受保护标签。
仓库根目录存在 `RELEASE_NOTES_<tag>.zh.md` 时，工作流会自动用它作为 Release 说明（也可事后用 `gh release edit <tag> --notes-file ...` 覆盖）。

发布流水线的门禁（任何一项失败都不会发布）：Gitleaks 密钥扫描 → 汉化词典检查 + 类型检查 + webview / `@cline/ui` 单元测试 → Windows 打包 → 核对安装包 / 版本号 / latest.json / 签名一致 → 发布。正式发布只允许来自已推送到 `desktop-zh-cn` 的提交。

仓库规则集（主人已批准，2026-10-09）：`main` / `desktop-zh-cn` 禁止强推和删除；合并需通过 `Gitleaks secret scan` 检查（仓库管理员可直接推送，但推送后云端仍会扫描，发布前也会再扫一次）；`v*` 标签只有管理员能创建、禁止移动和删除。默认工作流权限为只读，与本项目无关的官方工作流已停用。

## 6. GitHub Actions 云端全自动打包机制

- **触发条件**：向仓库推送 `v*` 格式的 Git Tag（构建并发布 Release），或在 Actions 页面点击“Run workflow”（默认只构建并上传 Artifacts，勾选 `publish_release` 才发布 Release）。推送普通分支（包括 `security/**`）不会触发打包或发布。
- **安全要求**：`version_tag` 必须是 `v1.2.3` 格式并与 `tauri.conf.json` 版本一致；外部输入一律经 `env` 传入脚本；第三方 Action 固定到提交 SHA；`GITHUB_TOKEN` 默认无权限，只有最后的发布 job 有 `contents: write`；签名私钥只注入 Tauri 构建那一步。修改工作流后用 `actionlint` 和 `zizmor` 检查。
- **运行环境**：GitHub 官方托管的 Windows Server 虚拟机（`windows-latest`）。
- **运行耗时**：约 15~20 分钟（无需用户电脑开机，完全在云端静默运行）。
- **自动产出并上传到 GitHub Releases**：
  1. `Cline-zh-CN_<版本>_x64-setup.exe`（Windows 标准 NSIS 安装包；用纯 ASCII 文件名，因为 GitHub 会改写中文资产名）
  2. `cline-app.exe`（绿色免安装单文件）
  3. `Cline-zh-CN_<版本>_x64-setup.exe.sig`（Tauri 更新签名）
  4. `latest.json`（自动升级清单，由工作流根据 .sig 与安装包下载地址自动生成，含 `windows-x86_64` / `windows-x86_64-nsis` 两个平台键）
- **加密签名密钥**：已预置在 GitHub Secrets：
  - `TAURI_SIGNING_PRIVATE_KEY`
  - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
  构建流水线会自动调用私钥对更新包进行数字签名，保证客户端更新安全。

---

## 7. 常见问题排查 (Troubleshooting)

1. **Commit 时被 Gitleaks 钩子拦截**：
   - 这是安全检查在起作用，**不要用 `--no-verify` 绕过**，也不要关闭规则。
   - 先看报告（已脱敏）里的文件、行号和规则，逐条判断：
     - **真实密钥**（我们自己的 Token、API Key、私钥、密码等）：立刻从暂存区移除（`git restore --staged <文件>`），改用环境变量 / GitHub Secrets，并提醒主人撤销或轮换该凭据。已经推送过的不要私自改写历史，先报告主人。
     - **误报**（示例数据、测试占位符、公开客户端标识，或合并上游时带进来的、与上游官方文件完全一致的测试夹具，可用 `git diff --quiet desktop-vX.Y.Z -- <文件>` 确认未改动）：把报告里的 Fingerprint 加到 `.gitleaksignore`，上方写一行注释说明原因和确认日期，再正常提交。
   - 机器上没有 gitleaks 时，钩子会直接失败：先安装 gitleaks（https://github.com/gitleaks/gitleaks#installing），不要跳过。
   - 钩子后面的 `lint-staged`（apps/vscode）如果因依赖未安装而失败，先在仓库根目录 `bun install`，不要跳过整个钩子。
2. **需要手动触发云端打包**：
   - 访问 `https://github.com/mzssma/cline-desktop-zh-cn/actions/workflows/release.yml`。
   - 点击 **Run workflow** 按钮，可直接手动触发打包（默认只打包，不发布）。
3. **本地开发预览（可选）**：
   - 如果需要在本地调试界面，运行 `cd apps/examples/desktop-app && bun run dev`。
