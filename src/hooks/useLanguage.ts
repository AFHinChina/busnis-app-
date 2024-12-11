import { useState, useEffect } from 'react';
import { Language, languages } from '../types/language';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      setIsLoading(true);
      try {
        // Update document direction
        document.documentElement.dir = languages[currentLanguage].direction;
        document.documentElement.lang = currentLanguage;
        
        // Update font family
        document.documentElement.style.fontFamily = languages[currentLanguage].fontFamily;
        
        // Store language preference
        localStorage.setItem('language', currentLanguage);
        
        // Load language-specific styles
        if (currentLanguage === 'ar') {
          document.documentElement.classList.add('rtl');
          document.documentElement.classList.remove('ltr');
        } else {
          document.documentElement.classList.add('ltr');
          document.documentElement.classList.remove('rtl');
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return {
    currentLanguage,
    changeLanguage,
    isLoading,
    languages
  };
};