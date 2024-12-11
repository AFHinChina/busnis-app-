import React from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '../../types/finance';
import { formatCurrency } from '../../constants/currencies';
import { z } from 'zod';

const depositFormSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
});

type FormData = z.infer<typeof depositFormSchema>;

interface DepositFormProps {
  account: Account;
  onSubmit: (amount: number) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DepositForm: React.FC<DepositFormProps> = ({
  account,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data.amount);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">إيداع في {account.name}</h3>
        <p className="text-sm text-gray-600 mb-4">
          الرصيد الحالي: {formatCurrency(account.balance, account.currency)}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          مبلغ الإيداع
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { 
              required: 'هذا الحقل مطلوب',
              valueAsNumber: true,
              min: { value: 0.01, message: 'المبلغ يجب أن يكون أكبر من صفر' }
            })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل المبلغ"
          />
          <span className="absolute left-3 top-2 text-gray-500">
            {account.currency}
          </span>
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'جاري الإيداع...' : 'إيداع'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};