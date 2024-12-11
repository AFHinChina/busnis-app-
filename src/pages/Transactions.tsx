import React, { useState } from 'react';
import { PlusCircle, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { format } from 'date-fns';
import { formatCurrency } from '../constants/currencies';
import { DailyTransactions } from '../components/Dashboard/DailyTransactions';
import { TransactionFilters } from '../components/Transactions/TransactionFilters';

export const Transactions: React.FC = () => {
  const { transactions, accounts } = useFinanceData();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredTransactions,
  } = useTransactionFilters(transactions);

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'حساب غير معروف';
  };

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المعاملات</h1>
        <button
          onClick={() => setShowTransactionForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="font-medium">تسجيل معاملة جديدة</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في المعاملات..."
                  className="w-full pr-10 py-2 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <TransactionFilters
              filters={filters}
              onFilterChange={setFilters}
              accounts={accounts}
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد معاملات</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{getAccountName(transaction.accountId)}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(transaction.date), 'yyyy/MM/dd HH:mm')}</span>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
            <DailyTransactions onClose={() => setShowTransactionForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};