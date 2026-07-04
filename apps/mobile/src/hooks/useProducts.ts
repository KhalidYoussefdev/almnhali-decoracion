import { useEffect, useState } from 'react';
import type { Product } from '@/data/products';
import { fetchProducts } from '@/lib/api';
import { products as fallbackProducts } from '@/data/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data.length > 0) setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}