# Soul & Agent 构建器

AI 人格创作工具 — 通过拖拽模块化组件，快速创建高质量 AI Agent/Soul

**在线演示：** https://lgz-star.github.io/soul-agent-builder/

---

## 功能亮点

- **7 层通用结构** — 身份/能力/风格/流程/约束/知识/工具，覆盖所有 Soul 要素
- **拖拽式组装** — 像搭积木一样创建 Soul
- **一键分享** — 生成专属链接，瞬间分享你的创作成果
- **多格式导出** — Markdown + JSON（支持 OpenClaw + Claude Code）
- **AI 一键生成** — 输入需求描述，AI 自动帮你创建 Soul（进度可视化 + 随时取消）

---

## 快速开始

### 开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/soul-agent-builder.git
cd soul-agent-builder

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

### 构建

```bash
bun run build

# 预览构建结果
bun run preview
```

### 部署到 GitHub Pages

```bash
bun run deploy
```

---

## AI 功能配置（需要后端代理）

### 为什么需要后端代理？

由于浏览器 **CORS（跨域资源共享）** 限制，直接从浏览器调用第三方 LLM API（如阿里云、Claude、OpenAI）会被阻止。

**解决方案：** 运行一个轻量后端代理服务，转发所有 LLM API 请求。

### 启动后端代理

```bash
# 启动后端代理服务
bun run server

# 或同时启动前端和后端
bun run dev:all
```

后端服务会运行在 `http://localhost:3001`，提供以下端点：
- `GET /health` - 健康检查
- `POST /api/llm/proxy` - LLM API 代理
- `POST /api/llm/validate` - API 验证

### 配置 AI 功能

1. 打开设置（右上角齿轮图标）
2. 选择预设服务（如"阿里云百炼 (Coding)"）
3. 输入 API Key
4. **勾选"使用后端代理"**
5. 点击"验证 API Key"测试连接

### 支持的 LLM 服务

| 预设 | Base URL | 推荐模型 |
|------|----------|---------|
| 阿里云百炼 (Coding) | `https://coding.dashscope.aliyuncs.com/v1/chat/completions` | `qwen3.5-plus` |
| 阿里云 DashScope | `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` | `qwen-plus` |
| Claude | `https://api.anthropic.com/v1/messages` | `claude-sonnet-4-6` |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `gpt-4o` |
| Ollama (本地) | `http://localhost:11434/api/chat` | `llama3` |

### 没有后端代理的情况

如果不想运行后端服务，可以选择：
- **浏览器插件**：安装 "Allow CORS" 等插件临时禁用 CORS（仅限开发）
- **本地部署**：使用 Ollama 等本地 LLM 服务

---

## 技术栈

| 层级 | 选择 |
|------|------|
| 框架 | React 18+ |
| UI 库 | Mantine |
| 拖拽库 | @dnd-kit |
| 状态管理 | Zustand |
| 构建工具 | Vite |
| 测试框架 | Vitest + React Testing Library |
| 后端代理 | Hono |
| 部署 | GitHub Pages |

---

## 项目结构

```
soul-agent-builder/
├── src/
│   ├── components/
│   │   ├── ModuleLibrary.tsx    # 左侧模块库
│   │   ├── BuilderZone.tsx      # 中间构建区
│   │   ├── PreviewPanel.tsx     # 右侧预览
│   │   ├── SettingsModal.tsx    # API 设置面板
│   │   ├── AIGenerateModal.tsx  # AI 生成对话框
│   │   └── SoulModule.tsx       # 单个模块组件
│   ├── store/
│   │   ├── soulStore.ts         # Zustand store
│   │   └── soulStore.types.ts   # 类型定义
│   ├── services/
│   │   └── llmService.ts        # LLM API 服务
│   ├── exporters/
│   │   ├── MarkdownExporter.ts
│   │   ├── JsonExporter.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── base64.ts            # base64 工具
│   │   ├── xss.ts               # XSS 防护
│   │   └── storage.ts           # localStorage 封装
│   ├── data/
│   │   ├── identityLibrary.ts   # 身份词库
│   │   ├── abilityLibrary.ts    # 能力词库
│   │   ├── styleLibrary.ts      # 风格词库
│   │   ├── flowLibrary.ts       # 流程词库
│   │   ├── constraintLibrary.ts # 约束词库
│   │   └── toolLibrary.ts       # 工具词库
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.ts                 # Hono 后端代理
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 版本路线图

### v1.0 MVP（当前版本）
- [x] 拖拽组装
- [x] 7 层结构
- [x] Markdown + JSON 导出
- [x] localStorage 自动保存
- [x] 分享链接（base64）
- [x] 预设词库
- [x] 折叠式模块库
- [x] 流程拖拽排序
- [x] 知识层在线编辑

### v1.0.1.0
- [x] AI 生成进度指示器（三步可视化）
- [x] AI 生成取消功能
- [x] LLM 服务后端代理（解决 CORS）

### v1.1 (已合并到 v1.5)
- [x] OpenClaw 导出 → 已合并到 v1.5
- [x] Claude Code 导出 → 已合并到 v1.5

### v1.5
- [x] AI 一键生成 Soul
- [x] 内置测试对话
- [ ] GitHub 抓取自动解析
- [x] 模板画廊

### v2.0
- [ ] 用户系统 + 云存储
- [ ] Soul 优化助手
- [ ] Soul 市场（雏形）

---

## 开发待办

详见 [TODOS.md](./TODOS.md)

---

## 快速体验

访问 [GitHub Pages 在线演示](https://lgz-star.github.io/soul-agent-builder/) 立即体验

---

## License

MIT
