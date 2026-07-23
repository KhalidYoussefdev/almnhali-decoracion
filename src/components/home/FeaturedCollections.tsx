'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { useProducts } from '@/hooks/useProducts';
import { buildCatalogCards } from '@/lib/catalog-browse';
import { useMemo } from 'react';

export function FeaturedCollections() {
  const locale = useLocale();
  const settings = useSiteSettings();
  const { products } = useProducts();
  const isAr = locale === 'ar';
  const title = isAr ? settings.homepage.collectionsTitle_ar : settings.homepage.collectionsTitle_en;
  const subtitle = isAr ? settings.homepage.collectionsSubtitle_ar : settings.homepage.collectionsSubtitle_en;
  const productsLabel = isAr ? settings.homepage.productsLabel_ar : settings.homepage.productsLabel_en;

  // Product categories (same as catalog) — not Heritage / Desert Luxe names
  const cards = useMemo(
    () => buildCatalogCards(settings.categories, products).slice(0, 4),
    [settings.categories, products],
  );

  return (
    <section className="py-20 md:py-28 bg-cream dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream">{title}</h2>
          <p className="mt-3 text-charcoal/60 dark:text-cream/60 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {cards.map((card, i) => {
            const name = isAr ? card.name_ar : card.name_en;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/collections/${card.id}`}
                  className="group relative block aspect-[16/10] overflow-hidden rounded-2xl"
                >
                  <AppImage
                    src={card.image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-0 start-0 end-0 p-6 md:p-8">
                    <h3 className="font-display text-2xl md:text-3xl text-white group-hover:text-gold transition-colors">
                      {name}
                    </h3>
                    <span className="inline-block mt-3 text-gold text-sm font-medium">
                      {card.count} {productsLabel} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections"
            className="inline-flex px-6 py-3 rounded-full bg-gold text-navy font-semibold hover:opacity-90"
          >
            {isAr ? 'عرض كل المنتجات' : 'View all products'}
          </Link>
        </div>
      </div>
    </section>
  );
}
