/**
 * Base64 编码工具
 */

// 声明 Buffer 类型以支持 Node.js/Bun 环境
declare const Buffer: {
  from(str: string, encoding?: string): { toString(encoding: string): string };
};

export function toBase64(str: string): string {
  try {
    // Node.js/Bun 环境
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    // 浏览器环境
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    throw new Error('当前环境不支持 Base64 编码');
  } catch (error) {
    throw new Error('Base64 编码失败');
  }
}

export function fromBase64(base64: string): string {
  try {
    // Node.js/Bun 环境
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    // 浏览器环境
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(base64)));
    }
    throw new Error('当前环境不支持 Base64 解码');
  } catch (error) {
    throw new Error('Base64 解码失败');
  }
}
