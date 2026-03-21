/**
 * i18n 翻译系统
 */
import { zh } from './zh';
import { en } from './en';

export type Language = 'zh' | 'en';
export type TranslationType = typeof zh;

const translations: Record<Language, TranslationType> = {
  zh,
  en,
};

/**
 * 从嵌套对象中根据 key 路径获取值
 * 支持 'ui.title', 'layers.identity' 等路径
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  return current as string;
}

/**
 * 获取当前语言的翻译
 * @param language - 当前语言
 * @param key - 翻译键路径，如 'ui.title'
 * @returns 翻译后的字符串
 */
export function t(language: Language, key: string): string {
  const langTranslations = translations[language] || translations.zh;
  return getNestedValue(langTranslations as unknown as Record<string, unknown>, key);
}

/**
 * 获取完整的翻译对象
 */
export function getTranslations(language: Language): TranslationType {
  return translations[language] || translations.zh;
}

/**
 * 获取支持的语言列表
 */
export const supportedLanguages: Language[] = ['zh', 'en'];

// Re-export useTranslation hook
export { useTranslation, useLibraryName } from './useTranslation';

export { zh, en };
