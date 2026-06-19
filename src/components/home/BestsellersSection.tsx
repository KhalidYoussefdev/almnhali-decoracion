'use client';

import { useLocale } from 'next-intl';
import { ProductCard } from '@/components/ui/ProductCard';
import { useSiteSettings } from '@/contexts/SettingsContext';
import type { Product } from '@/types/product';

export function BestsellersSection({ products }: { products: Product[] }) {
  const locale = useLocale();
  const settings = useSiteSettings();
  const isAr = locale === 'ar';
  const eyebrow = isAr ? settings.homepage.bestsellersEyebrow_ar : settings.homepage.bestsellersEyebrow_en;
  const title = isAr ? settings.homepage.bestsellersTitle_ar : settings.homepage.bestsellersTitle_en;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">{eyebrow}</span>
            <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream mt-2">{title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}