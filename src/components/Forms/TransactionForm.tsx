import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Account } from '../../types/finance';
import { useTranslation } from 'react-i18next';

interface TransactionFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  accounts: Account[];
  selectedType: 'income' | 'expense';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  register,
  errors,
  accounts,
  selectedType
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('transactions.selectAccount')}
        </label>
        <select
          {...register('accountId', { required: t('errors.accountRequired') })}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('transactions.selectAccount')}</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {errors.accountId && (
          <p className="mt-2 text-sm text-red-600">{errors.accountId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('transactions.enterAmount')}
        </label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { 
            required: t('errors.amountRequired'),
            min: { value: 0.01, message: t('errors.invalidAmount') }
          })}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder={t('transactions.enterAmount')}
        />
        {errors.amount && (
          <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('transactions.category')}
        </label>
        <select
          {...register('category', { required: t('errors.categoryRequired') })}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('transactions.selectCategory')}</option>
          {selectedType === 'income' ? (
            <>
              <option value="salary">{t('categories.income.salary')}</option>
              <option value="investment">{t('categories.income.investment')}</option>
              <option value="sales">{t('categories.income.sales')}</option>
              <option value="other">{t('categories.income.other')}</option>
            </>
          ) : (
            <>
              <option value="utilities">{t('categories.expense.utilities')}</option>
              <option value="rent">{t('categories.expense.rent')}</option>
              <option value="supplies">{t('categories.expense.supplies')}</option>
              <option value="salary">{t('categories.expense.salary')}</option>
              <option value="other">{t('categories.expense.other')}</option>
            </>
          )}
        </select>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('transactions.description')}
        </label>
        <input
          type="text"
          {...register('description', { 
            required: t('errors.descriptionRequired')
          })}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder={t('transactions.enterDescription')}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};