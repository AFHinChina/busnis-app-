import React, { useState } from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { X } from 'lucide-react';
import { formatCurrency } from '../../constants/currencies';

interface AccountOperationsProps {
  accountId: string;
  type: 'deposit' | 'withdraw';
  onClose: () => void;
}

export const AccountOperations: React.FC<AccountOperationsProps> = ({
  accountId,
  type,
  onClose,
}) => {
  const { accounts, createTransaction } = useFinanceData();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const account = accounts.find(a => a.id === accountId);
  if (!account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('يرجى إدخال مبلغ صحيح');
      }

      if (type === 'withdraw' && numAmount > account.balance) {
        throw new Error('رصيد الحساب غير كافي');
      }

      await createTransaction.mutateAsync({
        id: crypto.randomUUID(),
        accountId,
        type: type === 'deposit' ? 'income' : 'expense',
        amount: numAmount,
        description: type === 'deposit' ? 'إيداع نقدي' : 'سحب نقدي',
        category: type === 'deposit' ? 'deposit' : 'withdrawal',
        date: new Date(),
        tags: []
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء العملية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {type === 'deposit' ? 'إيداع نقدي' : 'سحب نقدي'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{account.name}</h3>
          <p className="text-gray-600">
            الرصيد الحالي: {formatCurrency(account.balance, account.currency)}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل المبلغ"
                required
              />
              <span className="absolute left-3 top-3 text-gray-500">
                {account.currency}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors ${
                type === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {isSubmitting
                ? 'جاري التنفيذ...'
                : type === 'deposit'
                ? 'إيداع'
                : 'سحب'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};