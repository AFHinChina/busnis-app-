import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { format } from 'date-fns';
import { formatCurrency } from '../../constants/currencies';
import { useTranslation } from 'react-i18next';

export const RecentTransactions: React.FC = () => {
  const { transactions, accounts } = useFinanceData();
  const { t } = useTranslation();

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : t('transactions.unknownAccount');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-bold">{t('transactions.recentTransactions')}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">{t('transactions.noTransactions')}</p>
            <p className="text-gray-400 mt-2">{t('transactions.startFirstTransaction')}</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 hover:border-gray-200 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    transaction.type === 'income'
                      ? 'bg-green-100 group-hover:bg-green-200'
                      : 'bg-red-100 group-hover:bg-red-200'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownRight
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{getAccountName(transaction.accountId)}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(transaction.date), 'yyyy/MM/dd')}</span>
                  </div>
                </div>
              </div>
              <div
                className={`text-lg font-semibold ${
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(Math.abs(transaction.amount), 'SAR')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};