'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useSiteSettings } from '@/contexts/SettingsContext';

export function BentoGallery() {
  const locale = useLocale();
  const settings = useSiteSettings();
  const isAr = locale === 'ar';
  const eyebrow = isAr ? settings.homepage.galleryEyebrow_ar : settings.homepage.galleryEyebrow_en;
  const title = isAr ? settings.homepage.galleryTitle_ar : settings.homepage.galleryTitle_en;
  const subtitle = isAr ? settings.homepage.gallerySubtitle_ar : settings.homepage.gallerySubtitle_en;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">{eyebrow}</span>
          <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream mt-2">{title}</h2>
          <p className="mt-3 text-charcoal/60 dark:text-cream/60 max-w-lg">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {settings.gallery.map((item, i) => {
            const itemTitle = isAr ? item.title_ar : item.title_en;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-2xl group ${item.span}`}
              >
                <AppImage
                  src={item.image}
                  alt={itemTitle}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300" />
                <div className="absolute bottom-0 start-0 end-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white font-display text-lg">{itemTitle}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}