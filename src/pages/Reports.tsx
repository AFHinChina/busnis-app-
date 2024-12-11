import React, { useState } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { BalanceChart } from '../components/Reports/BalanceChart';
import { ExpensesChart } from '../components/Reports/ExpensesChart';
import { SummaryCards } from '../components/Reports/SummaryCards';
import { CategoryBreakdown } from '../components/Reports/CategoryBreakdown';
import { FilterModal } from '../components/Reports/FilterModal';
import { useReportData } from '../hooks/useReportData';
import { exportReport } from '../utils/reportExport';

export const Reports: React.FC = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    period,
    setPeriod,
    filters,
    setFilters,
    periodData,
    categoryData,
    summaryData,
  } = useReportData();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportReport({
        period,
        periodData,
        summaryData,
        categoryData,
      });
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">التقارير المالية</h1>
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
                className="appearance-none bg-white px-4 py-2 pr-10 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">أسبوعي</option>
                <option value="month">شهري</option>
                <option value="year">سنوي</option>
              </select>
              <Calendar className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              <span>تصفية</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>{isExporting ? 'جاري التصدير...' : 'تصدير التقرير'}</span>
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpensesChart data={periodData} />
          <BalanceChart data={periodData} />
          <CategoryBreakdown data={categoryData} />
          <SummaryCards data={summaryData} />
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApplyFilters={setFilters}
        />
      </div>
    </div>
  );
};