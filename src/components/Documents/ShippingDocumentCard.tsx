import React from 'react';
import { FileText, Truck, Calendar, MapPin, Package, Download, Trash2 } from 'lucide-react';
import { ShippingDocument } from '../../types/shipping';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { formatCurrency } from '../../constants/currencies';

interface ShippingDocumentCardProps {
  document: ShippingDocument;
  onDelete: (id: string) => void;
}

export const ShippingDocumentCard: React.FC<ShippingDocumentCardProps> = ({
  document,
  onDelete,
}) => {
  const getStatusColor = (status: ShippingDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ShippingDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'in_transit':
        return 'في الطريق';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const totalValue = (document.items || []).reduce((sum, item) => sum + (item.value || 0), 0);
  const itemCount = (document.items || []).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {document.type === 'bill_of_lading' ? 'بوليصة شحن' : 
               document.type === 'shipping_invoice' ? 'فاتورة شحن' :
               document.type === 'packing_list' ? 'قائمة تعبئة' : 'بيان جمركي'}
            </h3>
            <p className="text-sm text-gray-500">
              رقم الشحنة: {document.shipmentNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(document.url, '_blank')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Truck className="h-5 w-5" />
          <span>{document.carrier}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>
            {document.estimatedDelivery
              ? format(new Date(document.estimatedDelivery), 'yyyy/MM/dd', { locale: ar })
              : 'غير محدد'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-5 w-5" />
          <span>{document.origin} → {document.destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>{itemCount} قطعة</span>
        </div>
      </div>

      {totalValue > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            إجمالي قيمة البضاعة: {formatCurrency(totalValue, 'SAR')}
          </p>
        </div>
      )}

      {document.recipientInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">معلومات المستلم:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>الاسم: {document.recipientInfo.name}</p>
            <p>الهاتف: {document.recipientInfo.phone}</p>
            <p>العنوان: {document.recipientInfo.address}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(document.status)}`}>
          {getStatusText(document.status)}
        </span>
        <span className="text-sm text-gray-500">
          تم الرفع: {format(new Date(document.uploadDate), 'yyyy/MM/dd', { locale: ar })}
        </span>
      </div>
    </div>
  );
};