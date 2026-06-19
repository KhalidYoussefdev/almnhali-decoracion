import Link from 'next/link';
import { getProducts } from '@/lib/data-store';
import { getOrders } from '@/lib/orders';
import { Package, Palette, Plus, ShoppingBag } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  const paidOrders = orders.filter((o) => o.status === 'paid');

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-navy">Dashboard</h1>
      <p className="text-charcoal/60 mt-1">Manage your Almnhali store</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Package className="h-8 w-8 text-gold" />
          <p className="text-3xl font-bold text-navy mt-4">{products.length}</p>
          <p className="text-charcoal/60 text-sm">Total Products</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-navy mt-12">{products.filter((p) => p.inStock).length}</p>
          <p className="text-charcoal/60 text-sm">In Stock</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ShoppingBag className="h-8 w-8 text-gold" />
          <p className="text-3xl font-bold text-navy mt-4">{paidOrders.length}</p>
          <p className="text-charcoal/60 text-sm">Paid Orders</p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90">
          <Plus className="h-5 w-5" /> Add Product
        </Link>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-cream transition-colors">
          <ShoppingBag className="h-5 w-5" /> View Orders
        </Link>
        <Link href="/admin/appearance" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-cream transition-colors">
          <Palette className="h-5 w-5" /> Site Content
        </Link>
      </div>
    </div>
  );
}