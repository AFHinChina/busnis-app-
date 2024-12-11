import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../store/languageStore';
import { Language, languages } from '../../types/language';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (code: Language) => {
    try {
      await i18n.changeLanguage(code);
      setLanguage(code);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = languages[i18n.language as Language];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          <span>{currentLanguage?.nativeName}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 ${
                i18n.language === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
              }`}
            >
              <span>{lang.nativeName}</span>
              {i18n.language === lang.code && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};