'use client';

import { use, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';

/** Category product list (prices + product page links). Same menu as catalog categories. */
export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations('catalog');
  const tNav = useTranslations('nav');
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const isAr = locale === 'ar';

  const category = settings.categories.find((c) => c.id === id);
  const list = useMemo(
    () => products.filter((p) => p.category === id || p.collection === id),
    [products, id],
  );

  const title = category
    ? isAr
      ? category.name_ar
      : category.name_en
    : tNav('collections');

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl">
        <div className="sticky top-16 md:top-[4.5rem] z-20 bg-navy text-cream px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-gold font-semibold">
              {tNav('collections')}
            </p>
            <h1 className="font-display text-lg truncate">{title}</h1>
          </div>
          <Link
            href="/collections"
            className="shrink-0 text-xs border border-gold/40 text-gold px-3 py-1.5 rounded-full"
          >
            {isAr ? 'الكل' : 'All'}
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-beige-dark/30">
          <Link
            href="/collections"
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {isAr ? 'الكل' : 'All'}
          </Link>
          {settings.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.id}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                cat.id === id
                  ? 'bg-gold text-navy'
                  : 'border border-beige-dark/50 text-navy dark:text-cream'
              }`}
            >
              {isAr ? cat.name_ar : cat.name_en}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-charcoal/50">{t('loading')}</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-sm text-charcoal/50">
            {t('empty')}{' '}
            <Link href="/collections" className="text-gold font-semibold">
              {isAr ? 'العودة' : 'Go back'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-3 pb-10">
            {list.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
