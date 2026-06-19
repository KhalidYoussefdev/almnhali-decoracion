'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Box } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Product } from '@/types/product';
import { formatPrice, getLocalizedField, cn } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('shop');
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-beige">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.images[0]}
            alt={getLocalizedField(product, 'name', locale)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {product.badge && (
          <span className="absolute top-4 start-4 bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">
            {locale === 'ar' ? product.badge_ar ?? product.badge : product.badge}
          </span>
        )}

        <div className="absolute top-4 end-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggle(product.id)}
            className={cn(
              'p-2.5 rounded-full backdrop-blur-md transition-colors',
              isWishlisted ? 'bg-terracotta text-white' : 'bg-white/90 text-navy hover:bg-white'
            )}
            aria-label="Add to wishlist"
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>
          {product.arModelUrl && (
            <Link
              href={`/product/${product.id}?ar=true`}
              className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white backdrop-blur-md"
              aria-label={t('viewAR')}
            >
              <Box className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="gold"
            size="sm"
            className="w-full"
            onClick={() => addItem(product.id)}
          >
            <ShoppingBag className="h-4 w-4" />
            {t('addToCart')}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-gold uppercase tracking-wider">
          {locale === 'ar' ? product.category_ar : product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-navy dark:text-cream hover:text-gold transition-colors line-clamp-1">
            {getLocalizedField(product, 'name', locale)}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-navy dark:text-cream">{formatPrice(product.price, locale)}</p>
          <div className="flex items-center gap-1 text-sm text-charcoal/60">
            <span className="text-gold">★</span>
            {product.rating}
          </div>
        </div>
      </div>
    </motion.article>
  );
}