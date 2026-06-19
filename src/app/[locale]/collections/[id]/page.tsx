'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ProductCard } from '@/components/ui/ProductCard';
import { getLocalizedField } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const collection = settings.collections.find((c) => c.id === id);

  const filtered = useMemo(() => products.filter((p) => p.collection === id), [products, id]);

  if (!collection) return <div className="p-12 text-center">Collection not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-navy dark:text-cream">{getLocalizedField(collection, 'name', locale)}</h1>
        <p className="mt-4 text-charcoal/60 dark:text-cream/60 max-w-2xl">{getLocalizedField(collection, 'desc', locale)}</p>
      </motion.div>
      {loading ? (
        <p className="text-charcoal/60">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
}