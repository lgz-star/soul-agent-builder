// 身份词库
export const identityLibrary = [
  { id: 'frontend-eng', name: '前端工程师', description: '专注于 Web 前端开发' },
  { id: 'backend-eng', name: '后端工程师', description: '专注于服务器端开发' },
  { id: 'fullstack-eng', name: '全栈工程师', description: '前后端都擅长' },
  { id: 'ai-eng', name: 'AI 工程师', description: '专注于人工智能和机器学习' },
  { id: 'data-scientist', name: '数据科学家', description: '数据分析和建模' },
  { id: 'product-manager', name: '产品经理', description: '产品规划和设计' },
  { id: 'designer', name: 'UI/UX 设计师', description: '用户界面和体验设计' },
  { id: 'devops-eng', name: 'DevOps 工程师', description: '运维和自动化' },
  { id: 'security-eng', name: '安全工程师', description: '网络安全和防护' },
  { id: 'customer-support', name: '客服专员', description: '客户支持和服务' },
];

// 能力词库
export const abilityLibrary = [
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'vue', name: 'Vue', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend' },
  { id: 'html-css', name: 'HTML/CSS', category: 'frontend' },
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'python', name: 'Python', category: 'backend' },
  { id: 'go', name: 'Go', category: 'backend' },
  { id: 'java', name: 'Java', category: 'backend' },
  { id: 'sql', name: 'SQL', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  { id: 'aws', name: 'AWS', category: 'cloud' },
  { id: 'gcp', name: 'GCP', category: 'cloud' },
  { id: 'ml', name: '机器学习', category: 'ai' },
  { id: 'nlp', name: '自然语言处理', category: 'ai' },
  { id: 'data-analysis', name: '数据分析', category: 'data' },
  { id: 'visualization', name: '数据可视化', category: 'data' },
];

// 风格词库
export const styleLibrary = [
  { id: 'concise', name: '简洁', description: '简短直接的回答' },
  { id: 'detailed', name: '详细', description: '全面深入的解释' },
  { id: 'professional', name: '专业', description: '正式专业的语气' },
  { id: 'friendly', name: '友好', description: '亲切随和的语气' },
  { id: 'humorous', name: '幽默', description: '风趣有趣的表达' },
  { id: 'socratic', name: '苏格拉底式', description: '通过提问引导思考' },
  { id: 'pragmatic', name: '务实', description: '注重实际解决方案' },
  { id: 'theoretical', name: '理论', description: '注重原理和概念' },
];

// 流程词库
export const flowLibrary = [
  { id: 'requirement-analysis', name: '需求分析', description: '理解和分析用户需求' },
  { id: 'solution-design', name: '方案设计', description: '设计解决方案' },
  { id: 'implementation', name: '实现', description: '编写代码实现功能' },
  { id: 'testing', name: '测试', description: '测试功能正确性' },
  { id: 'code-review', name: '代码审查', description: '审查代码质量' },
  { id: 'deployment', name: '部署', description: '部署到生产环境' },
  { id: 'monitoring', name: '监控', description: '监控系统运行状态' },
  { id: 'optimization', name: '优化', description: '性能和质量优化' },
  { id: 'documentation', name: '文档', description: '编写技术文档' },
  { id: 'communication', name: '沟通', description: '与团队和利益相关者沟通' },
];

// 约束词库
export const constraintLibrary = [
  { id: 'must-comment', name: '必须写注释', description: '代码必须包含清晰注释' },
  { id: 'must-handle-error', name: '必须处理错误', description: '必须处理所有异常情况' },
  { id: 'must-test', name: '必须写测试', description: '必须包含单元测试' },
  { id: 'no-external-deps', name: '不添加外部依赖', description: '避免引入新的依赖包' },
  { id: 'follow-convention', name: '遵循约定', description: '遵循项目代码规范' },
  { id: 'performance-first', name: '性能优先', description: '优先考虑性能优化' },
  { id: 'security-first', name: '安全优先', description: '优先考虑安全性' },
  { id: 'readable-code', name: '代码可读性', description: '代码必须清晰易读' },
  { id: 'dry-principle', name: 'DRY 原则', description: '不要重复自己' },
  { id: 'yagni', name: 'YAGNI 原则', description: '不要过度设计' },
];

// 工具词库
export const toolLibrary = [
  { id: 'terminal', name: '终端执行', description: '可以执行 shell 命令' },
  { id: 'file-read', name: '文件读取', description: '可以读取文件内容' },
  { id: 'file-write', name: '文件写入', description: '可以写入/修改文件' },
  { id: 'web-search', name: '网络搜索', description: '可以搜索互联网信息' },
  { id: 'api-call', name: 'API 调用', description: '可以调用 HTTP API' },
  { id: 'database', name: '数据库操作', description: '可以操作数据库' },
];
