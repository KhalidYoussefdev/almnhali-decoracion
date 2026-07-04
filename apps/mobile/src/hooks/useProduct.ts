import { useEffect, useState } from 'react';
import { fetchProductById } from '@/lib/api';
import { getProductById, type Product } from '@/data/products';

function normalizeId(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function useProduct(id: string | undefined) {
  const productId = normalizeId(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      const remote = await fetchProductById(productId);
      if (!active) return;
      setProduct(remote ?? getProductById(productId) ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [productId]);

  return { product, loading };
}