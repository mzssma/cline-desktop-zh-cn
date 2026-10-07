<p align="center">
  <img src="assets/icons/icon.png" width="80" alt="Cline" />
</p>

<h1 align="center">Cline Desktop 简体中文汉化版</h1>

<p align="center">
  <strong>开箱即用、深度汉化、支持独立共存与自动更新的 Cline 桌面端</strong>
</p>

<p align="center">
  <a href="https://github.com/mzssma/cline-desktop-zh-cn/releases/latest">
    <img src="https://img.shields.io/github/v/release/mzssma/cline-desktop-zh-cn?label=%E6%9C%80%E6%96%B0%E7%89%88%E6%9C%AC&color=blue" alt="Latest Release" />
  </a>
  <a href="https://github.com/mzssma/cline-desktop-zh-cn/actions/workflows/release.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/mzssma/cline-desktop-zh-cn/release.yml?label=%E4%BA%91%E7%AB%AF%E6%89%93%E5%8C%85&color=green" alt="Build Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/%E5%BC%80%E6%BA%90%E5%8D%8F%E8%AE%AE-Apache%202.0-blue" alt="License" />
  </a>
  <a href="README.md">
    <img src="https://img.shields.io/badge/Language-English-orange" alt="English README" />
  </a>
</p>

<p align="center">
  <a href="README_zh.md"><strong>简体中文</strong></a> | <a href="README.md"><strong>English</strong></a>
</p>

---

## 🌟 项目简介

本项目是 [Cline Desktop](https://github.com/cline/cline) 官方桌面端的**非官方深度简体中文汉化版**。

致力于在紧密跟进官方版本更新的同时，提供符合中文用户习惯的优质交互体验。采用高可靠的汉化架构，支持与英文原版共存、配置完全共享互通，并通过 GitHub Actions 实现全自动云端打包与签名升级。

---

## ✨ 核心特性

1. **深度完整汉化**：
   - 超过 1,100+ 条界面词条深度汉化。
   - 覆盖所有按钮、菜单、弹窗、Tooltip 提示、空状态、设置面板、Provider 模型提供商配置等。
   - **Windows 系统托盘原生菜单**（右键菜单、运行状态、会话计数）深度汉化。

2. **独立安装与完美共存（Side-by-Side）**：
   - **专属应用名称**：`Cline 中文版`。
   - **独立应用标识**：`bot.cline.app.zhcn`。
   - **独立互斥锁**：汉化版与官方英文原版拥有各自独立的单实例锁，**两者可在同一台电脑同时运行**，不会互相抢占窗口。

3. **数据 100% 共享互通**：
   - 统一读写系统主目录下的 `~/.cline`（Windows 下为 `C:\Users\<用户名>\.cline`）。
   - 对话历史记录、模型提供商设置、API Key 与 MCP 工具配置完全共享，无需重复配置。

4. **自建在线自动检测更新**：
   - 客户端集成数字签名在线更新检测，新版本发布后自动提醒更新。
   - 避免被官方英文原版静默覆盖，同时享受无缝更新的便利。

5. **关机云端自动打包（GitHub Actions）**：
   - 配置了完整的 Windows CI/CD 自动化流水线，基于微软云端服务器自动完成编译、UPX 压缩、数字签名并发布 Release。

---

## 📥 下载与安装

请前往 **[Releases 页面](https://github.com/mzssma/cline-desktop-zh-cn/releases/latest)** 下载最新版本：

| 文件名称 | 格式类型 | 说明 |
| :--- | :--- | :--- |
| `Cline 中文版_x.x.x_x64-setup.exe` | **Windows 标准安装包** | 推荐大多数用户使用，内置自动更新检测，双击按向导安装。 |
| `cline-app.exe` | **绿色免安装单文件** | 纯净绿色版，无需安装，解压/双击直接运行。 |

---

## 遵守的汉化约定

为了保证翻译风格专业统一，本项目严格遵循以下原则：

- **API Key 保留英文**：所有界面中统一写为 `API Key`（不翻译为“API 密钥”）。
- **密码切换框**：统一写作“显示密码” / “隐藏密码”（不使用“显示机密”）。
- **专业技术术语**：
  - `Sub-agent` $\rightarrow$ **子代理**
  - `Agent` $\rightarrow$ **智能体**
  - `Agent Team` $\rightarrow$ **智能体团队**
  - `Provider` $\rightarrow$ **模型提供商** / **服务提供商**
- **品牌名称保持原文**：OpenAI、Anthropic、Gemini、OpenRouter、DeepSeek、Cline 等品牌名全部保留英文。
- **不侵入底层核心**：绝不翻译发送给大模型的 Prompt、System 指令与内部协议 JSON，确保 100% 的原有智能度与代码合并兼容性。

---

## 🛠️ 本地开发与构建

如果你想在本地自行调试或打包：

### 1. 环境准备
- Node.js 20+ 与 [Bun](https://bun.sh/) 1.4+
- [Rust](https://rustup.rs/) 稳定版工具链
- Windows 构建工具（Visual Studio C++ 生成工具）

### 2. 启动开发模式
```bash
# 1. 安装依赖
bun install

# 2. 编译基础 SDK
bun run build:sdk

# 3. 启动桌面端热重载开发预览
cd apps/examples/desktop-app
bun run dev
```

### 3. 一键本地打包
在项目根目录直接双击执行 **`双击一键打包.bat`**，或运行：
```bash
cd apps/examples/desktop-app
bunx tauri build --bundles nsis
```
打包产物将自动输出在根目录下。

---

## 🤖 长期维护与 AI 协同

本项目配备了自动化雷达检测工具与详尽的 AI 接管手册：
- **汉化健康度与雷达扫描**：`scripts/check-translations.ts`（根目录下可直接双击 `双击检查未翻译词条.bat`）。
- **AI 协作接管手册**：[`AI_HANDOVER.md`](AI_HANDOVER.md)（专为 Grok Bot / 协作 AI 编写的标准维护流程 SOP）。

---

## 📄 开源许可证

本项目基于 **Apache License 2.0** 协议开源，保留原作者 [Cline Bot Inc.](https://cline.bot) 的全部版权。

详情请参阅 [LICENSE](LICENSE) 文件。
