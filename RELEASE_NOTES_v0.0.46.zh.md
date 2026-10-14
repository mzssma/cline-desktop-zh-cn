# Cline 中文版 v0.0.46

基于上游 Cline Desktop `desktop-v0.0.46`（提交 1a25410ccd）。

## 官方更新内容

- 对话左侧边缘新增大纲，列出你发送过的每条提示词。悬停标记可预览提示词，点击即可跳转到该处
- 插件加载失败或在会话中出错时，聊天中会显示一行状态，注明插件名称和错误信息，不再悄无声息地丢失其工具
- 等待浏览器完成 Cline Cloud 登录时，现在可以取消登录
- 在网页端重命名的会话标题现在会同步更新到应用中
- 未登录时，Cloud 设置卡片在较小窗口中也能保持可见
- 未安装 Git 时安装技能（skill），现在会提示需要 Git 以及如何解决，而不是显示原始的克隆错误
- 定时任务（routine）：排队中的运行现在会正常启动，不再一直停留在等待状态；模型调用失败（例如模型已下线）的运行会被标记为失败并附上错误信息；停机恢复后只会补跑最近一次错过的运行，而不是把错过的每一次接连全部补跑。任务编辑器现在列出的是当前可用模型，而不是已下线的模型
- 未选择模型时，Cline 模型提供商会使用 Cline 推荐列表中的第一个模型（Claude Sonnet 5.5）
- 关闭推理（reasoning）现在对所有模型提供商都生效。无法关闭推理的模型会保持默认设置；仅支持推理级别的 Gemini 模型不再因 thinking-budget 错误拒绝请求
- 截图和其他图片不再虚增 token 估算。此前这会导致对话远未接近上限时就触发自动压缩
- 当模型目录条目没有上下文窗口信息时，自动压缩会使用所选模型的上下文窗口
- 以符号链接（symlink）形式存在的规则文件现在可以正常加载
- 现在会发现 `.claude/skills` 中的技能
- 编辑器工具不再从某些模型收到 null 来代替要替换的文本
- 已刷新模型目录。新增 AI/ML API、LowRouter 与 Prime Inference 模型提供商。v0 提供商现在只提供其默认模型 `v0-1.5-md`；OpenCode Go 改用新端点 `https://opencode.ai/inference/go/v1`。Cline 免费列表新增 Step 5 Preview。以下提供商的默认模型有变更：302.AI、CrossModel、Cortecs、DigitalOcean、NEAR AI Cloud 与 Ofox（改为 Claude Haiku 5.5），DevPass（LLM Gateway）、LLM Gateway 与 Meta（改为 Muse Wonder 1.0），Aixy（改为 GPT-6.1 Sol），CloudFerro Sherlock 与 Moark（改为 GLM 5.3），以及 Ambient、NanoGPT、Neuralwatt 与 Novita AI

## 我们的汉化更新

- 我们同步了上游 v0.0.46 的全部代码，并为新增界面完成了汉化：对话大纲（悬停预览、跳转到第 N 条消息）、取消 Cloud 登录（「取消」按钮及取消失败提示）、消息列表「滚动到底部 / 滚动到顶部」按钮
- 我们修复了一个汉化遗漏：模型提供商设置表单中各字段的标题与说明此前直接显示英文，现已全部走翻译。同时补齐了 Amazon Bedrock、Google Vertex AI、Qwen、OCA 等提供商的字段译文（AWS 区域、认证方式、访问密钥 ID、跨区域推理、Google Cloud 项目 ID、提示词缓存等）
- 我们按反馈优化了模型提供商配置相关措辞：
  - 「由模型提供商签发的 API Key。」
  - 「基础 URL」
  - 「模型提供商请求使用的基础端点。」
  - 「填写 API Key 并保存即可完成配置。如果该提供商通过环境变量或本地服务获取凭据，无需填写 Key，请直接点击「连接」。」
- 我们汉化了欢迎页标题「想让我帮你构建什么？」（含构建 / 创作 / 修复 / 了解等轮换动词）
- 我们重新检查了合并后的界面，确认此前的汉化没有因上游改动而丢失

## 下载

- Windows 安装包：`Cline-zh-CN_0.0.46_x64-setup.exe`
- 已安装 v0.0.45 的用户可通过应用内自动更新升级
