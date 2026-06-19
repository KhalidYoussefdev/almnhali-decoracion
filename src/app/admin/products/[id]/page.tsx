'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types/product';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((list: Product[]) => setProduct(list.find((p) => p.id === id) ?? null));
  }, [id]);

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-navy mb-8">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}