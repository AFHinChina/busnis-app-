import React from 'react';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">الإعدادات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Save className="h-5 w-5 ml-2" />
          حفظ التغييرات
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">إعدادات الحساب</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  defaultValue="شركتي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-2"
                  defaultValue="info@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العملة الافتراضية
                </label>
                <select className="w-full border rounded-lg p-2">
                  <option value="SAR">ريال سعودي (ر.س)</option>
                  <option value="USD">دولار أمريكي ($)</option>
                  <option value="EUR">يورو (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">إعدادات الإشعارات</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="email-notifications" className="ml-2" />
                <label htmlFor="email-notifications" className="text-sm text-gray-700">
                  تفعيل إشعارات البريد الإلكتروني
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="payment-notifications" className="ml-2" />
                <label htmlFor="payment-notifications" className="text-sm text-gray-700">
                  إشعارات المدفوعات
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};