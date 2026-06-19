'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { BentoGallery } from '@/components/home/BentoGallery';
import { useSiteSettings } from '@/contexts/SettingsContext';

export default function InspirationPage() {
  const locale = useLocale();
  const settings = useSiteSettings();
  const isAr = locale === 'ar';
  const { inspiration } = settings;

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        <AppImage
          src={inspiration.heroImage}
          alt={isAr ? inspiration.heroTitle_ar : inspiration.heroTitle_en}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-hero-overlay flex items-end pb-12">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl text-white"
            >
              {isAr ? inspiration.heroTitle_ar : inspiration.heroTitle_en}
            </motion.h1>
            <p className="mt-2 text-cream/80 text-lg">
              {isAr ? inspiration.heroSubtitle_ar : inspiration.heroSubtitle_en}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-navy dark:text-cream mb-8">
            {isAr ? inspiration.moodboardsHeading_ar : inspiration.moodboardsHeading_en}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inspiration.moodboards.map((board, i) => {
              const title = isAr ? board.title_ar : board.title_en;
              const tags = (isAr ? board.tags_ar : board.tags_en).split(',').map((t) => t.trim()).filter(Boolean);
              return (
                <motion.article
                  key={board.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <AppImage
                    src={board.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h3 className="font-display text-2xl text-white">{title}</h3>
                    {!isAr && <p className="text-cream/60 text-sm mt-1" dir="rtl">{board.title_ar}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gold/20 text-gold rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <BentoGallery />
    </>
  );
}