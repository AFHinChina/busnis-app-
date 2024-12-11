import React from 'react';
import { X } from 'lucide-react';
import { FilterCriteria } from '../../hooks/useReportData';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCriteria;
  onApplyFilters: (filters: FilterCriteria) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">تصفية التقرير</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئات
            </label>
            <select
              multiple
              className="w-full border rounded-lg p-2"
              value={localFilters.categories || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setLocalFilters(prev => ({ ...prev, categories: selected }));
              }}
            >
              <option value="utilities">مرافق</option>
              <option value="rent">إيجار</option>
              <option value="supplies">مستلزمات</option>
              <option value="salary">رواتب</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للمبلغ
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                value={localFilters.minAmount || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  minAmount: e.target.value ? Number(e.target.value) : undefined
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأقصى للمبلغ
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                value={localFilters.maxAmount || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  maxAmount: e.target.value ? Number(e.target.value) : undefined
                }))}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onApplyFilters(localFilters);
                onClose();
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              تطبيق
            </button>
            <button
              onClick={() => {
                setLocalFilters({});
                onApplyFilters({});
                onClose();
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};