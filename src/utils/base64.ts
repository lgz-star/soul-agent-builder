/**
 * Base64 编码工具
 */

export function toBase64(str: string): string {
  try {
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    // Node.js 环境
    return Buffer.from(str, 'utf-8').toString('base64');
  } catch (error) {
    throw new Error('Base64 编码失败');
  }
}

export function fromBase64(base64: string): string {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(base64)));
    }
    // Node.js 环境
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error('Base64 解码失败');
  }
}
