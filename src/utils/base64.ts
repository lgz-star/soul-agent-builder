/**
 * Base64 编码工具
 */

export function toBase64(str: string): string {
  try {
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    return '';
  } catch (error) {
    throw new Error('Base64 编码失败');
  }
}

export function fromBase64(base64: string): string {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(base64)));
    }
    return '';
  } catch (error) {
    throw new Error('Base64 解码失败');
  }
}
