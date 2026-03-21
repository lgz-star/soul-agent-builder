/**
 * Claude Code (CLAUDE.md) 格式导出器
 *
 * 导出为适合 Claude Code 使用的 Agent 配置文件格式
 */
import type { Soul } from '../store/soulStore.types';
import type { Language } from '../i18n';

export class ClaudeCodeExporter {
  export(soul: Soul, language: Language = 'zh'): string {
    const lines: string[] = [];

    // 标题：Agent 名称
    lines.push(`# ${soul.name}`);
    lines.push('');

    // 描述
    if (soul.description) {
      lines.push(soul.description);
      lines.push('');
    }

    // 身份
    lines.push(language === 'zh' ? '## 身份' : '## Identity');
    lines.push('');
    lines.push(this.getIdentityName(soul.identity, language));
    lines.push('');

    // 核心能力
    if (soul.abilities.length > 0) {
      lines.push(language === 'zh' ? '## 核心能力' : '## Core Abilities');
      lines.push('');
      soul.abilities.forEach((id) => {
        lines.push(`- ${this.getAbilityName(id, language)}`);
      });
      lines.push('');
    }

    // 工作风格
    if (soul.styles.length > 0) {
      lines.push(language === 'zh' ? '## 工作风格' : '## Work Style');
      lines.push('');
      soul.styles.forEach((id) => {
        lines.push(`- ${this.getStyleName(id, language)}`);
      });
      lines.push('');
    }

    // 工作流程
    if (soul.flows.length > 0) {
      lines.push(language === 'zh' ? '## 标准工作流程' : '## Standard Workflow');
      lines.push('');
      soul.flows
        .sort((a, b) => a.order - b.order)
        .forEach((flow, index) => {
          lines.push(`${index + 1}. ${this.getFlowName(flow.id, language)}`);
        });
      lines.push('');
    }

    // 约束条件
    if (soul.constraints.length > 0) {
      lines.push(language === 'zh' ? '## 约束条件' : '## Constraints');
      lines.push('');
      lines.push(language === 'zh' ? '**必须遵守的规则：**' : '**Rules to Follow:**');
      lines.push('');
      soul.constraints.forEach((id) => {
        lines.push(`- ${this.getConstraintName(id, language)}`);
      });
      lines.push('');
    }

    // 可用工具
    if (soul.tools.length > 0) {
      lines.push(language === 'zh' ? '## 可用工具' : '## Available Tools');
      lines.push('');
      soul.tools.forEach((id) => {
        lines.push(`- ${this.getToolName(id, language)}`);
      });
      lines.push('');
    }

    // 知识库（如果有）
    if (soul.knowledge && soul.knowledge.trim()) {
      lines.push(language === 'zh' ? '## 知识库' : '## Knowledge Base');
      lines.push('');
      lines.push(soul.knowledge);
      lines.push('');
    }

    // 版本信息
    lines.push('---');
    lines.push('');
    lines.push(`**${language === 'zh' ? 'Soul 版本:' : 'Soul Version:'}** ${soul.version}`);
    lines.push(`**${language === 'zh' ? '最后更新:' : 'Last Updated:'}** ${soul.updatedAt}`);

    return lines.join('\n');
  }

