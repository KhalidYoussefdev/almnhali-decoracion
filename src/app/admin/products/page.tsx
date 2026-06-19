'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppImage } from '@/components/ui/AppImage';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-navy">Products</h1>
          <p className="text-charcoal/60 mt-1">{products.length} items in catalog</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-semibold rounded-xl">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-charcoal/60">Loading...</p>
      ) : (
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-beige text-navy">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-beige">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.images[0] && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <AppImage src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-navy">{p.name_en}</p>
                        <p className="text-charcoal/50 text-xs">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-charcoal/70">{p.category}</td>
                  <td className="p-4 font-medium">{p.price} SAR</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.inStock ? 'In stock' : 'Out'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="p-2 hover:bg-beige rounded-lg">
                        <Pencil className="h-4 w-4 text-navy" />
                      </Link>
                      <button onClick={() => remove(p.id)} className="p-2 hover:bg-terracotta/10 rounded-lg">
                        <Trash2 className="h-4 w-4 text-terracotta" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}