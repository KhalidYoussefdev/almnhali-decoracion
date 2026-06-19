'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const icons = [Truck, Shield, RotateCcw, Headphones];
const keys = ['delivery', 'quality', 'returns', 'support'] as const;

export function TrustSignals() {
  const t = useTranslations('trust');

  return (
    <section className="py-16 bg-beige dark:bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white dark:bg-navy-700 shadow-md mb-4">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <p className="font-medium text-navy dark:text-cream text-sm md:text-base">
                  {t(key)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}