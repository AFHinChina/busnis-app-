import React from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '../../types/finance';
import { currencies } from '../../constants/currencies';

interface AccountFormProps {
  onSubmit: (data: Omit<Account, 'id' | 'lastSync'>) => Promise<void>;
  isLoading?: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Account, 'id' | 'lastSync'>>();

  const handleFormSubmit = async (data: Omit<Account, 'id' | 'lastSync'>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" dir="rtl">
      <div>
        <label className="block text-sm font-medium text-gray-700">اسم الحساب</label>
        <input
          type="text"
          {...register('name', { required: 'هذا الحقل مطلوب' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="أدخل اسم الحساب"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">نوع الحساب</label>
        <select
          {...register('type', { required: 'هذا الحقل مطلوب' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="checking">حساب جاري</option>
          <option value="savings">حساب توفير</option>
          <option value="investment">حساب استثماري</option>
        </select>
        {errors.type && (
          <span className="text-red-500 text-sm">{errors.type.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">الرصيد الافتتاحي</label>
        <input
          type="number"
          step="0.01"
          {...register('balance', {
            required: 'هذا الحقل مطلوب',
            valueAsNumber: true,
            min: { value: 0, message: 'الرصيد يجب أن يكون صفر أو أكبر' }
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="0.00"
        />
        {errors.balance && (
          <span className="text-red-500 text-sm">{errors.balance.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">العملة</label>
        <select
          {...register('currency', { required: 'هذا الحقل مطلوب' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.symbol})
            </option>
          ))}
        </select>
        {errors.currency && (
          <span className="text-red-500 text-sm">{errors.currency.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'جاري الإضافة...' : 'إضافة الحساب'}
      </button>
    </form>
  );
};