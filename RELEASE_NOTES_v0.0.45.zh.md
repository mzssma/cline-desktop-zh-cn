### 🤖 Cline Desktop 简体中文汉化版 v0.0.45

本版本基于官方 [desktop-v0.0.45](https://github.com/cline/cline/releases/tag/desktop-v0.0.45) 制作，已完成界面、菜单、设置及系统托盘的简体中文汉化。

#### 官方更新（对照 desktop-v0.0.45 changelog 逐条汉化）

- SSH 远程环境可以再次正常启动。自 0.0.38 起，连接 SSH 环境会报错 `SyntaxError: Invalid character`
- 在 SSH 环境中，Git 分支标签不再每 5 秒新开两次 SSH 登录。现在改为每 30 秒检查一次；通过分支选择器切换分支时，标签仍会立即更新
- 输入框中较长的模型名称在空间足够时会完整显示，只有空间不足时才会截断
- 在 GPT-6 Astra、GPT-6.1 Sol、Claude Fable 5 或 Claude Opus 5.5 上关闭推理（reasoning）时，不再出现 400 错误
- 当 MCP 服务器或钩子（hook）在读完全部输入之前就退出时，后台服务不再在约 3 秒后崩溃
- 从 VS Code 扩展迁移过来的设置不再多出一个空的 SAP AI Core 模型提供商
- 已刷新模型目录，新增 Claude Haiku 5.5。Google Vertex AI（Claude Sonnet 5.5 → Claude Haiku 5.5）、Cortecs、DevPass（LLM Gateway）、Eden AI、GitHub Copilot、LLM Gateway、NanoGPT、OpenCode Go、Requesty 与 Vivgrid 的默认模型有变更（多数改为 Claude Haiku 5.5）

#### 本仓库（汉化版）说明

- **独立安装共存**：产品名为「Cline 中文版」，Bundle ID 为 `bot.cline.app.zhcn`，可与官方英文原版同时安装、独立运行，不抢焦点、不互相覆盖。
- **数据共享互通**：共享 `~/.cline` 配置，历史任务、模型设置与 API Key 互通。
- **自动检测更新**：更新端点指向本仓库 `mzssma/cline-desktop-zh-cn` 的 `latest.json`，避免被官方英文版覆盖。
- **界面汉化补全**：我们这次把之前漏掉的共享组件文案也接入了中文词典，包括：
  - 工具审批卡片的「批准 / 拒绝」按钮；
  - Cline 追问卡片（可多选提示、自定义回答输入框、提交 / 正在发送）；
  - 输入框里的排队消息（「已排队 N 条消息」「下一轮插入」、编辑 / 移除等按钮）；
  - 输入框右侧的上下文用量弹窗（上下文窗口、输入 / 输出 / 缓存 Token、费用）；
  - Pull Request 状态栏（合并状态、CI 检查结果、创建 PR、刷新等）；
  - 命令输出、差异视图、图片查看器、Mermaid 图表「重试」按钮；
  - 定时任务的星期（周一至周日）、扩展市场的类型说明、插件「命令」分组，以及若干操作报错提示。
- **译法统一与修正**：「MCP Server」统一译为「MCP 服务器」（此前「MCP 服务」与「MCP 服务器」混用）；「Steer」由含糊的「调整」改为更具体的「插入下一轮」；「Provider」统一为「模型提供商」；「No keys」明确写作「无需 API Key」。
- **问题修复**：修正「打开文件夹 “…”」一处词条引号与官方原文不一致的问题（中文界面不受影响，但会导致英文回退文本与官方不符）。
- **打包前自检**：我们在打包前做了一轮汉化自检——词典 JSON 合法、无重复键、插值占位符与原文一致、红线术语（API Key、显示 / 隐藏密码、子代理 / 智能体）合规；前端类型检查、生产构建与相关单元测试均通过。

#### 📦 下载说明

- **Windows 独立安装版**：下载 `Cline 中文版_*_x64-setup.exe`，双击按向导安装。
- **Windows 绿色免安装版**：下载 `cline-app.exe`，双击直接运行。

对照上游：https://github.com/cline/cline/compare/desktop-v0.0.44...desktop-v0.0.45
