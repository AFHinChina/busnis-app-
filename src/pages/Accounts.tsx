import React, { useState } from 'react';
import { PlusCircle, X, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { AccountForm } from '../components/Forms/AccountForm';
import { AccountOperations } from '../components/Accounts/AccountOperations';
import { formatCurrency } from '../constants/currencies';
import { useTranslation } from 'react-i18next';

export const Accounts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<{
    accountId: string;
    type: 'deposit' | 'withdraw';
  } | null>(null);
  
  const { accounts, createAccount } = useFinanceData();
  const { t } = useTranslation();

  const handleSubmit = async (data: any) => {
    try {
      await createAccount.mutateAsync({
        ...data,
        id: crypto.randomUUID(),
        lastSync: new Date()
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('common.accounts')}</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium">{t('accounts.addNew')}</span>
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <p className="text-white/80 text-lg">{t('accounts.totalBalance')}</p>
              <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalBalance, 'SAR')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
            <Wallet className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">{t('accounts.noAccounts')}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <PlusCircle className="h-5 w-5" />
              {t('accounts.addNew')}
            </button>
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{account.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  account.type === 'checking' ? 'bg-blue-100 text-blue-700' :
                  account.type === 'savings' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {t(`accounts.types.${account.type}`)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('accounts.balance')}</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.balance, account.currency)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOperation({ accountId: account.id, type: 'deposit' })}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <ArrowUpCircle className="h-5 w-5" />
                    <span>{t('accounts.deposit')}</span>
                  </button>
                  <button
                    onClick={() => setSelectedOperation({ accountId: account.id, type: 'withdraw' })}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <ArrowDownCircle className="h-5 w-5" />
                    <span>{t('accounts.withdraw')}</span>
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  {t('accounts.lastUpdate')}: {new Date(account.lastSync).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('accounts.addNew')}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <AccountForm 
              onSubmit={handleSubmit}
              isLoading={createAccount.isPending}
            />
          </div>
        </div>
      )}

      {/* Account Operations Modal */}
      {selectedOperation && (
        <AccountOperations
          accountId={selectedOperation.accountId}
          type={selectedOperation.type}
          onClose={() => setSelectedOperation(null)}
        />
      )}
    </div>
  );
};