  // 词库查找
  private getIdentityName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      'frontend-eng': '前端工程师',
      'backend-eng': '后端工程师',
      'fullstack-eng': '全栈工程师',
      'ai-eng': 'AI 工程师',
      'data-scientist': '数据科学家',
      'product-manager': '产品经理',
      'designer': 'UI/UX 设计师',
      'devops-eng': 'DevOps 工程师',
      'security-eng': '安全工程师',
      'customer-support': '客服专员',
    };
    const namesEn: Record<string, string> = {
      'frontend-eng': 'Frontend Engineer',
      'backend-eng': 'Backend Engineer',
      'fullstack-eng': 'Full Stack Engineer',
      'ai-eng': 'AI Engineer',
      'data-scientist': 'Data Scientist',
      'product-manager': 'Product Manager',
      'designer': 'UI/UX Designer',
      'devops-eng': 'DevOps Engineer',
      'security-eng': 'Security Engineer',
      'customer-support': 'Customer Support',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }

  private getAbilityName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      react: 'React',
      vue: 'Vue',
      angular: 'Angular',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      'html-css': 'HTML/CSS',
      nodejs: 'Node.js',
      python: 'Python',
      go: 'Go',
      java: 'Java',
      sql: 'SQL',
      mongodb: 'MongoDB',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      aws: 'AWS',
      gcp: 'GCP',
      ml: '机器学习',
      nlp: '自然语言处理',
      'data-analysis': '数据分析',
      visualization: '数据可视化',
    };
    const namesEn: Record<string, string> = {
      react: 'React',
      vue: 'Vue',
      angular: 'Angular',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      'html-css': 'HTML/CSS',
      nodejs: 'Node.js',
      python: 'Python',
      go: 'Go',
      java: 'Java',
      sql: 'SQL',
      mongodb: 'MongoDB',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      aws: 'AWS',
      gcp: 'GCP',
      ml: 'Machine Learning',
      nlp: 'Natural Language Processing',
      'data-analysis': 'Data Analysis',
      visualization: 'Data Visualization',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }

  private getStyleName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      concise: '简洁',
      detailed: '详细',
      professional: '专业',
      friendly: '友好',
      humorous: '幽默',
      socratic: '苏格拉底式',
      pragmatic: '务实',
      theoretical: '理论',
    };
    const namesEn: Record<string, string> = {
      concise: 'Concise',
      detailed: 'Detailed',
      professional: 'Professional',
      friendly: 'Friendly',
      humorous: 'Humorous',
      socratic: 'Socratic',
      pragmatic: 'Pragmatic',
      theoretical: 'Theoretical',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }

  private getFlowName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      'requirement-analysis': '需求分析',
      'solution-design': '方案设计',
      implementation: '实现',
      testing: '测试',
      'code-review': '代码审查',
      deployment: '部署',
      monitoring: '监控',
      optimization: '优化',
      documentation: '文档',
      communication: '沟通',
    };
    const namesEn: Record<string, string> = {
      'requirement-analysis': 'Requirement Analysis',
      'solution-design': 'Solution Design',
      implementation: 'Implementation',
      testing: 'Testing',
      'code-review': 'Code Review',
      deployment: 'Deployment',
      monitoring: 'Monitoring',
      optimization: 'Optimization',
      documentation: 'Documentation',
      communication: 'Communication',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }

  private getConstraintName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      'must-comment': '必须写注释',
      'must-handle-error': '必须处理错误',
      'must-test': '必须写测试',
      'no-external-deps': '不添加外部依赖',
      'follow-convention': '遵循约定',
      'performance-first': '性能优先',
      'security-first': '安全优先',
      'readable-code': '代码可读性',
      'dry-principle': 'DRY 原则',
      yagni: 'YAGNI 原则',
    };
    const namesEn: Record<string, string> = {
      'must-comment': 'Must write comments',
      'must-handle-error': 'Must handle errors',
      'must-test': 'Must write tests',
      'no-external-deps': 'No external dependencies',
      'follow-convention': 'Follow conventions',
      'performance-first': 'Performance first',
      'security-first': 'Security first',
      'readable-code': 'Code readability',
      'dry-principle': 'DRY principle',
      yagni: 'YAGNI principle',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }

  private getToolName(id: string, language: Language = 'zh'): string {
    const namesZh: Record<string, string> = {
      terminal: '终端执行',
      'file-read': '文件读取',
      'file-write': '文件写入',
      'web-search': '网络搜索',
      'api-call': 'API 调用',
      database: '数据库操作',
    };
    const namesEn: Record<string, string> = {
      terminal: 'Terminal Execution',
      'file-read': 'File Read',
      'file-write': 'File Write',
      'web-search': 'Web Search',
      'api-call': 'API Call',
      database: 'Database Operations',
    };
    return (language === 'zh' ? namesZh : namesEn)[id] || id;
  }
}
