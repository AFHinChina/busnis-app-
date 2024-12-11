export type Language = 'ar' | 'en' | 'zh';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'rtl' | 'ltr';
  fontFamily: string;
}

export const languages: Record<Language, LanguageConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    fontFamily: 'Noto Sans Arabic, system-ui, sans-serif'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    fontFamily: 'system-ui, sans-serif'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    fontFamily: 'Noto Sans SC, system-ui, sans-serif'
  }
};