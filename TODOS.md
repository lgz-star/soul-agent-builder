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

- [ ] OpenClaw 格式导出（需调研格式规范）
- [ ] Claude Code 格式导出（需调研格式规范）

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
**最后更新：** 2026-03-21 (/plan-eng-review 更新)
