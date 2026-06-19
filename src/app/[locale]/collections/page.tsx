'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { getLocalizedField } from '@/lib/utils';

export default function CollectionsPage() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const settings = useSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl text-navy dark:text-cream mb-12"
      >
        {t('collections')}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.collections.map((collection, i) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/collections/${collection.id}`} className="group block relative aspect-[3/2] rounded-2xl overflow-hidden">
              <AppImage
                src={collection.image}
                alt={getLocalizedField(collection, 'name', locale)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <h2 className="font-display text-3xl text-white group-hover:text-gold transition-colors">
                  {getLocalizedField(collection, 'name', locale)}
                </h2>
                <p className="mt-2 text-cream/70">{getLocalizedField(collection, 'desc', locale)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}