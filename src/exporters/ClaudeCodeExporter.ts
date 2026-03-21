/**
 * Claude Code (CLAUDE.md) 格式导出器
 *
 * 导出为适合 Claude Code 使用的 Agent 配置文件格式
 */
import type { Soul } from '../store/soulStore.types';

export class ClaudeCodeExporter {
  export(soul: Soul): string {
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
    lines.push('## 身份');
    lines.push('');
    lines.push(this.getIdentityName(soul.identity));
    lines.push('');

    // 核心能力
    if (soul.abilities.length > 0) {
      lines.push('## 核心能力');
      lines.push('');
      soul.abilities.forEach((id) => {
        lines.push(`- ${this.getAbilityName(id)}`);
      });
      lines.push('');
    }

    // 工作风格
    if (soul.styles.length > 0) {
      lines.push('## 工作风格');
      lines.push('');
      soul.styles.forEach((id) => {
        lines.push(`- ${this.getStyleName(id)}`);
      });
      lines.push('');
    }

    // 工作流程
    if (soul.flows.length > 0) {
      lines.push('## 标准工作流程');
      lines.push('');
      soul.flows
        .sort((a, b) => a.order - b.order)
        .forEach((flow, index) => {
          lines.push(`${index + 1}. ${this.getFlowName(flow.id)}`);
        });
      lines.push('');
    }

    // 约束条件
    if (soul.constraints.length > 0) {
      lines.push('## 约束条件');
      lines.push('');
      lines.push('**必须遵守的规则：**');
      lines.push('');
      soul.constraints.forEach((id) => {
        lines.push(`- ${this.getConstraintName(id)}`);
      });
      lines.push('');
    }

    // 可用工具
    if (soul.tools.length > 0) {
      lines.push('## 可用工具');
      lines.push('');
      soul.tools.forEach((id) => {
        lines.push(`- ${this.getToolName(id)}`);
      });
      lines.push('');
    }

    // 知识库（如果有）
    if (soul.knowledge && soul.knowledge.trim()) {
      lines.push('## 知识库');
      lines.push('');
      lines.push(soul.knowledge);
      lines.push('');
    }

    // 版本信息
    lines.push('---');
    lines.push('');
    lines.push(`**Soul 版本:** ${soul.version}`);
    lines.push(`**最后更新:** ${soul.updatedAt}`);

    return lines.join('\n');
  }

  // 词库查找
  private getIdentityName(id: string): string {
    const names: Record<string, string> = {
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
    return names[id] || id;
  }

  private getAbilityName(id: string): string {
    const names: Record<string, string> = {
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
    return names[id] || id;
  }

  private getStyleName(id: string): string {
    const names: Record<string, string> = {
      concise: '简洁',
      detailed: '详细',
      professional: '专业',
      friendly: '友好',
      humorous: '幽默',
      socratic: '苏格拉底式',
      pragmatic: '务实',
      theoretical: '理论',
    };
    return names[id] || id;
  }

  private getFlowName(id: string): string {
    const names: Record<string, string> = {
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
    return names[id] || id;
  }

  private getConstraintName(id: string): string {
    const names: Record<string, string> = {
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
    return names[id] || id;
  }

  private getToolName(id: string): string {
    const names: Record<string, string> = {
      terminal: '终端执行',
      'file-read': '文件读取',
      'file-write': '文件写入',
      'web-search': '网络搜索',
      'api-call': 'API 调用',
      database: '数据库操作',
    };
    return names[id] || id;
  }
}
