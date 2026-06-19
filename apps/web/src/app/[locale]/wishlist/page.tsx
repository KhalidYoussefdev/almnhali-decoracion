'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useWishlistStore } from '@/stores/wishlist';
import { getProductById } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const t = useTranslations('account');
  const locale = useLocale();
  const items = useWishlistStore((s) => s.items);
  const products = items.map(getProductById).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-display text-4xl text-navy dark:text-cream mb-8">{t('wishlist')}</h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-charcoal/60">Your wishlist is empty</p>
          <Link href="/shop" className="inline-block mt-6">
            <Button variant="gold">Browse Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => product && (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}