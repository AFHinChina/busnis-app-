import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../constants/currencies';

interface BalanceChartProps {
  data: Array<{
    period: string;
    دخل: number;
    مصروفات: number;
    صافي: number;
  }>;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  const formatYAxis = (value: number) => formatCurrency(value, 'SAR');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-6">تطور الرصيد</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value, 'SAR')}
              labelStyle={{ fontFamily: 'inherit' }}
            />
            <Legend />
            <Line type="monotone" dataKey="دخل" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="مصروفات" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="صافي" stroke="#6366F1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};