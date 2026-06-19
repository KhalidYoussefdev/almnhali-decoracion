'use client';

import { AppImage } from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/stores/cart';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const { items, updateQuantity, removeItem } = useCartStore();
  const { products, loading } = useProducts();

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: Product }>;

  const subtotal = cartProducts.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (loading) return <div className="p-12 text-center">Loading cart...</div>;

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-navy dark:text-cream">{t('title')}</h1>
        <p className="mt-4 text-charcoal/60">{t('empty')}</p>
        <Link href="/shop" className="inline-block mt-8"><Button variant="gold">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-display text-4xl text-navy dark:text-cream mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map(({ product, quantity, productId }, i) => (
            <motion.div key={productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4 p-4 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <AppImage src={product.images[0]} alt="" fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-navy dark:text-cream truncate">{getLocalizedField(product, 'name', locale)}</h3>
                <p className="text-gold font-semibold mt-1">{formatPrice(product.price, locale)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(productId, quantity - 1)} className="p-1 rounded-md hover:bg-beige"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button onClick={() => updateQuantity(productId, quantity + 1)} className="p-1 rounded-md hover:bg-beige"><Plus className="h-4 w-4" /></button>
                  <button onClick={() => removeItem(productId)} className="p-1 ms-auto text-terracotta hover:bg-terracotta/10 rounded-md"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-md space-y-4">
            <div className="flex justify-between text-sm"><span>{t('subtotal')}</span><span className="font-medium">{formatPrice(subtotal, locale)}</span></div>
            <div className="flex justify-between text-sm"><span>{t('shipping')}</span><span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping, locale)}</span></div>
            {subtotal < 500 && <p className="text-xs text-gold">{t('freeShipping')}</p>}
            <div className="border-t border-beige-dark/30 pt-4 flex justify-between font-display text-xl"><span>{t('total')}</span><span>{formatPrice(total, locale)}</span></div>
            <Link href="/checkout" className="block"><Button variant="gold" size="lg" className="w-full">{t('checkout')}</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}