import React from 'react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { formatCurrency } from '../../constants/currencies';
import { format } from 'date-fns';

export const DepositHistory: React.FC = () => {
  const { transactions } = useFinanceData();
  
  // Filter only deposit transactions
  const deposits = transactions.filter(
    t => t.type === 'income' && t.description === 'إيداع نقدي'
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6" dir="rtl">
      <h2 className="text-xl font-semibold mb-6">سجل الإيداعات</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحساب</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المبلغ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deposits.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  لا توجد إيداعات حتى الآن
                </td>
              </tr>
            ) : (
              deposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(new Date(deposit.date), 'yyyy/MM/dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {deposit.accountId}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {formatCurrency(deposit.amount, 'SAR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};