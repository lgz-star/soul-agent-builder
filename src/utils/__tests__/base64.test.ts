import { describe, it, expect } from 'vitest';
import { toBase64, fromBase64 } from '../base64';

describe('base64 utilities', () => {
  it('应该正确编码字符串', () => {
    const input = 'Hello, World!';
    const encoded = toBase64(input);
    expect(encoded).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('应该正确解码字符串', () => {
    const encoded = 'SGVsbG8sIFdvcmxkIQ==';
    const decoded = fromBase64(encoded);
    expect(decoded).toBe('Hello, World!');
  });

  it('应该正确处理中文字符', () => {
    const input = '你好，世界！';
    const encoded = toBase64(input);
    const decoded = fromBase64(encoded);
    expect(decoded).toBe(input);
  });

  it('应该正确处理 JSON 字符串', () => {
    const json = JSON.stringify({ name: '测试', value: 42 });
    const encoded = toBase64(json);
    const decoded = fromBase64(encoded);
    expect(JSON.parse(decoded)).toEqual({ name: '测试', value: 42 });
  });
});
