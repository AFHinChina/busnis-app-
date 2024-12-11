import { Document } from './documents';

export interface ShippingDocument extends Document {
  type: 'bill_of_lading' | 'shipping_invoice' | 'packing_list' | 'customs_declaration';
  shipmentNumber: string;
  origin: string;
  destination: string;
  carrier: string;
  estimatedDelivery?: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  items: ShipmentItem[];
  recipientInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface ShipmentItem {
  description: string;
  quantity: number;
  weight: number;
  value?: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export const SHIPPING_DOCUMENT_TYPES = {
  BILL_OF_LADING: 'bill_of_lading',
  SHIPPING_INVOICE: 'shipping_invoice',
  PACKING_LIST: 'packing_list',
  CUSTOMS_DECLARATION: 'customs_declaration'
} as const;

export const SHIPPING_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;