'use client';

import { use, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Truck, Shield } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { ProductCard } from '@/components/ui/ProductCard';
import { ARViewer } from '@/components/ar/ARViewer';
import { Button } from '@/components/ui/Button';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useProduct, useProducts } from '@/hooks/useProducts';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);
  const { products } = useProducts();
  const t = useTranslations('shop');
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  const recommendations = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
      .slice(0, 4);
  }, [product, products]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!product) return <div className="p-12 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          {showAR ? (
            <ARViewer modelUrl={product.arModelUrl} productName={getLocalizedField(product, 'name', locale)} />
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-beige">
                <Image src={product.images[selectedImage]} alt={getLocalizedField(product, 'name', locale)} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === i ? 'border-gold' : 'border-transparent'}`}>
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-gold text-sm font-semibold tracking-wider uppercase">{locale === 'ar' ? product.category_ar : product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl text-navy dark:text-cream mt-2">{getLocalizedField(product, 'name', locale)}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-beige-dark'}`} />
                ))}
              </div>
              <span className="text-sm text-charcoal/60">{product.rating} ({product.reviewCount} {t('reviews')})</span>
            </div>
          </div>
          <p className="text-3xl font-semibold text-navy dark:text-cream">{formatPrice(product.price, locale)}</p>
          <p className="text-charcoal/70 dark:text-cream/70 leading-relaxed">{getLocalizedField(product, 'desc', locale)}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="gold" size="lg" onClick={() => addItem(product.id)}><ShoppingBag className="h-5 w-5" />{t('addToCart')}</Button>
            <Button variant="outline" size="lg" onClick={() => toggle(product.id)}><Heart className={`h-5 w-5 ${has(product.id) ? 'fill-terracotta text-terracotta' : ''}`} /></Button>
            {product.arModelUrl && <Button variant="secondary" size="lg" onClick={() => setShowAR(!showAR)}>{t('viewAR')}</Button>}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-beige-dark/30">
            <div className="flex items-center gap-3 text-sm"><Truck className="h-5 w-5 text-gold" /><span>2-5 day delivery in Riyadh</span></div>
            <div className="flex items-center gap-3 text-sm"><Shield className="h-5 w-5 text-gold" /><span>2-year warranty</span></div>
          </div>
        </motion.div>
      </div>

      {recommendations.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl md:text-3xl text-navy dark:text-cream mb-8">{t('completeLook')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}