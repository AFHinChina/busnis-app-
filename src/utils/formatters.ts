import { Language } from '../types/language';

export const formatCurrency = (amount: number, currency: string, language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };

  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (date: Date, language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };

  return new Intl.DateTimeFormat(locales[language]).format(date);
};

export const formatNumber = (number: number, language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };

  return new Intl.NumberFormat(locales[language]).format(number);
};