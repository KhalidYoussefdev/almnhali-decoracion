'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Product } from '@/types/product';
import { formatPrice, getLocalizedField, cn } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';

interface ProductCardProps {
  product: Product;
  index?: number;
  /** Smaller card for shop grids */
  compact?: boolean;
}

export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('shop');
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = has(product.id);
  const name = getLocalizedField(product, 'name', locale);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
      className="group relative flex flex-col"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-beige',
          compact ? 'aspect-square' : 'aspect-[4/5] rounded-2xl',
        )}
      >
        <Link href={`/product/${product.id}`} className="absolute inset-0 block">
          <AppImage
            src={product.images[0]}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              compact
                ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            }
          />
        </Link>

        {product.badge && (
          <span
            className={cn(
              'absolute start-2 top-2 bg-gold text-navy font-semibold rounded-full',
              compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-3 py-1 top-4 start-4',
            )}
          >
            {locale === 'ar' ? product.badge_ar ?? product.badge : product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className={cn(
            'absolute end-2 top-2 rounded-full backdrop-blur-md transition-colors',
            compact ? 'p-1.5' : 'p-2.5 top-4 end-4',
            isWishlisted ? 'bg-terracotta text-white' : 'bg-white/90 text-navy hover:bg-white',
          )}
          aria-label="Add to wishlist"
        >
          <Heart className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4', isWishlisted && 'fill-current')} />
        </button>

        {!compact && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold text-navy text-sm font-semibold py-2 hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" />
              {t('addToCart')}
            </button>
          </div>
        )}
      </div>

      <div className={cn('flex flex-col flex-1', compact ? 'mt-2 gap-0.5' : 'mt-3 space-y-1')}>
        {!compact && (
          <p className="text-[10px] text-gold uppercase tracking-wider line-clamp-1">
            {locale === 'ar' ? product.category_ar : product.category}
          </p>
        )}
        <Link href={`/product/${product.id}`}>
          <h3
            className={cn(
              'text-navy dark:text-cream hover:text-gold transition-colors',
              compact
                ? 'text-xs font-semibold line-clamp-2 min-h-[2rem] leading-snug'
                : 'font-display text-lg line-clamp-1',
            )}
          >
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          <p
            className={cn(
              'font-semibold text-navy dark:text-cream',
              compact ? 'text-sm' : 'text-base',
            )}
          >
            {formatPrice(product.price, locale)}
          </p>
          {compact ? (
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="p-1.5 rounded-lg bg-gold/20 text-navy hover:bg-gold transition-colors"
              aria-label={t('addToCart')}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-sm text-charcoal/60">
              <span className="text-gold">★</span>
              {product.rating}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
