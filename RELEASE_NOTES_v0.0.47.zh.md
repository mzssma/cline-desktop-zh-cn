# Cline 中文版 v0.0.47

基于上游 Cline Desktop `desktop-v0.0.47`（提交 98a53322）。

## 官方更新内容

- goal 等插件市场插件可以再次正常加载。在 0.0.46 中，由于打包后的应用没有包含插件所引用的 SDK 包，这些插件会报错 `Cannot find module '@cline/sdk'`
- 设置中的「Cloud 会话」开关已移除。只要 Cloud 会话可用，就会默认开启
- 当模型提供商错误在流式输出中途打断回复时，Cline 会最多重试 3 次，之后才判定本轮失败
- Cline 模型提供商的默认模型改为 Gemini 4 Argon，它是 Cline 推荐列表中新的第一个模型
- 已刷新模型目录。新增 Boundless 与 Standard Compute 模型提供商；SambaNova 现在改由模型目录提供，默认模型为 MiniMax M3。Cline 推荐列表新增 Gemini 4 Argon、移除 Grok 4.7；Cline 免费列表用 Nemotron 3.5 Super VL 替换了 Step 5 Preview。OpenCode Go 不再列出 MiniMax M2.7。以下提供商的默认模型有变更：Cortecs、CrossModel、Eden AI、Google Gemini、GitHub Copilot、Google Vertex AI、LLM Gateway、Ofox、OpenCode Go 与 Prime Inference（改为 Gemini 4 Argon），Fireworks AI、Nebius Token Factory 与 Requesty（改为 Muse Spark Open），CoreWeave、DigitalOcean、NanoGPT 与 Nvidia（改为 Nemotron 3.5 Super VL），Aixy 与 Neon（改为 Claude Haiku 5.5），以及 Agnes AI、Ambient、IteraCompute、Poe、Scaleway 与 SenseNova

## 我们的汉化更新

- 我们同步了上游 v0.0.47 的全部代码，并保留了中文版的应用名称、标识与自动更新地址
- 上游移除了设置中的「Cloud 会话」开关，我们相应移除了该处的汉化界面，其余界面汉化保持不变
- 我们重新检查了合并后的界面，本次上游没有新增需要翻译的界面文字，此前的汉化也没有因上游改动而丢失

## 下载

- Windows 安装包：`Cline-zh-CN_0.0.47_x64-setup.exe`
- 已安装 v0.0.46 的用户可通过应用内自动更新升级
