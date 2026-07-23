'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppImage } from '@/components/ui/AppImage';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import { getProductsByCategory } from '@/lib/catalog-browse';

export default function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const locale = useLocale();
  const t = useTranslations('catalog');
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const isAr = locale === 'ar';
  const BackIcon = isAr ? ChevronRight : ChevronLeft;

  const categoryMeta = settings.categories.find((c) => c.id === category);
  const list = useMemo(
    () => getProductsByCategory(products, category),
    [products, category],
  );

  const title = categoryMeta
    ? isAr
      ? categoryMeta.name_ar
      : categoryMeta.name_en
    : category;
  const subtitle = categoryMeta
    ? isAr
      ? categoryMeta.name_en
      : categoryMeta.name_ar
    : '';

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-20 bg-navy text-cream px-3 py-3 flex items-center gap-2">
          <Link
            href="/catalog"
            className="p-2 rounded-full hover:bg-white/10"
            aria-label={t('back')}
          >
            <BackIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg truncate">{title}</h1>
            {subtitle && (
              <p className="text-[11px] text-cream/60 truncate">{subtitle}</p>
            )}
          </div>
          <span className="text-xs text-gold font-semibold shrink-0">
            {list.length} {t('items')}
          </span>
        </div>

        {/* Sub-nav chips — mirrors reference (catalog / assortment style) */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-beige-dark/30 scrollbar-none">
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-gold text-navy text-xs font-semibold">
            {t('productCatalog')}
          </span>
          <Link
            href={`/shop?category=${category}`}
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {t('shopView')}
          </Link>
          <Link
            href="/catalog"
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {t('allCategories')}
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('loading')}</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('empty')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-3">
            {list.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className="group block bg-white dark:bg-navy-700 rounded-lg overflow-hidden border border-beige-dark/30 shadow-sm"
                >
                  <div className="relative aspect-square bg-beige">
                    <AppImage
                      src={product.images[0]}
                      alt={getLocalizedField(product, 'name', locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 512px) 50vw, 256px"
                    />
                    {product.badge && (
                      <span className="absolute top-2 start-2 bg-gold text-navy text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {isAr ? product.badge_ar ?? product.badge : product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[12px] font-semibold text-navy dark:text-cream line-clamp-2 leading-snug min-h-[2.4em]">
                      {getLocalizedField(product, 'name', locale)}
                    </p>
                    <p className="text-[11px] text-gold font-bold mt-1">
                      {formatPrice(product.price, locale)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="px-4 py-8 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-sm text-navy dark:text-cream font-medium border border-gold/40 px-5 py-2.5 rounded-full hover:bg-gold/10"
          >
            <BackIcon className="h-4 w-4" />
            {t('backToCatalog')}
          </Link>
        </div>
      </div>
    </div>
  );
}