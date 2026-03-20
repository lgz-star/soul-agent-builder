# Soul & Agent 构建器

AI 人格创作工具 — 通过拖拽模块化组件，快速创建高质量 AI Agent/Soul

**在线演示：** [TODO: GitHub Pages 链接]

---

## 功能亮点

- **7 层通用结构** — 身份/能力/风格/流程/约束/知识/工具，覆盖所有 Soul 要素
- **拖拽式组装** — 像搭积木一样创建 Soul
- **一键分享** — 生成专属链接，瞬间分享你的创作成果
- **多格式导出** — Markdown + JSON（v1.1 支持 OpenClaw + Claude Code）

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

## 技术栈

| 层级 | 选择 |
|------|------|
| 框架 | React 18+ |
| UI 库 | Mantine |
| 拖拽库 | @dnd-kit |
| 状态管理 | Zustand |
| 构建工具 | Vite |
| 测试框架 | Vitest + React Testing Library |
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
│   │   └── SoulModule.tsx       # 单个模块组件
│   ├── store/
│   │   ├── soulStore.ts         # Zustand store
│   │   └── soulStore.types.ts   # 类型定义
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

### v1.1
- [ ] OpenClaw 导出
- [ ] Claude Code 导出

### v1.5
- [ ] AI 一键生成 Soul
- [ ] 内置测试对话
- [ ] GitHub 抓取自动解析
- [ ] 模板画廊

### v2.0
- [ ] 用户系统 + 云存储
- [ ] Soul 优化助手
- [ ] Soul 市场（雏形）

---

## 开发待办

详见 [TODOS.md](./TODOS.md)

---

## License

MIT
