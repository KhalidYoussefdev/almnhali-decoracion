'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppImage } from '@/components/ui/AppImage';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { buildCatalogCards } from '@/lib/catalog-browse';

export default function BrowseCatalogPage() {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const settings = useSiteSettings();
  const { products, loading } = useProducts();
  const isAr = locale === 'ar';

  const cards = useMemo(
    () => buildCatalogCards(settings.categories, products),
    [settings.categories, products],
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-navy-900">
      {/* H5-style catalog shell — matches reference QR catalog layout */}
      <div className="mx-auto max-w-lg min-h-screen bg-white dark:bg-navy-800 shadow-xl">
        {/* Top brand bar */}
        <div className="bg-navy text-cream px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold">
              {isAr ? settings.brand.name_ar : settings.brand.name_en}
            </p>
            <h1 className="font-display text-xl mt-0.5">{t('title')}</h1>
          </div>
          <Link
            href="/shop"
            className="text-xs border border-gold/40 text-gold px-3 py-1.5 rounded-full hover:bg-gold/10"
          >
            {t('allProducts')}
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative h-44 overflow-hidden">
          <AppImage
            src="/api/uploads/catalog/wpc-wall-panel/wpc-wall-panel-0002.jpg"
            alt={t('title')}
            fill
            className="object-cover"
            priority
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-gold text-xs font-semibold tracking-widest uppercase">{t('badge')}</p>
            <h2 className="font-display text-2xl mt-1 leading-tight">{t('heroTitle')}</h2>
            <p className="text-cream/80 text-sm mt-1">{t('heroSubtitle')}</p>
          </div>
        </div>

        {/* Section: Popular Product — same structure as reference */}
        <div className="px-4 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gold/40" />
            <h3 className="text-sm font-bold text-navy dark:text-cream tracking-wide whitespace-nowrap">
              {t('popular')}
            </h3>
            <div className="h-px flex-1 bg-gold/40" />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-charcoal/50 text-sm">{t('loading')}</div>
        ) : (
          <div className="px-4 pb-10 grid grid-cols-2 gap-3">
            {cards.map((card, i) => {
              const primary = isAr ? card.name_ar : card.name_en;
              const secondary = isAr ? card.name_en : card.name_ar;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/catalog/${card.id}`}
                    className="group block relative aspect-[3/4] rounded-xl overflow-hidden bg-beige shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <AppImage
                      src={card.image}
                      alt={primary}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 512px) 50vw, 256px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="text-[13px] font-bold leading-snug">{primary}</p>
                      <p className="text-[11px] text-white/75 mt-0.5 leading-snug">{secondary}</p>
                      <p className="text-[10px] text-gold mt-1.5 font-medium">
                        {card.count} {t('items')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer strip like H5 catalogs */}
        <div className="border-t border-beige-dark/40 px-5 py-6 text-center bg-beige/40 dark:bg-navy-900">
          <p className="text-xs text-charcoal/60 dark:text-cream/50">{t('footerNote')}</p>
          <p className="text-sm text-navy dark:text-cream font-medium mt-1" dir="ltr">
            {settings.contact.phone}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/shop" className="text-xs text-gold font-semibold">
              {t('allProducts')}
            </Link>
            <span className="text-charcoal/30">·</span>
            <a
              href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}