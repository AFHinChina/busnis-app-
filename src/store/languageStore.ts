import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, languages } from '../types/language';
import { updateDocumentDirection } from '../utils/languageUtils';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: (localStorage.getItem('language') as Language) || 'ar',
      setLanguage: (language) => {
        set({ currentLanguage: language });
        updateDocumentDirection(language);
        localStorage.setItem('language', language);
      },
    }),
    {
      name: 'language-store',
    }
  )
);