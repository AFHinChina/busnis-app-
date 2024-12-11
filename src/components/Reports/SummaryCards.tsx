import React from 'react';
import { formatCurrency } from '../../constants/currencies';

interface SummaryCardsProps {
  data: {
    income: number;
    expenses: number;
    netCashFlow: number;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">إجمالي الدخل</h3>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(data.income, 'SAR')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">إجمالي المصروفات</h3>
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(data.expenses, 'SAR')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">صافي التدفق النقدي</h3>
        <p className={`text-3xl font-bold ${data.netCashFlow >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {formatCurrency(data.netCashFlow, 'SAR')}
        </p>
      </div>
    </div>
  );
};