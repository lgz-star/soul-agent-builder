# TODOS.md

## v1.0 (MVP - 工程审查发现)

- [x] **P1: 添加 Soul 验证函数** — 在 setIdentity/toggleAbility 等 setter 中验证 7 层结构完整性，防止无效状态
  - **Why:** 防止用户创建不完整的 Soul（如只有 identity 没有 abilities）
  - **Pros:** 提高数据质量，减少导出时的错误
  - **Cons:** 增加代码复杂度，需要定义什么是"有效的 Soul"
  - **Context:** /plan-eng-review 发现当前 setter 中没有验证逻辑，用户可能创建不完整状态
  - **Depends on:** 无
  - **Status:** COMPLETED - 添加了 validateSoul 函数到 soulStore.types.ts，在所有 setter 中调用验证

- [x] **P1: 添加全局 Error Boundary** — 捕获渲染错误，显示友好的错误页面
  - **Why:** 当前组件错误会导致白屏
  - **Pros:** 提高用户体验，错误时显示可恢复的提示
  - **Cons:** 增加约 50 行代码
  - **Context:** /plan-eng-review 发现无错误边界，React 默认错误处理会导致整页白屏
  - **Depends on:** 无
  - **Status:** COMPLETED - ErrorBoundary.tsx 已创建并集成到 main.tsx，6 个测试用例全部通过

- [x] **P0: 添加 soulStore.test.ts** — 测试所有 setter 函数、错误处理、持久化逻辑
  - **Why:** 核心业务逻辑必须 100% 测试覆盖
  - **Pros:** 防止回归，增强重构信心
  - **Cons:** 增加约 200 行测试代码
  - **Context:** /plan-eng-review 测试审查发现 Store 层无测试
  - **Depends on:** 无
  - **Status:** COMPLETED - 47 个测试用例，包含验证函数的完整测试，所有测试通过

- [x] **P2: React.memo 优化 ModuleLibrary** — 防止不必要的重渲染
  - **Why:** 当前 store 更新时所有模块会重新渲染
  - **Pros:** 提高大型词库的滚动性能
  - **Cons:** 增加代码复杂度，需要正确实现 useMemo 依赖
  - **Context:** /plan-eng-review 性能审查发现渲染优化机会
  - **Depends on:** 无
  - **Status:** COMPLETED - ModuleLibrary 重构为配置驱动 + React.memo 优化

---

## v1.1

- [x] **P1: 空状态 redesign** — 添加 SVG 插图、引导按钮
  - **Why:** 设计审计 High Impact 问题 #1
  - **Status:** COMPLETED - EmptyState.tsx 重写，添加温暖的 SVG 插图和引导提示

- [x] **P1: 添加焦点环样式** — 确保键盘导航可见
  - **Why:** 设计审计 High Impact 问题 #2，无障碍访问问题
  - **Status:** COMPLETED - main.tsx 添加全局 :focus-visible 样式

- [x] **P1: 添加流程完成/导出入口** — 固定操作栏
  - **Why:** 设计审计 High Impact 问题 #3
  - **Status:** COMPLETED - App.tsx 顶部添加导出菜单和分享按钮

- [x] **P2: 改进标题层级** — 添加 h1-h3 使用场景
  - **Why:** 设计审计 Medium Impact 问题 #1
  - **Status:** COMPLETED - App 标题 h1, 构建区 h2, 模块库 h3

- [x] **P2: 改进卡片悬停效果** — 添加 hover 状态反馈
  - **Why:** 设计审计 Medium Impact 问题 #2
  - **Status:** COMPLETED - ModuleLibrary.tsx 添加悬停阴影、位移、边框变化

- [x] **P3: 优化词库卡片文本层级** — 改进标题/描述/标签区分
  - **Why:** 设计审计 Medium Impact 问题 #4
  - **Status:** COMPLETED - ModuleLibrary.tsx 优化字重、行高、间距

- [x] OpenClaw 格式导出（需调研格式规范）
- [x] Claude Code 格式导出（需调研格式规范）— COMPLETED: ClaudeCodeExporter.ts 已创建，支持导出 CLAUDE.md 格式

## v1.1 剩余优化项（/design-review 2026-03-21 发现）

- [x] **P1: 触控目标优化** — 顶部图标按钮增至 44×44（无障碍）
  - **Why:** 设计审计发现 N1，34×34 小于 44px 触控标准
  - **Status:** COMPLETED - App.tsx 顶部操作按钮已更新至 44×44

- [x] **P3: 预览面板标题统一** — h5 → h3
  - **Why:** 设计审计发现 N3，标题层级统一性
  - **Status:** COMPLETED - PreviewPanel.tsx 标题已改为 order={3}

- [x] **P3: Loading 状态完善** — Skeleton 组件实际使用于空状态
  - **Why:** 设计审计发现 P3，Skeleton 已导入但未使用
  - **Status:** COMPLETED - PreviewPanel.tsx 添加 Skeleton 加载状态

## v1.5

- [ ] AI 一键生成 Soul
- [ ] 内置测试对话功能
- [ ] GitHub 抓取自动解析
- [ ] 模板画廊

## v2.0

- [ ] 用户系统 + 云存储
- [ ] Soul 优化助手
- [ ] Soul 市场（雏形）

---

**生成时间：** 2026-03-20
**最后更新：** 2026-03-21 (/design-review 修复所有 High/Medium Impact 问题)
