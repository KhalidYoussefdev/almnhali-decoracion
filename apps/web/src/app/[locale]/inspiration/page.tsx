'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BentoGallery } from '@/components/home/BentoGallery';

const moodBoards = [
  { title: 'Modern Majlis', titleAr: 'مجلس عصري', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=800&q=80', tags: ['Traditional', 'Gold Accents'] },
  { title: 'Desert Minimalism', titleAr: 'بساطة الصحراء', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', tags: ['Earth Tones', 'Natural'] },
  { title: 'Coastal Elegance', titleAr: 'أناقة ساحلية', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', tags: ['Light', 'Airy'] },
];

export default function InspirationPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
          alt="Inspiration"
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
              Inspiration
            </motion.h1>
            <p className="mt-2 text-cream/80 text-lg">Mood boards & design stories for Saudi homes</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-navy dark:text-cream mb-8">Mood Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moodBoards.map((board, i) => (
              <motion.article
                key={board.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image src={board.image} alt={board.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-display text-2xl text-white">{board.title}</h3>
                  <p className="text-cream/60 text-sm mt-1" dir="rtl">{board.titleAr}</p>
                  <div className="flex gap-2 mt-3">
                    {board.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gold/20 text-gold rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <BentoGallery />
    </>
  );
}