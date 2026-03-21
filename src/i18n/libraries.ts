/**
 * 词库数据 - 支持多语言
 */

// 身份词库
export const identityLibrary = [
  { id: 'frontend-eng', name: { zh: '前端工程师', en: 'Frontend Engineer' }, description: { zh: '专注于 Web 前端开发', en: 'Specializes in web frontend development' } },
  { id: 'backend-eng', name: { zh: '后端工程师', en: 'Backend Engineer' }, description: { zh: '专注于服务器端开发', en: 'Specializes in server-side development' } },
  { id: 'fullstack-eng', name: { zh: '全栈工程师', en: 'Full Stack Engineer' }, description: { zh: '前后端都擅长', en: 'Proficient in both frontend and backend' } },
  { id: 'ai-eng', name: { zh: 'AI 工程师', en: 'AI Engineer' }, description: { zh: '专注于人工智能和机器学习', en: 'Specializes in AI and machine learning' } },
  { id: 'data-scientist', name: { zh: '数据科学家', en: 'Data Scientist' }, description: { zh: '数据分析和建模', en: 'Data analysis and modeling' } },
  { id: 'product-manager', name: { zh: '产品经理', en: 'Product Manager' }, description: { zh: '产品规划和设计', en: 'Product planning and design' } },
  { id: 'designer', name: { zh: 'UI/UX 设计师', en: 'UI/UX Designer' }, description: { zh: '用户界面和体验设计', en: 'User interface and experience design' } },
  { id: 'devops-eng', name: { zh: 'DevOps 工程师', en: 'DevOps Engineer' }, description: { zh: '运维和自动化', en: 'Operations and automation' } },
  { id: 'security-eng', name: { zh: '安全工程师', en: 'Security Engineer' }, description: { zh: '网络安全和防护', en: 'Cybersecurity and protection' } },
  { id: 'customer-support', name: { zh: '客服专员', en: 'Customer Support Specialist' }, description: { zh: '客户支持和服务', en: 'Customer support and service' } },
];

// 能力词库
export const abilityLibrary = [
  { id: 'react', name: { zh: 'React', en: 'React' }, category: 'frontend' },
  { id: 'vue', name: { zh: 'Vue', en: 'Vue' }, category: 'frontend' },
  { id: 'angular', name: { zh: 'Angular', en: 'Angular' }, category: 'frontend' },
  { id: 'typescript', name: { zh: 'TypeScript', en: 'TypeScript' }, category: 'frontend' },
  { id: 'javascript', name: { zh: 'JavaScript', en: 'JavaScript' }, category: 'frontend' },
  { id: 'html-css', name: { zh: 'HTML/CSS', en: 'HTML/CSS' }, category: 'frontend' },
  { id: 'nodejs', name: { zh: 'Node.js', en: 'Node.js' }, category: 'backend' },
  { id: 'python', name: { zh: 'Python', en: 'Python' }, category: 'backend' },
  { id: 'go', name: { zh: 'Go', en: 'Go' }, category: 'backend' },
  { id: 'java', name: { zh: 'Java', en: 'Java' }, category: 'backend' },
  { id: 'sql', name: { zh: 'SQL', en: 'SQL' }, category: 'database' },
  { id: 'mongodb', name: { zh: 'MongoDB', en: 'MongoDB' }, category: 'database' },
  { id: 'docker', name: { zh: 'Docker', en: 'Docker' }, category: 'devops' },
  { id: 'kubernetes', name: { zh: 'Kubernetes', en: 'Kubernetes' }, category: 'devops' },
  { id: 'aws', name: { zh: 'AWS', en: 'AWS' }, category: 'cloud' },
  { id: 'gcp', name: { zh: 'GCP', en: 'GCP' }, category: 'cloud' },
  { id: 'ml', name: { zh: '机器学习', en: 'Machine Learning' }, category: 'ai' },
  { id: 'nlp', name: { zh: '自然语言处理', en: 'Natural Language Processing' }, category: 'ai' },
  { id: 'data-analysis', name: { zh: '数据分析', en: 'Data Analysis' }, category: 'data' },
  { id: 'visualization', name: { zh: '数据可视化', en: 'Data Visualization' }, category: 'data' },
];

// 风格词库
export const styleLibrary = [
  { id: 'concise', name: { zh: '简洁', en: 'Concise' }, description: { zh: '简短直接的回答', en: 'Short and direct answers' } },
  { id: 'detailed', name: { zh: '详细', en: 'Detailed' }, description: { zh: '全面深入的解释', en: 'Comprehensive and in-depth explanations' } },
  { id: 'professional', name: { zh: '专业', en: 'Professional' }, description: { zh: '正式专业的语气', en: 'Formal and professional tone' } },
  { id: 'friendly', name: { zh: '友好', en: 'Friendly' }, description: { zh: '亲切随和的语气', en: 'Warm and casual tone' } },
  { id: 'humorous', name: { zh: '幽默', en: 'Humorous' }, description: { zh: '风趣有趣的表达', en: 'Witty and fun expressions' } },
  { id: 'socratic', name: { zh: '苏格拉底式', en: 'Socratic' }, description: { zh: '通过提问引导思考', en: 'Guide thinking through questions' } },
  { id: 'pragmatic', name: { zh: '务实', en: 'Pragmatic' }, description: { zh: '注重实际解决方案', en: 'Focus on practical solutions' } },
  { id: 'theoretical', name: { zh: '理论', en: 'Theoretical' }, description: { zh: '注重原理和概念', en: 'Focus on principles and concepts' } },
];

