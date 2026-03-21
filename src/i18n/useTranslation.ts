/**
 * useTranslation Hook
 * 用于组件中获取翻译函数和当前语言
 */
import { useSoulStore } from '../store/soulStore';
import { getTranslations, type Language } from '../i18n';

/**
 * 从嵌套对象中根据 key 路径获取值
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

export function useTranslation() {
  const { language } = useSoulStore();

  const translations = getTranslations(language);

  const t = (key: string): string => {
    return getNestedValue(translations as unknown as Record<string, unknown>, key);
  };

  return {
    t,
    language,
    translations,
  };
}

/**
 * 获取词库条目的本地化名称
 */
export function useLibraryName<T extends { id: string; name: { zh: string; en: string } }>(
  items: T[],
  currentLanguage?: Language
): Record<string, string> {
  const { language: storeLanguage } = useTranslation();
  const lang = currentLanguage || storeLanguage;

  const nameMap: Record<string, string> = {};
  items.forEach((item) => {
    nameMap[item.id] = typeof item.name === 'object' ? item.name[lang] : item.name;
  });

  return nameMap;
}
