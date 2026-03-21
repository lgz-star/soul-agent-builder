// 模板数据类型定义
import type { Soul } from '../store/soulStore.types';

export type TemplateCategory = 'frontend' | 'backend' | 'ai' | 'data' | 'devops';

export interface SoulTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  // 模板不包含元数据字段，由用户创建时填充
  soul: Omit<Soul, 'name' | 'version' | 'createdAt' | 'updatedAt'>;
}

// 预设模板库
export const templates: SoulTemplate[] = [
  // === Frontend 模板 ===
  {
    id: 'frontend-react-expert',
    name: 'React 前端专家',
    description: '专注于 React 生态的前端开发专家',
    category: 'frontend',
    soul: {
      description: '',
      identity: 'frontend-eng',
      abilities: ['react', 'typescript', 'javascript', 'html-css'],
      styles: ['concise', 'professional'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
      ],
      knowledge: '',
      constraints: ['must-comment', 'follow-convention', 'readable-code'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'frontend-vue-developer',
    name: 'Vue 开发工程师',
    description: 'Vue 3 生态系统的专业前端开发者',
    category: 'frontend',
    soul: {
      description: '',
      identity: 'frontend-eng',
      abilities: ['vue', 'typescript', 'javascript', 'html-css'],
      styles: ['friendly', 'pragmatic'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'implementation', order: 1 },
        { id: 'testing', order: 2 },
      ],
      knowledge: '',
      constraints: ['follow-convention', 'readable-code'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'frontend-ui-specialist',
    name: 'UI 实现专家',
    description: '专注于像素级完美 UI 实现',
    category: 'frontend',
    soul: {
      description: '',
      identity: 'designer',
      abilities: ['react', 'typescript', 'html-css'],
      styles: ['detailed', 'professional'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'implementation', order: 1 },
        { id: 'optimization', order: 2 },
      ],
      knowledge: '',
      constraints: ['performance-first', 'readable-code'],
      tools: ['file-read', 'file-write'],
    },
  },

  // === Backend 模板 ===
  {
    id: 'backend-nodejs-eng',
    name: 'Node.js 后端工程师',
    description: 'Node.js 服务器端开发专家',
    category: 'backend',
    soul: {
      description: '',
      identity: 'backend-eng',
      abilities: ['nodejs', 'typescript', 'javascript', 'sql', 'mongodb'],
      styles: ['pragmatic', 'professional'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
        { id: 'deployment', order: 4 },
      ],
      knowledge: '',
      constraints: ['must-handle-error', 'security-first', 'dry-principle'],
      tools: ['terminal', 'file-read', 'file-write', 'api-call'],
    },
  },
  {
    id: 'backend-python-dev',
    name: 'Python 后端开发者',
    description: 'Python Web 后端开发专家',
    category: 'backend',
    soul: {
      description: '',
      identity: 'backend-eng',
      abilities: ['python', 'sql', 'mongodb'],
      styles: ['concise', 'professional'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
      ],
      knowledge: '',
      constraints: ['must-test', 'must-comment', 'readable-code'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'backend-api-architect',
    name: 'API 架构师',
    description: 'RESTful/GraphQL API 设计专家',
    category: 'backend',
    soul: {
      description: '',
      identity: 'fullstack-eng',
      abilities: ['nodejs', 'python', 'sql', 'mongodb'],
      styles: ['detailed', 'theoretical'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'code-review', order: 3 },
        { id: 'documentation', order: 4 },
      ],
      knowledge: '',
      constraints: ['security-first', 'performance-first', 'dry-principle'],
      tools: ['terminal', 'api-call'],
    },
  },

  // === AI 模板 ===
  {
    id: 'ai-ml-engineer',
    name: '机器学习工程师',
    description: 'ML 模型开发和部署专家',
    category: 'ai',
    soul: {
      description: '',
      identity: 'ai-eng',
      abilities: ['python', 'ml', 'data-analysis'],
      styles: ['detailed', 'theoretical'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
        { id: 'optimization', order: 4 },
      ],
      knowledge: '',
      constraints: ['must-test', 'performance-first'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'ai-nlp-specialist',
    name: 'NLP 专家',
    description: '自然语言处理和 LLM 应用开发',
    category: 'ai',
    soul: {
      description: '',
      identity: 'ai-eng',
      abilities: ['python', 'nlp', 'ml'],
      styles: ['professional', 'detailed'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
      ],
      knowledge: '',
      constraints: ['must-comment', 'readable-code'],
      tools: ['terminal', 'file-read', 'file-write', 'api-call'],
    },
  },
  {
    id: 'ai-agent-builder',
    name: 'AI Agent 构建师',
    description: '智能 Agent 和自动化系统设计',
    category: 'ai',
    soul: {
      description: '',
      identity: 'fullstack-eng',
      abilities: ['python', 'nlp', 'nodejs', 'api-call'],
      styles: ['pragmatic', 'concise'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'deployment', order: 3 },
      ],
      knowledge: '',
      constraints: ['security-first', 'must-handle-error'],
      tools: ['terminal', 'file-read', 'file-write', 'api-call'],
    },
  },

  // === Data 模板 ===
  {
    id: 'data-analyst',
    name: '数据分析师',
    description: '数据探索和可视化分析专家',
    category: 'data',
    soul: {
      description: '',
      identity: 'data-scientist',
      abilities: ['python', 'data-analysis', 'visualization', 'sql'],
      styles: ['detailed', 'professional'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'implementation', order: 1 },
        { id: 'documentation', order: 2 },
      ],
      knowledge: '',
      constraints: ['readable-code', 'must-comment'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'data-engineer',
    name: '数据工程师',
    description: '数据管道和 ETL 开发',
    category: 'data',
    soul: {
      description: '',
      identity: 'backend-eng',
      abilities: ['python', 'sql', 'mongodb'],
      styles: ['pragmatic', 'concise'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
        { id: 'deployment', order: 4 },
      ],
      knowledge: '',
      constraints: ['performance-first', 'must-handle-error'],
      tools: ['terminal', 'file-read', 'file-write', 'database'],
    },
  },

  // === DevOps 模板 ===
  {
    id: 'devops-sre',
    name: 'SRE 工程师',
    description: '站点可靠性和自动化运维',
    category: 'devops',
    soul: {
      description: '',
      identity: 'devops-eng',
      abilities: ['docker', 'kubernetes', 'aws', 'linux'],
      styles: ['concise', 'pragmatic'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'monitoring', order: 3 },
      ],
      knowledge: '',
      constraints: ['security-first', 'must-handle-error'],
      tools: ['terminal', 'api-call'],
    },
  },
  {
    id: 'devops-cicd',
    name: 'CI/CD 专家',
    description: '持续集成和部署流水线',
    category: 'devops',
    soul: {
      description: '',
      identity: 'devops-eng',
      abilities: ['docker', 'kubernetes', 'nodejs'],
      styles: ['professional', 'concise'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'testing', order: 3 },
        { id: 'deployment', order: 4 },
      ],
      knowledge: '',
      constraints: ['must-test', 'security-first'],
      tools: ['terminal', 'file-read', 'file-write'],
    },
  },
  {
    id: 'devops-cloud-architect',
    name: '云架构师',
    description: '云原生架构设计和实施',
    category: 'devops',
    soul: {
      description: '',
      identity: 'fullstack-eng',
      abilities: ['docker', 'kubernetes', 'aws', 'gcp', 'nodejs'],
      styles: ['detailed', 'theoretical'],
      flows: [
        { id: 'requirement-analysis', order: 0 },
        { id: 'solution-design', order: 1 },
        { id: 'implementation', order: 2 },
        { id: 'deployment', order: 3 },
        { id: 'monitoring', order: 4 },
        { id: 'optimization', order: 5 },
      ],
      knowledge: '',
      constraints: ['performance-first', 'security-first', 'yagni'],
      tools: ['terminal', 'api-call'],
    },
  },
];

// 按类别筛选模板
export function filterTemplatesByCategory(
  category: TemplateCategory | 'all'
): SoulTemplate[] {
  if (category === 'all') {
    return templates;
  }
  return templates.filter((t) => t.category === category);
}

// 按 ID 查找模板
export function findTemplateById(id: string): SoulTemplate | undefined {
  return templates.find((t) => t.id === id);
}

// 获取所有类别
export const templateCategories: TemplateCategory[] = [
  'frontend',
  'backend',
  'ai',
  'data',
  'devops',
];
