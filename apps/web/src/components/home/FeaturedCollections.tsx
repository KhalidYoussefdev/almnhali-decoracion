'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { collections } from '@/data/products';
import { getLocalizedField } from '@/lib/utils';

export function FeaturedCollections() {
  const locale = useLocale();

  return (
    <section className="py-20 md:py-28 bg-cream dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream">
            Curated Collections
          </h2>
          <p className="mt-3 text-charcoal/60 dark:text-cream/60 max-w-xl mx-auto">
            Discover thoughtfully assembled pieces for every room in your home
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/collections/${collection.id}`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-2xl"
              >
                <Image
                  src={collection.image}
                  alt={getLocalizedField(collection, 'name', locale)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 start-0 end-0 p-6 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl text-white group-hover:text-gold transition-colors">
                    {getLocalizedField(collection, 'name', locale)}
                  </h3>
                  <p className="mt-2 text-cream/70 text-sm md:text-base line-clamp-2">
                    {getLocalizedField(collection, 'desc', locale)}
                  </p>
                  <span className="inline-block mt-3 text-gold text-sm font-medium">
                    {collection.productCount} products →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}