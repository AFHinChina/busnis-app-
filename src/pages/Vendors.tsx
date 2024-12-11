import React, { useState } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import { VendorForm } from '../components/Forms/VendorForm';
import { format } from 'date-fns';
import { formatCurrency } from '../constants/currencies';

export const Vendors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vendors = [], createVendor, isLoading } = useVendors();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.phone && vendor.phone.includes(searchQuery))
  );

  const handleSubmit = async (data: any) => {
    try {
      await createVendor.mutateAsync({
        ...data,
        totalExpense: 0,
        lastTransaction: new Date()
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">الموردين</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 ml-2" />
          إضافة مورد جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الموردين..."
              className="w-full pr-10 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الهاتف</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">إجمالي المدفوعات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">آخر معاملة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    لا يوجد موردين
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {vendor.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {vendor.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(vendor.totalExpense, 'SAR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {vendor.lastTransaction
                        ? format(new Date(vendor.lastTransaction), 'yyyy/MM/dd')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">إضافة مورد جديد</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <VendorForm
              onSubmit={handleSubmit}
              isLoading={createVendor.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};