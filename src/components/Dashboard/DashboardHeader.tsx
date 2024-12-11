import React from 'react';
import { Wallet, TrendingUp, TrendingDown, RotateCcw, PlusCircle } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useTranslation } from 'react-i18next';
import { DailyTransactions } from './DailyTransactions';
import { useLanguageStore } from '../../store/languageStore';
import { formatCurrency } from '../../utils/formatters';

export const DashboardHeader: React.FC = () => {
  const { totalBalance, monthlyIncome, monthlyExpenses } = useDashboardData();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showTransactionForm, setShowTransactionForm] = React.useState(false);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();

  const handleReset = async () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* Main Actions */}
        <div className="flex flex-wrap gap-4 justify-between items-center w-full">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium">{t('dashboard.addTransaction')}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            {t('dashboard.resetData')}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Wallet className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/80 text-lg">{t('dashboard.totalBalance')}</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalBalance, 'SAR', currentLanguage)}</h3>
              </div>
            </div>
          </div>

          {/* Monthly Income */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/80 text-lg">{t('dashboard.monthlyIncome')}</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(monthlyIncome, 'SAR', currentLanguage)}</h3>
              </div>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingDown className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/80 text-lg">{t('dashboard.monthlyExpenses')}</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(monthlyExpenses, 'SAR', currentLanguage)}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{t('modals.resetConfirmTitle')}</h2>
            <p className="text-gray-600 mb-6">
              {t('modals.resetConfirmMessage')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                {t('modals.confirmReset')}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
            <DailyTransactions onClose={() => setShowTransactionForm(false)} />
          </div>
        </div>
      )}
    </>
  );
};