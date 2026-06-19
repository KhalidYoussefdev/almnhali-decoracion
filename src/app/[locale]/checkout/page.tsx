'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { getProductById } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type PaymentMethod = 'mada' | 'apple' | 'stc' | 'tabby';

const paymentMethods: { id: PaymentMethod; icon: typeof CreditCard; labelKey: string }[] = [
  { id: 'mada', icon: CreditCard, labelKey: 'mada' },
  { id: 'apple', icon: Smartphone, labelKey: 'applePay' },
  { id: 'stc', icon: Wallet, labelKey: 'stcPay' },
  { id: 'tabby', icon: CreditCard, labelKey: 'tabby' },
];

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const { items, clearCart } = useCartStore();
  const [payment, setPayment] = useState<PaymentMethod>('mada');
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const total = subtotal + (subtotal >= 500 ? 0 : 49);

  const placeOrder = async () => {
    setProcessing(true);
    // Production: integrate Moyasar, Tap Payments, or HyperPay
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setProcessing(false);
    alert('Order placed successfully! شكراً لطلبك');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl text-navy dark:text-cream mb-8"
      >
        {t('title')}
      </motion.h1>

      <div className="space-y-8">
        <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
          <h2 className="font-display text-xl mb-4">{t('shipping')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Full Name" className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold" />
            <input placeholder="Phone (+966)" className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold" />
            <input placeholder="Street Address" className="sm:col-span-2 px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold" />
            <select className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold">
              <option>Riyadh</option>
              <option>Jeddah</option>
              <option>Dammam</option>
              <option>Other Saudi City</option>
            </select>
            <input placeholder="Postal Code" className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold" />
          </div>
        </section>

        <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
          <h2 className="font-display text-xl mb-4">{t('payment')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(({ id, icon: Icon, labelKey }) => (
              <button
                key={id}
                onClick={() => setPayment(id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                  payment === id ? 'border-gold bg-gold/10' : 'border-beige-dark/30 hover:border-gold/50'
                }`}
              >
                <Icon className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between p-6 bg-navy text-cream rounded-2xl">
          <span className="font-display text-xl">Total</span>
          <span className="font-display text-2xl text-gold">{formatPrice(total, locale)}</span>
        </div>

        <Button variant="gold" size="lg" className="w-full" isLoading={processing} onClick={placeOrder}>
          {t('placeOrder')}
        </Button>
      </div>
    </div>
  );
}