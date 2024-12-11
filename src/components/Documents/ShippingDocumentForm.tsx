import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { ShippingDocument, ShipmentItem, SHIPPING_DOCUMENT_TYPES, SHIPPING_STATUS } from '../../types/shipping';

interface ShippingDocumentFormProps {
  onSubmit: (data: Partial<ShippingDocument>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ShippingDocumentForm: React.FC<ShippingDocumentFormProps> = ({
  onSubmit,
  onClose,
  isLoading
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<ShippingDocument>>();
  const items = watch('items') || [];

  const addItem = () => {
    setValue('items', [...items, {
      description: '',
      quantity: 1,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 }
    }]);
  };

  const removeItem = (index: number) => {
    setValue('items', items.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">إضافة مستند شحن</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المستند
              </label>
              <select
                {...register('type', { required: 'هذا الحقل مطلوب' })}
                className="w-full border rounded-lg p-2"
              >
                <option value={SHIPPING_DOCUMENT_TYPES.BILL_OF_LADING}>بوليصة شحن</option>
                <option value={SHIPPING_DOCUMENT_TYPES.SHIPPING_INVOICE}>فاتورة شحن</option>
                <option value={SHIPPING_DOCUMENT_TYPES.PACKING_LIST}>قائمة تعبئة</option>
                <option value={SHIPPING_DOCUMENT_TYPES.CUSTOMS_DECLARATION}>بيان جمركي</option>
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm">{errors.type.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الشحنة
              </label>
              <input
                type="text"
                {...register('shipmentNumber', { required: 'هذا الحقل مطلوب' })}
                className="w-full border rounded-lg p-2"
              />
              {errors.shipmentNumber && (
                <span className="text-red-500 text-sm">{errors.shipmentNumber.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بلد المنشأ
              </label>
              <input
                type="text"
                {...register('origin', { required: 'هذا الحقل مطلوب' })}
                className="w-full border rounded-lg p-2"
              />
              {errors.origin && (
                <span className="text-red-500 text-sm">{errors.origin.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بلد الوصول
              </label>
              <input
                type="text"
                {...register('destination', { required: 'هذا الحقل مطلوب' })}
                className="w-full border rounded-lg p-2"
              />
              {errors.destination && (
                <span className="text-red-500 text-sm">{errors.destination.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شركة الشحن
              </label>
              <input
                type="text"
                {...register('carrier', { required: 'هذا الحقل مطلوب' })}
                className="w-full border rounded-lg p-2"
              />
              {errors.carrier && (
                <span className="text-red-500 text-sm">{errors.carrier.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ التسليم المتوقع
              </label>
              <input
                type="date"
                {...register('estimatedDelivery')}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة
            </label>
            <select
              {...register('status', { required: 'هذا الحقل مطلوب' })}
              className="w-full border rounded-lg p-2"
            >
              <option value={SHIPPING_STATUS.PENDING}>قيد الانتظار</option>
              <option value={SHIPPING_STATUS.IN_TRANSIT}>في الطريق</option>
              <option value={SHIPPING_STATUS.DELIVERED}>تم التسليم</option>
              <option value={SHIPPING_STATUS.CANCELLED}>ملغي</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm">{errors.status.message}</span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                البضائع المشحونة
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                إضافة بضاعة
              </button>
            </div>

            {items.map((_, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-700">بضاعة {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف
                    </label>
                    <input
                      type="text"
                      {...register(`items.${index}.description` as const, { required: true })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.quantity` as const, { required: true, min: 1 })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوزن (كجم)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.weight` as const, { required: true, min: 0 })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الطول
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.dimensions.length` as const, { required: true, min: 0 })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العرض
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.dimensions.width` as const, { required: true, min: 0 })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الارتفاع
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.dimensions.height` as const, { required: true, min: 0 })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ المستند'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};