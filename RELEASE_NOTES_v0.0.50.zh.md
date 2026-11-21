# Cline 中文版 v0.0.50

基于上游 Cline Desktop `desktop-v0.0.50`（提交 e68fba63b3）。

## 官方更新内容

- 思考深度选择器新增 **最高** 档位，供最高推理级别为 max 的模型使用
- 手动执行的 `/compact` 现在可以停止。此前若摘要过程卡住，界面会一直停在「思考中…」，且没有「停止」按钮
- 未保存过模型时，Cline 模型提供商现在会默认使用免费列表中的第一个模型，而不再使用 Claude Sonnet 5.5。已保存的选择不受影响
- 账户页面新增指向 Cline 网页端数据使用偏好的「隐私设置」链接
- 设置 → 关于 中新增 **第三方声明** 入口，可查看 Cline 所包含开源软件的许可证
- 在 macOS 上，从菜单点击「检查更新」只会运行一次，而不再触发两次
- 刷新了应用中的配色和字体
- `read_files` 的结果在送给模型时不再被截断为 8k 字符。一次读取现在会完整送达，上限仍是该工具自身的 2000 行或约 48k 字符
- 在压缩或切换模型之后，Reflection Beam 不再每一轮都因 `400 Missing required parameter: 'messages[n].reasoning_content'` 失败
- 对于模型目录中没有描述的模型，压缩不再退回到基础摘要。此前摘要器会发送 `reasoning_effort: "none"`，部分接口会因此拒绝请求
- 关闭推理现在也会作用于已保存「模型配置」覆盖项的自定义模型。此前 gpt-5.6 和 gpt-6 的 chat-completions 接口会拒绝每一次工具调用
- 在原生 OpenAI 模型提供商上，推理级别会按每个模型实际支持的范围调整，因此 GPT-5.x 和 o 系列模型不再拒绝 `max` 和「超高」档位
- LiteLLM：当模型报告了 `max_output_tokens` 时，不再把旧的 `max_tokens` 字段当作输入预算
- 已刷新模型目录。从 models.dev 新增 94 个模型提供商，并移除 Lilac 与 Tempr。Cline 推荐列表新增 Muse Ember。Cline 免费列表移除 Reflection Beam、Laguna S 2.1 与 Solar Mini 4。ClinePass 移除 DeepSeek V4.1 Flash、Mimo V2.6 Flash、Mimo V2.6 Pro、MiniMax M3、Qwen3.7 Plus 与 Qwen3.7 Max。另有 67 个模型提供商的默认模型有变更，大多改为 Kimi K3.1 Pro、Gemini 4 Neon（包括 `gemini` 和 `vertex` 提供商）或 DeepSeek V4.1 Flash 1017

## 我们的汉化更新

- 我们同步了上游 v0.0.50 的全部代码，并保留了中文版的应用名称、标识与自动更新地址
- 我们为本版新增的界面完成了汉化（新增约 96 条译文），包括：
  - 思考深度选择器中的「最高」档位，以及压缩卡住时「正在压缩…点击「停止」可取消」的提示
  - 账户页的「隐私设置」，以及关于页的「第三方声明」入口
  - 将本地会话继续到 Cline Cloud 的交接界面（确认推送、进度与失败提示、恢复草稿等）
  - 对话中已发布的图片与文件（下载、重试、轮播），以及 UX 验证报告组件
- 我们重新检查了合并后的界面，确认此前的汉化没有因上游改动而丢失，冲突处也保留了原有的译文包裹和新的样式调整

## 下载

- Windows 安装包：`Cline-zh-CN_0.0.50_x64-setup.exe`
- 已安装 v0.0.49 的用户可通过应用内自动更新升级
