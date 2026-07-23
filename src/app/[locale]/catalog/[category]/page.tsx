'use client';

import { use, useMemo, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppImage } from '@/components/ui/AppImage';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { getLocalizedField } from '@/lib/utils';
import { getProductsByCategory } from '@/lib/catalog-browse';
import type { Product } from '@/types/product';

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 360, damping: 26 },
  },
};

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const categoryMeta = settings.categories.find((c) => c.id === category);
  const list = useMemo(
    () => getProductsByCategory(products, category),
    [products, category],
  );

  const active: Product | null =
    activeIndex !== null && list[activeIndex] ? list[activeIndex] : null;

  const closeViewer = useCallback(() => setActiveIndex(null), []);
  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null || list.length === 0) return i;
      return (i - 1 + list.length) % list.length;
    });
  }, [list.length]);
  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null || list.length === 0) return i;
      return (i + 1) % list.length;
    });
  }, [list.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') (isAr ? goNext : goPrev)();
      if (e.key === 'ArrowRight') (isAr ? goPrev : goNext)();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, closeViewer, goPrev, goNext, isAr]);

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

  const lightbox =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active && activeIndex !== null && (
          <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true">
            <motion.button
              type="button"
              aria-label={t('close')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/70 backdrop-blur-md"
              onClick={closeViewer}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="absolute inset-x-3 top-[max(4.5rem,10%)] bottom-6 mx-auto flex max-w-lg flex-col overflow-hidden rounded-2xl bg-cream dark:bg-navy-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-beige-dark/40 dark:border-navy-600 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy dark:text-cream">
                    {getLocalizedField(active, 'name', locale)}
                  </p>
                  <p className="text-[11px] text-charcoal/60 dark:text-cream/50">
                    {activeIndex + 1} / {list.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeViewer}
                  className="rounded-full p-2 text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700"
                  aria-label={t('close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex-1 min-h-0 bg-beige dark:bg-navy-900">
                <AppImage
                  key={active.id}
                  src={active.images[0]}
                  alt={getLocalizedField(active, 'name', locale)}
                  fill
                  className="object-contain p-2"
                  sizes="512px"
                  priority
                />
                {list.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-navy/70 p-2 text-cream backdrop-blur-sm hover:bg-navy"
                      aria-label="Previous"
                    >
                      <BackIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-navy/70 p-2 text-cream backdrop-blur-sm hover:bg-navy"
                      aria-label="Next"
                    >
                      {isAr ? (
                        <ChevronLeft className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </>
                )}
              </div>

              {active.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-beige-dark/40 dark:border-navy-600 p-3">
                  {active.images.map((img, i) => (
                    <div
                      key={img + i}
                      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-beige-dark/40"
                    >
                      <AppImage src={img} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 md:top-[4.5rem] z-20 bg-navy text-cream px-3 py-3 flex items-center gap-2 shadow-lg"
        >
          <Link
            href="/catalog"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-beige-dark/30"
        >
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-gold text-navy text-xs font-semibold">
            {t('productCatalog')}
          </span>
          <Link
            href="/catalog"
            className="shrink-0 px-3 py-1.5 rounded-full border border-beige-dark/50 text-xs text-navy dark:text-cream"
          >
            {t('allCategories')}
          </Link>
        </motion.div>

        {loading ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('loading')}</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('empty')}</div>
        ) : (
          <motion.div
            variants={gridContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2 p-3"
          >
            {list.map((product, index) => (
              <motion.div key={product.id} variants={gridItem} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group block w-full text-start bg-white dark:bg-navy-700 rounded-lg overflow-hidden border border-beige-dark/30 shadow-sm"
                >
                  <div className="relative aspect-square bg-beige overflow-hidden">
                    <AppImage
                      src={product.images[0]}
                      alt={getLocalizedField(product, 'name', locale)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 512px) 50vw, 256px"
                    />
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 text-navy text-[10px] font-semibold px-2 py-1 rounded-full">
                        <Eye className="h-3 w-3" />
                        {t('view')}
                      </span>
                    </div>
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
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-4 py-8 text-center"
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-sm text-navy dark:text-cream font-medium border border-gold/40 px-5 py-2.5 rounded-full hover:bg-gold/10 transition-colors"
          >
            <BackIcon className="h-4 w-4" />
            {t('backToCatalog')}
          </Link>
        </motion.div>
      </div>

      {lightbox}
    </div>
  );
}
