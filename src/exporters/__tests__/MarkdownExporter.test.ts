import { describe, it, expect } from 'vitest';
import { MarkdownExporter } from '../MarkdownExporter';
import type { Soul } from '../../store/soulStore.types';

describe('MarkdownExporter', () => {
  const mockSoul: Soul = {
    name: '测试 Soul',
    description: '这是一个测试描述',
    version: '1.0.0',
    identity: 'frontend-eng',
    abilities: ['react', 'typescript'],
    styles: ['concise'],
    flows: [
      { id: 'requirement-analysis', order: 0 },
      { id: 'implementation', order: 1 },
    ],
    knowledge: '这是知识内容',
    constraints: ['must-comment', 'must-test'],
    tools: ['terminal'],
  };

  it('应该正确导出 Markdown 格式', () => {
    const exporter = new MarkdownExporter();
    const result = exporter.export(mockSoul);

    expect(result).toContain('# 测试 Soul');
    expect(result).toContain('这是一个测试描述');
    expect(result).toContain('## 身份');
    expect(result).toContain('## 能力');
    expect(result).toContain('## 流程');
  });

  it('应该转义 HTML 特殊字符', () => {
    const maliciousSoul: Soul = {
      ...mockSoul,
      name: '<script>alert("xss")</script>',
    };
    const exporter = new MarkdownExporter();
    const result = exporter.export(maliciousSoul);

    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('应该正确处理空 Soul', () => {
    const emptySoul: Soul = {
      name: '空 Soul',
      description: '',
      version: '1.0.0',
      identity: '',
      abilities: [],
      styles: [],
      flows: [],
      knowledge: '',
      constraints: [],
      tools: [],
    };
    const exporter = new MarkdownExporter();
    const result = exporter.export(emptySoul);

    expect(result).toContain('# 空 Soul');
    expect(result).not.toContain('## 能力');
  });
});
