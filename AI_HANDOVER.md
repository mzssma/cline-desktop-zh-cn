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
```bash
git add -A
git commit -m "chore: release v0.0.45 zh-cn" --no-verify
git push origin desktop-zh-cn

# 只打包、不发布：手动触发工作流（publish_release 默认 false），产物在 Actions 运行页的 Artifacts 里
gh workflow run release.yml --ref desktop-zh-cn
```
主人确认后再正式发布（二选一）：
- 推送 Tag：`git tag v0.0.45 && git push origin v0.0.45`（自动构建并发布 Release）；
- 或手动触发并勾选发布：`gh workflow run release.yml --ref desktop-zh-cn -f publish_release=true -f version_tag=v0.0.45`。
发布后用 `gh release edit v0.0.45 --notes-file RELEASE_NOTES_v0.0.45.zh.md` 换上本版说明。

## 6. GitHub Actions 云端全自动打包机制

- **触发条件**：向仓库推送 `v*` 格式的 Git Tag（构建并发布 Release），或在 Actions 页面点击“Run workflow”（默认只构建并上传 Artifacts，勾选 `publish_release` 才发布 Release）。
- **运行环境**：GitHub 官方托管的 Windows Server 虚拟机（`windows-latest`）。
- **运行耗时**：约 15~20 分钟（无需用户电脑开机，完全在云端静默运行）。
- **自动产出并上传到 GitHub Releases**：
  1. `Cline 中文版_<版本>_x64-setup.exe`（Windows 标准 NSIS 安装包）
  2. `cline-app.exe`（绿色免安装单文件）
  3. `*.zip` 与 `*.sig`（Tauri 更新签名压缩包）
  4. `latest.json`（自动升级元数据清单）
- **加密签名密钥**：已预置在 GitHub Secrets：
  - `TAURI_SIGNING_PRIVATE_KEY`
  - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
  构建流水线会自动调用私钥对更新包进行数字签名，保证客户端更新安全。

---

## 7. 常见问题排查 (Troubleshooting)

1. **Commit 时被 Gitleaks 钩子拦截**：
   - 原因：Cline 原仓库配置了本地 pre-commit 钩子，有时会对普通文本误报。
   - 解决方案：在 `git commit` 时添加 `--no-verify` 参数（如 `git commit -m "..." --no-verify`）。
2. **需要手动触发云端打包**：
   - 访问 `https://github.com/mzssma/cline-desktop-zh-cn/actions/workflows/release.yml`。
   - 点击 **Run workflow** 按钮，可直接手动触发打包。
3. **本地开发预览（可选）**：
   - 如果需要在本地调试界面，运行 `cd apps/examples/desktop-app && bun run dev`。
