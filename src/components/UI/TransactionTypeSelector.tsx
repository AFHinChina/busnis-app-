import React from 'react';
import { useTranslation } from 'react-i18next';

interface TransactionTypeSelectorProps {
  selectedType: 'income' | 'expense';
  onChange: (type: 'income' | 'expense') => void;
}

export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  selectedType,
  onChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange('income')}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedType === 'income'
            ? 'border-green-500 bg-green-50 shadow-lg'
            : 'border-gray-200 hover:border-green-200 hover:bg-green-50/50'
        }`}
      >
        <span className={`block text-lg font-medium ${
          selectedType === 'income' ? 'text-green-700' : 'text-gray-600'
        }`}>
          {t('transactions.income')}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChange('expense')}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedType === 'expense'
            ? 'border-red-500 bg-red-50 shadow-lg'
            : 'border-gray-200 hover:border-red-200 hover:bg-red-50/50'
        }`}
      >
        <span className={`block text-lg font-medium ${
          selectedType === 'expense' ? 'text-red-700' : 'text-gray-600'
        }`}>
          {t('transactions.expense')}
        </span>
      </button>
    </div>
  );
};