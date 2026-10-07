<p align="center">
  <img src="assets/icons/icon.png" width="80" alt="Cline" />
</p>

<h1 align="center">Cline</h1>

<p align="center">
在您的 IDE、终端和桌面端运行的开源编程智能体。
</p>

<p align="center">
  <a href="README_zh.md"><strong>简体中文</strong></a> | <a href="README.md"><strong>English</strong></a>
</p>

> [!IMPORTANT]
> **非官方汉化声明 / Disclaimer**：
> 1. **项目性质**：本项目是 **Cline Desktop（桌面客户端）的社区非官方简体中文汉化版**，由个人独立维护与汉化。
> 2. **无官方关联**：本项目**与 Cline 官方团队（Cline Bot Inc.）没有任何从属、雇佣、赞助、授权或直接关联关系**。
> 3. **官方原版项目**：获取官方英文原版或寻求官方技术支持，请访问官方开源仓库 [github.com/cline/cline](https://github.com/cline/cline) 与官方网站 [cline.bot](https://cline.bot)。
> 4. **版权说明**：所有原始代码、商标与知识产权归原作者 Cline Bot Inc. 所有，本项目严格遵循 [Apache 2.0 开源协议](LICENSE) 进行开源合规分发。


<div align="center">

<div align="center">
<table>
<tbody>
<td align="center">
<a href="https://docs.cline.bot" target="_blank"><strong>文档 (Docs)</strong></a>
</td>
<td align="center">
<a href="https://discord.gg/cline" target="_blank"><strong>Discord</strong></a>
</td>
<td align="center">
<a href="https://www.reddit.com/r/cline/" target="_blank"><strong>r/cline</strong></a>
</td>
<td align="center">
<a href="https://github.com/cline/cline/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop" target="_blank"><strong>功能提议 (Feature Requests)</strong></a>
</td>
<td align="center">
<a href="https://cline.bot/join-us" target="_blank"><strong>加入我们 (Join us!)</strong></a>
</td>
</tbody>
</table>
</div>

</div>

<br>

<div align="center">
<table>
<tr>
<td align="center" width="50%">

### CLI

在终端中运行 Cline。
支持交互式对话，也支持完全无头的 CI/CD 与自动化脚本。

```
npm i -g cline
```

<a href="./apps/cli/README.md">了解更多</a>
<br><br>

</td>
<td align="center" width="50%">

### 桌面端 (Desktop App)

适用于 macOS 和 Windows 的 Cline 原生桌面应用。
可在任意本地文件夹中启动智能体任务、调度例行工作，并管理模型、插件与 MCP 服务。

<a href="https://github.com/mzssma/cline-desktop-zh-cn/releases/latest">下载 Cline 简体中文版 (Windows)</a>
<br><br>

</td>
</tr>
<tr>
<td align="center" width="50%">

### VS Code 插件

在编辑器中的 AI 编程助手。
创建文件、运行命令、浏览网页，并在人工审核确认下使用各项工具。

<a href="https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev">从 VS Marketplace 安装</a>
<br><br>

</td>
<td align="center" width="50%">

### JetBrains 插件

在 IntelliJ IDEA、PyCharm、WebStorm、GoLand 等整个 JetBrains 家族 IDE 中体验相同的 Cline。

<a href="https://plugins.jetbrains.com/plugin/28247-cline">从 JetBrains Marketplace 安装</a>
<br><br>

</td>
</tr>
</table>
</div>

<div align="center">
<table>
<tr>
<td align="center">

### SDK

使用驱动 CLI、桌面端、VS Code 插件和 JetBrains 插件的相同核心引擎，构建属于您自己的 AI 智能体与集成工具。支持自定义工具、多智能体团队、连接器、定时调度自动化等丰富能力。

```
npm install @cline/sdk
```

<a href="https://docs.cline.bot/cline-sdk/overview">开发文档</a>
<br><br>

</td>
</tr>
</table>
</div>

---

## 索引 (Index)

| 产品 | 描述 | 源码目录 | 更新日志 |
|---------|------------|--------------|--------------|
| **SDK** | Node.js 编程式智能体 API 与扩展导出。 | [`sdk/`](https://github.com/cline/cline/tree/main/sdk) | [CHANGELOG.md](https://github.com/cline/cline/blob/main/sdk/CHANGELOG.md) |
| **CLI** | 终端 UI、无头模式、Shell 命令与 CLI 专属工作流。 | [`apps/cli/`](https://github.com/cline/cline/tree/main/apps/cli) | [CHANGELOG.md](https://github.com/cline/cline/blob/main/apps/cli/CHANGELOG.md) |
| **VS Code Extension** | Marketplace 扩展与插件宿主集成。 | [`/`](https://github.com/cline/cline/tree/main) | [CHANGELOG.md](https://github.com/cline/cline/blob/main/CHANGELOG.md) |
| **Desktop App** | 原生 macOS 与 Windows 应用（Tauri 外壳、Bun 伴生进程、Next.js 界面）。*（本仓库维护 Windows 简体中文汉化版）* | [`apps/examples/desktop-app/`](https://github.com/cline/cline/tree/main/apps/examples/desktop-app) | [CHANGELOG.md](https://github.com/cline/cline/blob/main/apps/examples/desktop-app/CHANGELOG.md) |
| **JetBrains Plugin** | 与共享智能体核心通信的 JetBrains 客户端。 | 暂未开源 | - |
| **文档站点** | 官方公开文档。 | [`docs/`](https://docs.cline.bot/) | - |

## 全项目代码修改 (Edits Code Across Your Project)

Cline 读取您的项目结构，理解文件之间的关系，并在整个代码库中协同进行修改。它在工作时持续监控 linter 代码检查与编译器报错，在您察觉前即自动修复缺失导入、类型不匹配和语法错误等问题。在 VS Code 和 JetBrains 中，每一次编辑都会以 Diff 形式呈现，供您审查、修改或还原。所有更改均通过检查点（Checkpoints）追踪记录，以便随时轻松回滚撤销智能体的工作。

## 运行终端命令 (Runs Bash Commands)

Cline 直接在您的终端中执行命令并实时监控输出结果。安装软件包、运行构建脚本、执行测试、部署应用程序、管理数据库。对于长时间运行的进程（例如开发服务器），Cline 会在后台持续工作并对新出现的输出作出响应，在编译错误、测试失败和服务器崩溃发生时第一时间捕获排查。

## 规划与执行模式 (Plan and Act)

在 Plan（规划模式）和 Act（执行模式）之间自由切换。在 Plan 模式下，Cline 探索您的代码库、提出明确的问题并制定策略；一旦达成共识，切换到 Act 模式即可让 Cline 开始执行计划。每一次文件编辑和终端命令都需要得到您的批准，确保您对代码的实际更改始终保持完全掌控；您也可以开启自动批准（Auto-approve）让 Cline 全自主运行。

## 规则与技能系统 (Rules and Skills)

在 `.clinerules` 文件中定义项目专属规则，指导 Cline 如何在您的代码库中工作：编码规范、架构约定、部署流程、测试要求。这些规则会自动被 CLI、VS Code 插件和 JetBrains 插件识别生效。还可以使用技能（Skills）让模型在需要时动态加载特定领域的规则。

## 支持任意模型 (Works With Every Model)

Cline 不绑定任何单一 AI 提供商。使用适合您工作流的任意模型：

| 模型提供商 | 支持模型 |
|----------|--------|
| Anthropic | Claude Opus, Sonnet, Haiku |
| OpenAI | GPT 系列模型 |
| Google | Gemini 系列模型 |
| OpenRouter | 来自各大提供商的 200+ 款模型 |
| Vercel AI Gateway | 通过单一网关路由到多家提供商 |
| AWS Bedrock | Claude, Llama 等 |
| Azure / GCP Vertex | 所有托管模型 |
| Cerebras / Groq | 高速推理模型 |
| Ollama / LM Studio | 在本地机器上运行本地开源模型 |
| 任意 OpenAI 兼容 API | 自建或第三方兼容端点 |

## 插件与 MCP 服务扩展 (Extend With Plugins or MCP Servers)

通过插件系统扩展 Cline 的能力。使用 SDK，通过插件系统以编程方式注册工具和生命周期钩子，用于日志记录、安全审计、策略实施或添加特定领域的能力。简易插件示例如下：

```typescript
import { Agent, createTool } from "@cline/sdk"

const deployTool = createTool({
  name: "deploy",
  description: "Deploy the current branch to staging.",
  inputSchema: { type: "object", properties: { env: { type: "string" } }, required: ["env"] },
  execute: async (input) => {
    // 您的部署逻辑
  },
})

const agent = new Agent({ tools: [deployTool], /* ... */ })
```
...或者使用 [MCP (Model Context Protocol)](https://github.com/modelcontextprotocol) 连接数据库、查询 API、管理云基础设施并与外部系统交互。使用社区构建的 MCP 服务，或让 Cline 实时创建自定义工具。在 CLI 中，使用 `cline mcp` 进行服务管理。

## 多智能体团队协作 (Multi-Agent Teams)

协调多个智能体协同处理复杂任务。协调员智能体将工作拆分为子任务，并分配给专门的专家智能体，每个智能体都拥有自己的工具与上下文。团队状态在各会话之间持久保存，您可以随时从上次中断的地方继续。

```bash
cline --team-name auth-sprint "规划并实现带测试的用户身份验证"
```

## 定时调度智能体 (Scheduled Agents)

使用 cron 表达式在定时计划上运行智能体以执行周期性自动化工作：每日 PR 汇总、每周依赖项检查、代码库健康报告。定时调度在系统重启后依然有效，独立于任何终端会话运行。

```bash
cline schedule create "PR summary" \
  --cron "0 9 * * MON-FRI" \
  --prompt "列出所有未关闭的 PR 及其审核状态" \
  --workspace /path/to/repo
```

## 连接即时通讯平台 (Connect to Slack, Telegram, Discord, and More)

从您熟悉的任何即时通讯平台与智能体对话：Telegram、Slack、Discord、Google Chat、WhatsApp 和 Linear。每个会话线程都映射到包含完整上下文的智能体任务。设置访问控制以限制谁可以与您的智能体进行交互。

```bash
# 连接到 Telegram
cline connect telegram -k $BOT_TOKEN
# 通过 Webhook 连接到 Slack
cline connect slack --bot-token $SLACK_TOKEN --signing-secret $SECRET --base-url $URL
# 使用 Socket 模式连接到 Slack
cline connect slack --bot-token $SLACK_TOKEN --app-token $SLACK_APP_TOKEN
```

## 适用于 CI/CD 的无头 CLI (Headless CLI for CI/CD)

以零交互方式运行 Cline 进行脚本编写和流水线自动化。管道输入、获取 JSON 输出、链式组合命令、无缝集成到 CI/CD 流水线中。

```bash
cline "运行测试并修复所有失败项"
git diff origin/main | cline "审查这些更改是否存在问题"
cline --json "列出所有 TODO 注释" | jq -r 'select(.type == "agent_event" and .event.text) | .event.text'
```

## 参与贡献 (Contributing)

请参阅 [贡献指南 (Contributing Guide)](CONTRIBUTING.md)。加入我们的 [Discord](https://discord.gg/cline) 并前往 `#contributors` 频道与其他贡献者交流。查看我们的 [招聘页面](https://cline.bot/join-us) 获取全职工作机会。

## 开源许可 (License)

[Apache 2.0 © 2026 Cline Bot Inc.](./LICENSE)
