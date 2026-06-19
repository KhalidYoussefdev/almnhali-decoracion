'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types/order';

function SuccessContent() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentId = searchParams.get('id');
    const orderId = searchParams.get('order_id');

    if (!paymentId) {
      setStatus('failed');
      setMessage('No payment reference found');
      return;
    }

    const verify = async () => {
      const params = new URLSearchParams({ id: paymentId });
      if (orderId) params.set('order_id', orderId);

      const res = await fetch(`/api/checkout/verify?${params}`);
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setOrder(data.order);
        clearCart();
      } else {
        setStatus('failed');
        setOrder(data.order ?? null);
        setMessage(data.message ?? data.error ?? 'Payment could not be verified');
      }
    };

    verify();
  }, [searchParams, clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 md:py-24 text-center">
      {status === 'loading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="h-16 w-16 text-gold animate-spin mx-auto" />
          <p className="mt-6 text-charcoal/60">{locale === 'ar' ? 'جاري التحقق من الدفع...' : 'Verifying your payment...'}</p>
        </motion.div>
      )}

      {status === 'success' && order && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
          <h1 className="font-display text-3xl text-navy dark:text-cream mt-6">
            {locale === 'ar' ? 'تم الطلب بنجاح!' : 'Order Confirmed!'}
          </h1>
          <p className="mt-3 text-charcoal/60">
            {locale === 'ar' ? 'شكراً لطلبك من المنهالي للديكور' : 'Thank you for shopping with Almnhali Decoración'}
          </p>
          <div className="mt-8 p-6 bg-white dark:bg-navy-800 rounded-2xl text-start space-y-2">
            <p className="text-sm text-charcoal/60">Order ID</p>
            <p className="font-mono text-sm text-navy dark:text-cream">{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-charcoal/60 mt-4">Total paid</p>
            <p className="font-display text-2xl text-gold">{formatPrice(order.total, locale)}</p>
            <p className="text-sm text-charcoal/60 mt-4">{order.shipping.fullName}</p>
            <p className="text-sm text-charcoal/60">{order.shipping.phone}</p>
          </div>
          <Link href="/shop" className="inline-block mt-8">
            <Button variant="gold" size="lg">{locale === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</Button>
          </Link>
        </motion.div>
      )}

      {status === 'failed' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <XCircle className="h-20 w-20 text-terracotta mx-auto" />
          <h1 className="font-display text-3xl text-navy dark:text-cream mt-6">
            {locale === 'ar' ? 'فشل الدفع' : 'Payment Failed'}
          </h1>
          <p className="mt-3 text-charcoal/60">{message}</p>
          <Link href="/checkout" className="inline-block mt-8">
            <Button variant="gold" size="lg">{t('placeOrder')}</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}