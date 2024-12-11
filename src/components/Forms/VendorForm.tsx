import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { vendorSchema } from '../../db/schema';

type VendorFormData = Omit<z.infer<typeof vendorSchema>, 'id' | 'totalExpense' | 'lastTransaction'>;

interface VendorFormProps {
  onSubmit: (data: VendorFormData) => void;
  isLoading?: boolean;
}

export const VendorForm: React.FC<VendorFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VendorFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      <div>
        <label className="block text-sm font-medium text-gray-700">اسم المورد</label>
        <input
          type="text"
          {...register('name', { required: 'هذا الحقل مطلوب' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="أدخل اسم المورد"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
        <input
          type="email"
          {...register('email', {
            required: 'هذا الحقل مطلوب',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'بريد إلكتروني غير صالح',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="example@domain.com"
          dir="ltr"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
        <input
          type="tel"
          {...register('phone', {
            pattern: {
              value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message: 'رقم هاتف غير صالح',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="05xxxxxxxx"
          dir="ltr"
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">{errors.phone.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'جاري الإضافة...' : 'إضافة المورد'}
      </button>
    </form>
  );
};