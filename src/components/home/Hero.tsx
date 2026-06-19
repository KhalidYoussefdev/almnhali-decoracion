'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Box } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SettingsContext';

export function Hero() {
  const settings = useSiteSettings();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const isAr = locale === 'ar';

  const title = isAr ? settings.hero.title_ar : settings.hero.title_en;
  const subtitle = isAr ? settings.hero.subtitle_ar : settings.hero.subtitle_en;
  const cta = isAr ? settings.hero.cta_ar : settings.hero.cta_en;
  const secondaryCta = isAr ? settings.hero.secondaryCta_ar : settings.hero.secondaryCta_en;
  const imageAlt = isAr ? settings.hero.imageAlt_ar : settings.hero.imageAlt_en;

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={settings.hero.image}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={settings.hero.image.startsWith('/uploads/')}
        />
      </motion.div>
      <div className="absolute inset-0 bg-hero-overlay" />

      <motion.div style={{ opacity }} className="relative h-full flex items-end pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl">
            <div className="h-1 w-16 bg-gold-gradient mb-6 rounded-full" />
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight">{title}</h1>
            <p className="mt-4 text-lg md:text-xl text-cream/90 max-w-lg">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/collections"><Button variant="gold" size="lg">{cta}</Button></Link>
              <Link href="/inspiration?ar=true">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy">
                  <Box className="h-5 w-5" /> {secondaryCta}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}