'use client';

import { useEffect, useState } from 'react';
import { AppImage } from '@/components/ui/AppImage';
import type { Order } from '@/types/order';

interface EnrichedItem {
  productId: string;
  quantity: number;
  variant?: string;
  name: string;
  price: number;
  image: string;
}

type EnrichedOrder = Omit<Order, 'items'> & { items: EnrichedItem[] };

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const paidCount = orders.filter((o) => o.status === 'paid').length;
  const revenue = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl text-navy">Orders</h1>
      <p className="text-charcoal/60 mt-1">Customer orders and payment status</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-charcoal/60">Total Orders</p>
          <p className="font-display text-3xl text-navy mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-charcoal/60">Paid Orders</p>
          <p className="font-display text-3xl text-green-700 mt-1">{paidCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-charcoal/60">Revenue (SAR)</p>
          <p className="font-display text-3xl text-gold mt-1">{revenue.toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-charcoal/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 p-12 bg-white rounded-2xl text-center text-charcoal/60">
          No orders yet. Orders appear here after customers complete checkout.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-beige-dark/30">
                <div>
                  <p className="font-mono text-sm text-navy">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-charcoal/50 mt-0.5">
                    {new Date(order.createdAt).toLocaleString()}
                    {order.paidAt && ` · Paid ${new Date(order.paidAt).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? 'bg-beige text-navy'}`}>
                    {order.status}
                  </span>
                  <span className="font-display text-xl text-gold">{order.total} SAR</span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-beige">
                        <AppImage src={item.image} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{item.name}</p>
                        <p className="text-xs text-charcoal/50">Qty {item.quantity} · {item.price} SAR</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm space-y-2 text-charcoal/70">
                  <p className="font-semibold text-navy">Shipping</p>
                  <p>{order.shipping.fullName}</p>
                  <p>{order.shipping.phone}</p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}{order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}</p>
                  <p className="pt-2 capitalize">Payment: {order.paymentMethod}</p>
                  {order.paymentId && (
                    <p className="font-mono text-xs break-all">ID: {order.paymentId}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}