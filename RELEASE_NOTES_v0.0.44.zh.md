### 🤖 Cline Desktop 简体中文汉化版 v0.0.44

本版本基于官方 [desktop-v0.0.44](https://github.com/cline/cline/releases/tag/desktop-v0.0.44) 制作，已完成界面、菜单、设置及系统托盘的简体中文汉化。

#### 官方更新（对照 desktop-v0.0.44 changelog 逐条汉化）

- 聊天中的 Mermaid 图表现在以内联交互式图表呈现，支持复制、下载、全屏以及平移/缩放。图表内的链接与其他链接一样会先弹出确认对话框，显示真实目标地址后再打开
- 若对话中途 Cline Hub 连接中断，应用现在会自动重连会话，最长约一分钟，而不是立刻失败。重连成功后会发送排队中的消息；若无法重连，本轮会结束并提示，便于你重新发送
- 无需 API Key 的本地与自建模型提供商（LM Studio、Ollama、vLLM、LiteLLM 以及自定义 OpenAI 兼容端点）可以再次正常开启会话。此前每一轮都会因 “Missing API key” 失败
- Windows 上通过 `npx` 或 `uvx` 启动的 MCP 服务器现在可以正常加载。此前常因超过 3 秒启动时限而被静默丢弃；默认时限现已改为 10 秒
- 通过自定义 Anthropic base URL（Azure AI Foundry、企业网关等）访问 Claude 时，不再出现 400 错误
- Kimi K3 及其他仅接受特定推理级别的模型不再拒绝请求。应用会选择该模型支持的最接近级别
- 若模型回复结束时没有可识别的 finish reason，智能体现在会再请求继续一次，而不再直接视为回复已完成
- 已刷新模型目录。Cline 免费列表新增 Solar Mini 4，并移除 DeepSeek V4.1 Flash 与 space-bunny-alpha。AKI.IO、Blue Claw、CoralBricks、CrossModel、DevPass、LLM Gateway、Mistral、NanoGPT、Requesty、Neon、Subconscious 与 The Grid AI 的默认模型有变更

#### 本仓库（汉化版）说明

- **独立安装共存**：产品名为「Cline 中文版」，Bundle ID 为 `bot.cline.app.zhcn`，可与官方英文原版同时安装、独立运行，不抢焦点、不互相覆盖。
- **数据共享互通**：共享 `~/.cline` 配置，历史任务、模型设置与 API Key 互通。
- **自动检测更新**：更新端点指向本仓库 `mzssma/cline-desktop-zh-cn` 的 `latest.json`，避免被官方英文版覆盖。
- **界面汉化**：含本次新增的 Hub 重连状态提示、Hub 中断通知，以及 Mermaid 图表工具栏文案。

#### 📦 下载说明

- **Windows 独立安装版**：下载 `Cline 中文版_*_x64-setup.exe`，双击按向导安装。
- **Windows 绿色免安装版**：下载 `cline-app.exe`，双击直接运行。

对照上游：https://github.com/cline/cline/compare/desktop-v0.0.43...desktop-v0.0.44
