'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppImage } from '@/components/ui/AppImage';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';

export default function CollectionsPage() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const tCat = useTranslations('catalog');
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const isAr = locale === 'ar';
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl overflow-hidden">
        {/* Same top bar as catalog */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-navy text-cream px-5 py-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold">
              {isAr ? settings.brand.name_ar : settings.brand.name_en}
            </p>
            <h1 className="font-display text-xl mt-0.5">{t('collections')}</h1>
          </div>
          <Link
            href="/catalog"
            className="text-xs border border-gold/40 text-gold px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
          >
            {t('catalog')}
          </Link>
        </motion.div>

        {/* Same hero style as catalog */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative h-44 overflow-hidden"
        >
          <AppImage
            src="/api/uploads/catalog/wpc-wall-panel/wpc-wall-panel-0002.jpg"
            alt={t('collections')}
            fill
            className="object-cover"
            priority
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="absolute inset-x-0 bottom-0 p-5 text-white"
          >
            <p className="text-gold text-xs font-semibold tracking-widest uppercase">
              {isAr ? 'المنتجات' : 'Products'}
            </p>
            <h2 className="font-display text-2xl mt-1 leading-tight">
              {isAr ? 'تسوق المنتجات' : 'Shop Products'}
            </h2>
            <p className="text-cream/80 text-sm mt-1">
              {isAr
                ? 'أسعار واضحة — اضغط للانتقال لصفحة المنتج'
                : 'Prices shown — tap to open product page'}
            </p>
          </motion.div>
        </motion.div>

        {/* Menu chips — same category menu as catalog */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-beige-dark/30 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !category
                ? 'bg-gold text-navy'
                : 'border border-beige-dark/50 text-navy dark:text-cream'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          {settings.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === cat.id
                  ? 'bg-gold text-navy'
                  : 'border border-beige-dark/50 text-navy dark:text-cream'
              }`}
            >
              {isAr ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>

        <div className="px-4 pt-4 pb-1 flex items-center justify-between">
          <p className="text-xs text-charcoal/60 dark:text-cream/50">
            {filtered.length} {tCat('items')}
          </p>
          <Link href="/shop" className="text-xs text-gold font-semibold">
            {tCat('allProducts')}
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{tCat('loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{tCat('empty')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-3 pb-10">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="border-t border-beige-dark/40 px-5 py-6 text-center bg-beige/40 dark:bg-navy-900">
          <p className="text-xs text-charcoal/60 dark:text-cream/50">{tCat('footerNote')}</p>
          <p className="text-sm text-navy dark:text-cream font-medium mt-1" dir="ltr">
            {settings.contact.phone}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/catalog" className="text-xs text-gold font-semibold">
              {t('catalog')}
            </Link>
            <span className="text-charcoal/30">·</span>
            <Link href="/shop" className="text-xs text-gold font-semibold">
              {t('shop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
