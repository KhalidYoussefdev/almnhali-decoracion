'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=800&q=80', span: 'col-span-2 row-span-2', title: 'Living Room' },
  { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', span: 'col-span-1', title: 'Bedroom' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', span: 'col-span-1', title: 'Dining' },
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', span: 'col-span-1', title: 'Majlis' },
  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa8a6c3?w=800&q=80', span: 'col-span-2', title: 'Outdoor' },
];

export function BentoGallery() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Inspiration</span>
          <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream mt-2">
            Scrollytelling Gallery
          </h2>
          <p className="mt-3 text-charcoal/60 dark:text-cream/60 max-w-lg">
            Real Saudi homes transformed with Almnhali — scroll through curated mood boards
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300" />
              <div className="absolute bottom-0 start-0 end-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white font-display text-lg">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}