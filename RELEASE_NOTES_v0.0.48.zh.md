# Cline 中文版 v0.0.48

基于上游 Cline Desktop `desktop-v0.0.48`（提交 a42df8c8）。

## 官方更新内容

- GPT-6 系列模型（如 `gpt-6-sol` 和 `gpt-6.1-sol`）现在可以在 OpenAI 及 Azure OpenAI 兼容端点上正常使用。此前由于 Cline 发送的是 `max_tokens` 而不是 `max_completion_tokens`，每个请求都会被拒绝
- Cline 模型提供商的默认模型重新改回 Claude Sonnet 5.5，它再次回到 Cline 推荐列表的首位
- 已刷新模型目录。新增 CommandCode 与 Reflection 模型提供商。以下提供商的默认模型有变更：302.AI（改为 Gemini 4 Argon），Eden AI 与 Prime Inference（改为 Muse Spark Open），CoreWeave（改为 Reflection Beam 1.0），NanoGPT、Pioneer（改为 Nemotron 3.5 Super VL），以及 Scaleway（改为 DeepSeek V4.1 Flash）

## 我们的汉化更新

- 我们同步了上游 v0.0.48 的全部代码，并保留了中文版的应用名称、标识与自动更新地址
- 我们重新检查了合并后的界面：本次上游没有新增需要翻译的界面文字，此前的汉化也没有因上游改动而丢失；新增的模型提供商名称（CommandCode、Reflection）保持原名

## 下载

- Windows 安装包：`Cline-zh-CN_0.0.48_x64-setup.exe`
- 已安装 v0.0.47 的用户可通过应用内自动更新升级
