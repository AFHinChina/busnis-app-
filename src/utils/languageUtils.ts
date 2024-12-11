import { Language, languages } from '../types/language';

export const updateDocumentDirection = (language: Language) => {
  const config = languages[language];
  
  // Update document direction and language
  document.documentElement.dir = config.direction;
  document.documentElement.lang = language;
  
  // Update font family
  document.documentElement.style.setProperty('--font-family', config.fontFamily);
  
  // Update body classes
  document.body.classList.remove('rtl', 'ltr');
  document.body.classList.add(config.direction);
  
  // Force layout recalculation for RTL/LTR switch
  document.body.style.display = 'none';
  document.body.offsetHeight; // Force reflow
  document.body.style.display = '';
};

export const formatNumber = (number: number, language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };
  
  return new Intl.NumberFormat(locales[language]).format(number);
};

export const formatDate = (date: Date, language: Language): string => {
  const locales = {
    ar: 'ar-SA',
    en: 'en-US',
    zh: 'zh-CN'
  };
  
  return new Intl.DateTimeFormat(locales[language]).format(date);
};

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