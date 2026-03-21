# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1.0] - 2026-03-22

### Added
- AI 生成进度指示器，支持三步可视化（分析需求 → 生成配置 → 完成）
- AI 生成取消功能，支持随时终止正在进行的生成请求
- LLM 服务后端代理支持，解决浏览器 CORS 跨域限制

### Changed
- AIGenerateModal 重构为进度驱动 + 错误处理优化
- llmService 支持 Anthropic、阿里云 DashScope、OpenAI 多种格式
- Vite 配置优化，添加 CORS 头支持局域网访问

### Fixed
- 修复 Base64 工具在 Bun 测试环境下返回空字符串的问题
- 修复知识层 HTML 转义 XSS 安全问题

## [1.0.0.0] - 2026-03-21

### Added
- v1.0 MVP: Soul & Agent 构建器，通过拖拽模块化组件创建 AI Agent/Soul
- 7 层结构：身份、能力、风格、流程、知识、约束、工具
- JSON 和 Markdown 格式导出功能
- 分享链接生成功能（Base64 编码）
- 响应式设计，支持移动端预览切换
- 全局 Error Boundary 错误处理
- Soul 验证函数，确保数据结构完整性

### Changed
- 左侧模块卡片优化为配置驱动 + React.memo 性能优化
- 空状态重新设计，添加 SVG 插图和引导提示
- 流程层支持拖拽排序交互
- 标题层级规范化 (h1-h3)

### Fixed
- 修复知识输入框空格键被拖拽传感器拦截的问题
- 修复组件缺失导入导致的运行时错误 (Title, Button)
- 修复 ErrorBoundary 使用 Mantine 组件导致的无限错误循环
