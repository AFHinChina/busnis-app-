import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Wallet,
  BarChart2,
  Users,
  Settings,
  FileText,
  TrendingUp,
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { NotificationBell } from '../Notifications/NotificationBell';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../store/languageStore';
import { languages } from '../../types/language';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageStore();
  const direction = languages[currentLanguage].direction;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('common.dashboard'), icon: Home, path: '/' },
    { name: t('common.accounts'), icon: Wallet, path: '/accounts' },
    { name: t('common.transactions'), icon: TrendingUp, path: '/transactions' },
    { name: t('common.reports'), icon: BarChart2, path: '/reports' },
    { name: t('common.customers'), icon: Users, path: '/customers' },
    { name: t('common.vendors'), icon: ShoppingBag, path: '/vendors' },
    { name: t('common.documents'), icon: FileText, path: '/documents' },
    { name: t('common.settings'), icon: Settings, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 ${direction === 'rtl' ? 'right-4' : 'left-4'} z-50 p-2 rounded-lg bg-white shadow-lg`}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 w-64 bg-white border-l border-r transition-transform duration-300 ease-in-out z-40
        ${direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'}
        ${isMobileMenuOpen ? 'translate-x-0' : (direction === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b">
            <div className={`flex items-center ${direction === 'rtl' ? 'justify-between' : 'justify-between flex-row-reverse'}`}>
              <NotificationBell />
              <div className={`flex items-center ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                <Wallet className="h-8 w-8 text-blue-600" />
                <span className={`text-xl font-bold text-gray-900 ${
                  direction === 'rtl' ? 'mr-2' : 'ml-2'
                }`}>{t('common.financeHub')}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full
                  ${location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Footer with Language Switcher */}
          <div className="flex-shrink-0 p-4 border-t">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
};