'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { CreditCard, Smartphone, Wallet, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MoyasarCheckout } from '@/components/checkout/MoyasarCheckout';
import type { PaymentMethod, ShippingInfo } from '@/types/order';

const paymentMethods: { id: PaymentMethod; icon: typeof CreditCard; labelKey: string }[] = [
  { id: 'mada', icon: CreditCard, labelKey: 'mada' },
  { id: 'apple', icon: Smartphone, labelKey: 'applePay' },
  { id: 'stc', icon: Wallet, labelKey: 'stcPay' },
  { id: 'tabby', icon: CreditCard, labelKey: 'tabby' },
];

const SAUDI_CITIES = ['Dammam', 'Khobar', 'Dhahran', 'Riyadh', 'Jeddah', 'Makkah', 'Madinah', 'Other Saudi City'];

interface PaymentSession {
  orderId: string;
  amount: number;
  total: number;
  publishableKey: string;
  callbackUrl: string;
  methods: string[];
  description: string;
}

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const { items } = useCartStore();
  const { products, loading } = useProducts();

  const [payment, setPayment] = useState<PaymentMethod>('mada');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: 'Dammam',
    postalCode: '',
  });

  const { subtotal, shippingCost, total } = useMemo(() => {
    const sub = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
    const ship = sub >= 500 ? 0 : 49;
    return { subtotal: sub, shippingCost: ship, total: sub + ship };
  }, [items, products]);

  const setField = (key: keyof ShippingInfo, value: string) => {
    setShipping((s) => ({ ...s, [key]: value }));
  };

  const continueToPayment = async () => {
    setError('');
    setProcessing(true);

    const res = await fetch('/api/checkout/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shipping, paymentMethod: payment, locale }),
    });

    const data = await res.json();
    setProcessing(false);

    if (!res.ok) {
      setError(data.error ?? 'Could not start checkout');
      return;
    }

    setSession({
      orderId: data.orderId,
      amount: data.amount,
      total: data.total,
      publishableKey: data.publishableKey,
      callbackUrl: data.callbackUrl,
      methods: data.methods,
      description: data.description,
    });
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  if (items.length === 0 && !session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-charcoal/60">{locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl text-navy dark:text-cream mb-8"
      >
        {t('title')}
      </motion.h1>

      {!session ? (
        <div className="space-y-8">
          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
            <h2 className="font-display text-xl mb-4">{t('shipping')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                value={shipping.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              />
              <input
                required
                value={shipping.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder={locale === 'ar' ? 'الجوال (+966)' : 'Phone (+966)'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              />
              <input
                required
                value={shipping.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder={locale === 'ar' ? 'العنوان' : 'Street Address'}
                className="sm:col-span-2 px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              />
              <select
                value={shipping.city}
                onChange={(e) => setField('city', e.target.value)}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              >
                {SAUDI_CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
              <input
                value={shipping.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
                placeholder={locale === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              />
            </div>
          </section>

          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
            <h2 className="font-display text-xl mb-4">{t('payment')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(({ id, icon: Icon, labelKey }) => (
                <button
                  key={id}
                  type="button"
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
            {payment === 'tabby' && (
              <p className="mt-3 text-xs text-charcoal/50 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                Tabby requires a separate merchant account at tabby.ai. Use Mada, Apple Pay, or STC Pay for now.
              </p>
            )}
          </section>

          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/60">{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60">{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
              <span>{shippingCost === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatPrice(shippingCost, locale)}</span>
            </div>
            <div className="flex justify-between font-display text-xl pt-2 border-t border-beige-dark/30">
              <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span className="text-gold">{formatPrice(total, locale)}</span>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-terracotta/10 text-terracotta rounded-xl text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            variant="gold"
            size="lg"
            className="w-full"
            isLoading={processing}
            onClick={continueToPayment}
            disabled={payment === 'tabby'}
          >
            {locale === 'ar' ? 'متابعة للدفع' : 'Continue to Payment'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-800 dark:text-green-200">
            {locale === 'ar'
              ? `الإجمالي: ${formatPrice(session.total, locale)} — أكمل الدفع أدناه`
              : `Total: ${formatPrice(session.total, locale)} — Complete payment below`}
          </div>
          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
            <MoyasarCheckout
              key={`${session.orderId}-${payment}`}
              amount={session.amount}
              description={session.description}
              publishableKey={session.publishableKey}
              callbackUrl={session.callbackUrl}
              methods={session.methods}
              orderId={session.orderId}
            />
          </section>
          <button
            type="button"
            onClick={() => setSession(null)}
            className="text-sm text-charcoal/60 hover:text-navy underline"
          >
            {locale === 'ar' ? '← العودة لتعديل الطلب' : '← Back to edit order'}
          </button>
        </div>
      )}
    </div>
  );
}