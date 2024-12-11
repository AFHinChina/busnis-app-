import React from 'react';
import { useForm } from 'react-hook-form';
import { useFinanceData } from '../../hooks/useFinanceData';
import { useTranslation } from 'react-i18next';
import { TransactionForm } from '../Forms/TransactionForm';
import { ErrorMessage } from '../UI/ErrorMessage';
import { TransactionTypeSelector } from '../UI/TransactionTypeSelector';
import { X } from 'lucide-react';

interface DailyTransactionsProps {
  onClose?: () => void;
}

export const DailyTransactions: React.FC<DailyTransactionsProps> = ({ onClose }) => {
  const { accounts, createTransaction } = useFinanceData();
  const [error, setError] = React.useState<string | null>(null);
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      type: 'income',
      accountId: '',
      amount: '',
      description: '',
      category: '',
    }
  });

  const selectedType = watch('type');
  const selectedAccountId = watch('accountId');
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      if (!selectedAccount) {
        setError(t('errors.selectAccount'));
        return;
      }

      if (!data.category) {
        setError(t('errors.selectCategory'));
        return;
      }

      await createTransaction.mutateAsync({
        accountId: data.accountId,
        type: data.type,
        amount: Number(data.amount),
        description: data.description,
        category: data.category,
        date: new Date(),
        tags: []
      });

      if (onClose) onClose();
    } catch (error: any) {
      setError(error.message || t('errors.transactionFailed'));
    }
  };

  return (
    <div className="p-6 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center">{t('transactions.whatToRecord')}</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <TransactionTypeSelector
          selectedType={selectedType}
          onChange={(type) => setValue('type', type)}
        />

        <TransactionForm
          register={register}
          errors={errors}
          accounts={accounts}
          selectedType={selectedType}
        />

        <button
          type="submit"
          disabled={isSubmitting || accounts.length === 0}
          className={`w-full py-4 px-6 text-lg rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 ${
            selectedType === 'income'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
          } disabled:cursor-not-allowed`}
        >
          {isSubmitting 
            ? t('common.processing')
            : accounts.length === 0 
              ? t('errors.noAccounts')
              : selectedType === 'income'
                ? t('transactions.addIncome')
                : t('transactions.addExpense')}
        </button>
      </form>
    </div>
  );
};