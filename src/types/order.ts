import type { CartItem } from '@/stores/cart';

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export type PaymentMethod = 'mada' | 'apple' | 'stc' | 'tabby';
export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  total: number;
  amountHalalas: number;
  paymentId?: string;
  locale: string;
  createdAt: string;
  paidAt?: string;
}