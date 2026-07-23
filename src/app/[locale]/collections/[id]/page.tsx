'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { getLocalizedField } from '@/lib/utils';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations('catalog');
  const tNav = useTranslations('nav');
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const isAr = locale === 'ar';
  const BackIcon = isAr ? ChevronRight : ChevronLeft;

  const collection = settings.collections.find((c) => c.id === id);
  const list = useMemo(
    () => products.filter((p) => p.collection === id),
    [products, id],
  );

  if (!collection) {
    return (
      <div className="p-12 text-center text-charcoal/60">
        {isAr ? 'المجموعة غير موجودة' : 'Collection not found'}
      </div>
    );
  }

  const title = getLocalizedField(collection, 'name', locale);
  const subtitle = isAr ? collection.name_en : collection.name_ar;

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 md:top-[4.5rem] z-20 bg-navy text-cream px-3 py-3 flex items-center gap-2 shadow-lg"
        >
          <Link
            href="/collections"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('back')}
          >
            <BackIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-cream/60 truncate">{subtitle}</p>}
          </div>
          <span className="text-xs text-gold font-semibold shrink-0">
            {list.length} {t('items')}
          </span>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-beige-dark/30">
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-gold text-navy text-xs font-semibold">
            {tNav('collections')}
          </span>
          <Link
            href="/collections"
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {isAr ? 'كل المجموعات' : 'All Collections'}
          </Link>
          <Link
            href="/catalog"
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {tNav('catalog')}
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('loading')}</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('empty')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-3">
            {list.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="px-4 py-8 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1 text-sm text-navy dark:text-cream font-medium border border-gold/40 px-5 py-2.5 rounded-full hover:bg-gold/10 transition-colors"
          >
            <BackIcon className="h-4 w-4" />
            {isAr ? 'العودة للمجموعات' : 'Back to Collections'}
          </Link>
        </div>
      </div>
    </div>
  );
}
