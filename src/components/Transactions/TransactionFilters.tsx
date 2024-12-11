import React from 'react';
import { Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionFilters {
  type?: 'income' | 'expense' | '';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  accountId?: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
  accounts: Array<{ id: string; name: string }>;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  accounts,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      type: '',
      startDate: undefined,
      endDate: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      category: undefined,
      accountId: undefined,
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Filter className="h-5 w-5" />
        <span>تصفية</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">تصفية المعاملات</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* نوع المعاملة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المعاملة
                </label>
                <select
                  value={localFilters.type || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    type: e.target.value as '' | 'income' | 'expense'
                  }))}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">الكل</option>
                  <option value="income">دخل</option>
                  <option value="expense">مصروف</option>
                </select>
              </div>

              {/* الفترة الزمنية */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    من تاريخ
                  </label>
                  <input
                    type="date"
                    value={localFilters.startDate ? format(localFilters.startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      startDate: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إلى تاريخ
                  </label>
                  <input
                    type="date"
                    value={localFilters.endDate ? format(localFilters.endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      endDate: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* المبلغ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأدنى
                  </label>
                  <input
                    type="number"
                    value={localFilters.minAmount || ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      minAmount: e.target.value ? Number(e.target.value) : undefined
                    }))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأقصى
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxAmount || ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      maxAmount: e.target.value ? Number(e.target.value) : undefined
                    }))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* الفئة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={localFilters.category || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    category: e.target.value || undefined
                  }))}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">الكل</option>
                  <option value="salary">رواتب</option>
                  <option value="utilities">مرافق</option>
                  <option value="rent">إيجار</option>
                  <option value="supplies">مستلزمات</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {/* الحساب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحساب
                </label>
                <select
                  value={localFilters.accountId || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    accountId: e.target.value || undefined
                  }))}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">كل الحسابات</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  تطبيق
                </button>
                <button
                  onClick={handleResetFilters}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};