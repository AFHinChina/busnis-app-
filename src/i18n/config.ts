import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar';
import en from './locales/en';
import zh from './locales/zh';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
    zh: { translation: zh }
  },
  lng: localStorage.getItem('language') || 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;