import React from 'react';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { DailyTransactions } from '../components/Dashboard/DailyTransactions';
import { RecentTransactions } from '../components/Dashboard/RecentTransactions';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Statistics */}
        <DashboardHeader />
        
        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Transactions Form */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <DailyTransactions />
          </div>

          {/* Recent Transactions */}
          <div className="space-y-8">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};