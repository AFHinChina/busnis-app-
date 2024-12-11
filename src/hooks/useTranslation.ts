import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';
import { Language } from '../types/language';

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();

  const t = (key: keyof typeof translations.ar) => {
    return translations[currentLanguage][key] || translations.ar[key];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(getLocale(currentLanguage)).format(num);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(getLocale(currentLanguage), {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(getLocale(currentLanguage)).format(date);
  };

  return {
    t,
    currentLanguage,
    formatNumber,
    formatCurrency,
    formatDate
  };
};

const getLocale = (language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };
  return locales[language];
};