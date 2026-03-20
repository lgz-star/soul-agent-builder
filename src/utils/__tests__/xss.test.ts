import { describe, it, expect } from 'vitest';
import { escapeHtml, validateInput } from '../xss';

describe('XSS utilities', () => {
  describe('escapeHtml', () => {
    it('应该转义基本 HTML 字符', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    });

    it('应该转义引号', () => {
      expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
      expect(escapeHtml("'hello'")).toBe('&#x27;hello&#x27;');
    });

    it('应该转义 & 字符', () => {
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('应该转义 script 标签', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('应该正确处理空字符串', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('validateInput', () => {
    it('应该通过正常输入验证', () => {
      const result = validateInput('正常文本');
      expect(result.valid).toBe(true);
    });

    it('应该拒绝 script 标签', () => {
      const result = validateInput('<script>alert("xss")</script>');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('输入包含不安全内容');
    });

    it('应该拒绝 javascript: 协议', () => {
      const result = validateInput('javascript:alert(1)');
      expect(result.valid).toBe(false);
    });

    it('应该拒绝 on 开头的事件处理', () => {
      const result = validateInput('onclick=alert(1)');
      expect(result.valid).toBe(false);
    });

    it('应该拒绝超过最大长度的输入', () => {
      const longInput = 'a'.repeat(10001);
      const result = validateInput(longInput, 10000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('超过最大长度');
    });
  });
});
