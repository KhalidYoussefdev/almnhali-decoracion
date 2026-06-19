'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, SiteSettings } from '@/types/product';
import { ImageField } from './ImageField';

const emptyProduct = (): Product => ({
  id: '',
  name_en: '',
  name_ar: '',
  desc_en: '',
  desc_ar: '',
  price: 0,
  category: 'flooring',
  category_ar: 'أرضيات SPC',
  collection: 'heritage',
  images: [''],
  rating: 5,
  reviewCount: 0,
  colors: [],
  materials: [],
  inStock: true,
  tags: [],
});

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct());
  const [catalog, setCatalog] = useState<Pick<SiteSettings, 'categories' | 'collections'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then((s: SiteSettings) => {
      setCatalog({ categories: s.categories, collections: s.collections });
    });
  }, []);

  const set = <K extends keyof Product>(key: K, value: Product[K]) => {
    setProduct((p) => ({ ...p, [key]: value }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const method = initial ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        images: product.images.filter(Boolean),
        colors: product.colors.filter(Boolean),
        materials: product.materials.filter(Boolean),
        tags: product.tags.filter(Boolean),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Save failed');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  };

  const onCategoryChange = (catId: string) => {
    const cat = catalog?.categories.find((c) => c.id === catId);
    set('category', catId);
    if (cat) set('category_ar', cat.name_ar);
  };

  if (!catalog) return <p className="text-charcoal/60">Loading...</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Product ID (slug)" value={product.id} onChange={(v) => set('id', v)} disabled={!!initial} placeholder="spc-oak-heritage" />
        <Field label="Price (SAR)" type="number" value={String(product.price)} onChange={(v) => set('price', Number(v))} />
        <Field label="Name (English)" value={product.name_en} onChange={(v) => set('name_en', v)} />
        <Field label="Name (Arabic)" value={product.name_ar} onChange={(v) => set('name_ar', v)} dir="rtl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-navy">Category</label>
          <select
            value={product.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none"
          >
            {catalog.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Collection</label>
          <select
            value={product.collection}
            onChange={(e) => set('collection', e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none"
          >
            {catalog.collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name_en}</option>
            ))}
          </select>
        </div>
      </div>

      <Field label="Description (English)" value={product.desc_en} onChange={(v) => set('desc_en', v)} multiline />
      <Field label="Description (Arabic)" value={product.desc_ar} onChange={(v) => set('desc_ar', v)} multiline dir="rtl" />
      <ImageField
        label="Product Image"
        value={product.images[0] ?? ''}
        onChange={(v) => set('images', [v])}
        hint="Upload from PC or paste an image URL"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Badge (EN)" value={product.badge ?? ''} onChange={(v) => set('badge', v || undefined)} placeholder="Bestseller, New..." />
        <Field label="Badge (AR)" value={product.badge_ar ?? ''} onChange={(v) => set('badge_ar', v || undefined)} dir="rtl" />
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" checked={product.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-4 h-4 accent-gold" />
        <span className="text-sm font-medium text-navy">In Stock</span>
      </label>

      {error && <p className="text-terracotta text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="px-8 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
        {saving ? 'Saving...' : initial ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}

function Field({
  label, value, onChange, type = 'text', multiline, dir, disabled, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; multiline?: boolean; dir?: string; disabled?: boolean; placeholder?: string;
}) {
  const cls = 'w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none disabled:opacity-50';
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} dir={dir} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} disabled={disabled} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}