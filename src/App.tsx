import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { useLanguageStore } from './store/languageStore';
import { languages } from './types/language';
import { useTranslation } from 'react-i18next';
import { FirstUseWizard } from './components/FirstUse/FirstUseWizard';
import { LoadingSpinner } from './components/UI/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reports = lazy(() => import('./pages/Reports'));
const Customers = lazy(() => import('./pages/Customers'));
const Vendors = lazy(() => import('./pages/Vendors'));
const Documents = lazy(() => import('./pages/Documents'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const direction = languages[currentLanguage].direction;

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLanguage;
    document.documentElement.style.fontFamily = languages[currentLanguage].fontFamily;
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, direction, i18n]);

  return (
    <Router>
      <div className={`min-h-screen bg-gray-100 flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Sidebar />
        <div className={`flex-1 ${direction === 'rtl' ? 'lg:mr-64' : 'lg:ml-64'} w-full transition-all duration-300 ease-in-out`}>
          <main className="flex-1 pb-8 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
      <FirstUseWizard />
    </Router>
  );
}

export default App;