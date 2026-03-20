/**
 * XSS 防护 - HTML 特殊字符转义
 */
export function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}

/**
 * 验证输入是否安全（用于输入端验证）
 */
export function validateInput(str: string, maxLength: number = 10000): { valid: boolean; error?: string } {
  if (str.length > maxLength) {
    return { valid: false, error: `输入超过最大长度 ${maxLength}` };
  }

  // 检测潜在的 XSS 攻击
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(str)) {
      return { valid: false, error: '输入包含不安全内容' };
    }
  }

  return { valid: true };
}