// 流程词库
export const flowLibrary = [
  { id: 'requirement-analysis', name: { zh: '需求分析', en: 'Requirement Analysis' }, description: { zh: '理解和分析用户需求', en: 'Understand and analyze user requirements' } },
  { id: 'solution-design', name: { zh: '方案设计', en: 'Solution Design' }, description: { zh: '设计解决方案', en: 'Design solutions' } },
  { id: 'implementation', name: { zh: '实现', en: 'Implementation' }, description: { zh: '编写代码实现功能', en: 'Write code to implement features' } },
  { id: 'testing', name: { zh: '测试', en: 'Testing' }, description: { zh: '测试功能正确性', en: 'Test feature correctness' } },
  { id: 'code-review', name: { zh: '代码审查', en: 'Code Review' }, description: { zh: '审查代码质量', en: 'Review code quality' } },
  { id: 'deployment', name: { zh: '部署', en: 'Deployment' }, description: { zh: '部署到生产环境', en: 'Deploy to production environment' } },
  { id: 'monitoring', name: { zh: '监控', en: 'Monitoring' }, description: { zh: '监控系统运行状态', en: 'Monitor system running status' } },
  { id: 'optimization', name: { zh: '优化', en: 'Optimization' }, description: { zh: '性能和质量优化', en: 'Performance and quality optimization' } },
  { id: 'documentation', name: { zh: '文档', en: 'Documentation' }, description: { zh: '编写技术文档', en: 'Write technical documentation' } },
  { id: 'communication', name: { zh: '沟通', en: 'Communication' }, description: { zh: '与团队和利益相关者沟通', en: 'Communicate with team and stakeholders' } },
];

// 约束词库
export const constraintLibrary = [
  { id: 'must-comment', name: { zh: '必须写注释', en: 'Must Write Comments' }, description: { zh: '代码必须包含清晰注释', en: 'Code must include clear comments' } },
  { id: 'must-handle-error', name: { zh: '必须处理错误', en: 'Must Handle Errors' }, description: { zh: '必须处理所有异常情况', en: 'Must handle all exceptions' } },
  { id: 'must-test', name: { zh: '必须写测试', en: 'Must Write Tests' }, description: { zh: '必须包含单元测试', en: 'Must include unit tests' } },
  { id: 'no-external-deps', name: { zh: '不添加外部依赖', en: 'No External Dependencies' }, description: { zh: '避免引入新的依赖包', en: 'Avoid introducing new dependencies' } },
  { id: 'follow-convention', name: { zh: '遵循约定', en: 'Follow Conventions' }, description: { zh: '遵循项目代码规范', en: 'Follow project code conventions' } },
  { id: 'performance-first', name: { zh: '性能优先', en: 'Performance First' }, description: { zh: '优先考虑性能优化', en: 'Prioritize performance optimization' } },
  { id: 'security-first', name: { zh: '安全优先', en: 'Security First' }, description: { zh: '优先考虑安全性', en: 'Prioritize security' } },
  { id: 'readable-code', name: { zh: '代码可读性', en: 'Code Readability' }, description: { zh: '代码必须清晰易读', en: 'Code must be clear and readable' } },
  { id: 'dry-principle', name: { zh: 'DRY 原则', en: 'DRY Principle' }, description: { zh: '不要重复自己', en: "Don't repeat yourself" } },
  { id: 'yagni', name: { zh: 'YAGNI 原则', en: 'YAGNI Principle' }, description: { zh: '不要过度设计', en: "Don't over-design" } },
];

// 工具词库
export const toolLibrary = [
  { id: 'terminal', name: { zh: '终端执行', en: 'Terminal Execution' }, description: { zh: '可以执行 shell 命令', en: 'Can execute shell commands' } },
  { id: 'file-read', name: { zh: '文件读取', en: 'File Read' }, description: { zh: '可以读取文件内容', en: 'Can read file contents' } },
  { id: 'file-write', name: { zh: '文件写入', en: 'File Write' }, description: { zh: '可以写入/修改文件', en: 'Can write/modify files' } },
  { id: 'web-search', name: { zh: '网络搜索', en: 'Web Search' }, description: { zh: '可以搜索互联网信息', en: 'Can search internet information' } },
  { id: 'api-call', name: { zh: 'API 调用', en: 'API Call' }, description: { zh: '可以调用 HTTP API', en: 'Can call HTTP APIs' } },
  { id: 'database', name: { zh: '数据库操作', en: 'Database Operations' }, description: { zh: '可以操作数据库', en: 'Can operate databases' } },
];
