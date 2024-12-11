import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../constants/currencies';

interface ExpensesChartProps {
  data: Array<{
    period: string;
    دخل: number;
    مصروفات: number;
  }>;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({ data }) => {
  const formatYAxis = (value: number) => formatCurrency(value, 'SAR');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-6">تحليل الدخل والمصروفات</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value, 'SAR')}
              labelStyle={{ fontFamily: 'inherit' }}
            />
            <Legend />
            <Bar dataKey="دخل" fill="#10B981" />
            <Bar dataKey="مصروفات" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};