'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { CreditCard, Smartphone, Wallet, AlertCircle, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MoyasarCheckout } from '@/components/checkout/MoyasarCheckout';
import type { PaymentMethod, ShippingInfo } from '@/types/order';

const paymentMethods: { id: PaymentMethod; icon: typeof CreditCard; labelKey: string }[] = [
  { id: 'mada', icon: CreditCard, labelKey: 'mada' },
  { id: 'apple', icon: Smartphone, labelKey: 'applePay' },
  { id: 'stc', icon: Wallet, labelKey: 'stcPay' },
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
  const isAr = locale === 'ar';
  const { items } = useCartStore();
  const { products, loading } = useProducts();
  const settings = useSiteSettings();

  const [payment, setPayment] = useState<PaymentMethod>('mada');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [gatewayOk, setGatewayOk] = useState<boolean | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: 'Dammam',
    postalCode: '',
  });

  useEffect(() => {
    fetch('/api/checkout/status')
      .then((r) => r.json())
      .then((d) => setGatewayOk(Boolean(d.configured)))
      .catch(() => setGatewayOk(false));
  }, []);

  const { subtotal, shippingCost, total, lineItems } = useMemo(() => {
    const lines: { name: string; qty: number; price: number }[] = [];
    const sub = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        lines.push({
          name: isAr ? product.name_ar : product.name_en,
          qty: item.quantity,
          price: product.price * item.quantity,
        });
      }
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
    const ship = sub >= 500 ? 0 : 49;
    return { subtotal: sub, shippingCost: ship, total: sub + ship, lineItems: lines };
  }, [items, products, isAr]);

  const setField = (key: keyof ShippingInfo, value: string) => {
    setShipping((s) => ({ ...s, [key]: value }));
  };

  const whatsappOrderUrl = () => {
    const phone = settings.contact.whatsapp.replace(/\D/g, '');
    const lines = lineItems.map((l) => `• ${l.name} x${l.qty} = ${l.price} SAR`).join('\n');
    const msg = isAr
      ? `طلب جديد من الموقع\n\nالاسم: ${shipping.fullName}\nالجوال: ${shipping.phone}\nالعنوان: ${shipping.address}\nالمدينة: ${shipping.city}\n\n${lines}\n\nالشحن: ${shippingCost} SAR\nالإجمالي: ${total} SAR`
      : `New website order\n\nName: ${shipping.fullName}\nPhone: ${shipping.phone}\nAddress: ${shipping.address}\nCity: ${shipping.city}\n\n${lines}\n\nShipping: ${shippingCost} SAR\nTotal: ${total} SAR`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const continueToPayment = async () => {
    setError('');

    if (!shipping.fullName.trim() || !shipping.phone.trim() || !shipping.address.trim()) {
      setError(isAr ? 'يرجى تعبئة الاسم والجوال والعنوان' : 'Please fill name, phone, and address');
      return;
    }

    // Online gateway not ready → WhatsApp checkout
    if (gatewayOk === false) {
      window.open(whatsappOrderUrl(), '_blank', 'noopener,noreferrer');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/checkout/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping, paymentMethod: payment, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            (isAr
              ? 'تعذر بدء الدفع. تحقق من إعدادات Moyasar أو اطلب عبر واتساب.'
              : 'Could not start payment. Check Moyasar keys or order via WhatsApp.'),
        );
        setProcessing(false);
        return;
      }
      if (!data.publishableKey) {
        setError(
          isAr
            ? 'مفتاح الدفع غير مضبوط على السيرفر'
            : 'Payment publishable key is missing on the server',
        );
        setProcessing(false);
        return;
      }
      setSession({
        orderId: data.orderId,
        amount: data.amount,
        total: data.total,
        publishableKey: data.publishableKey,
        callbackUrl: data.callbackUrl,
        methods: data.methods?.length ? data.methods : ['creditcard'],
        description: data.description,
      });
    } catch {
      setError(isAr ? 'خطأ في الاتصال. حاول مرة أخرى.' : 'Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-charcoal/60">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  if (items.length === 0 && !session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-charcoal/60">{isAr ? 'سلتك فارغة' : 'Your cart is empty'}</p>
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
                placeholder={isAr ? 'الاسم الكامل *' : 'Full Name *'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
              />
              <input
                required
                value={shipping.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder={isAr ? 'الجوال (+966) *' : 'Phone (+966) *'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
                dir="ltr"
              />
              <input
                required
                value={shipping.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder={isAr ? 'العنوان *' : 'Street Address *'}
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
                placeholder={isAr ? 'الرمز البريدي' : 'Postal Code'}
                className="px-4 py-3 rounded-xl border border-beige-dark/50 bg-beige/30 dark:bg-navy-700 dark:text-cream outline-none focus:border-gold"
                dir="ltr"
              />
            </div>
          </section>

          {gatewayOk !== false && (
            <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
              <h2 className="font-display text-xl mb-4">{t('payment')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              <p className="mt-3 text-xs text-charcoal/50 dark:text-cream/40">
                {isAr
                  ? 'مدى / فيزا / ماستركارد عبر نموذج الدفع الآمن'
                  : 'Mada / Visa / Mastercard via secure payment form'}
              </p>
            </section>
          )}

          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm space-y-2 text-sm">
            <h2 className="font-display text-xl mb-3">{isAr ? 'ملخص الطلب' : 'Order summary'}</h2>
            {lineItems.map((l, i) => (
              <div key={i} className="flex justify-between gap-4 text-charcoal/80 dark:text-cream/80">
                <span className="line-clamp-1">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0">{formatPrice(l.price, locale)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-beige-dark/30">
              <span className="text-charcoal/60">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60">{isAr ? 'الشحن' : 'Shipping'}</span>
              <span>
                {shippingCost === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(shippingCost, locale)}
              </span>
            </div>
            <div className="flex justify-between font-display text-xl pt-2 border-t border-beige-dark/30">
              <span>{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-gold">{formatPrice(total, locale)}</span>
            </div>
          </section>

          {gatewayOk === false && (
            <div className="p-4 rounded-xl bg-gold/15 text-navy dark:text-cream text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
              <span>
                {isAr
                  ? 'الدفع الإلكتروني غير مفعّل بعد. يمكنك إرسال الطلب عبر واتساب وسنؤكد الدفع معك.'
                  : 'Online card payment is not configured yet. You can send the order on WhatsApp and we will confirm payment with you.'}
              </span>
            </div>
          )}

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
          >
            {gatewayOk === false
              ? isAr
                ? 'إرسال الطلب عبر واتساب'
                : 'Send order on WhatsApp'
              : isAr
                ? 'متابعة للدفع'
                : 'Continue to Payment'}
          </Button>

          {gatewayOk !== false && (
            <a
              href={whatsappOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold/40 text-navy dark:text-cream text-sm font-medium hover:bg-gold/10"
            >
              <MessageCircle className="h-4 w-4 text-gold" />
              {isAr ? 'أو اطلب عبر واتساب' : 'Or order via WhatsApp'}
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-800 dark:text-green-200">
            {isAr
              ? `الإجمالي: ${formatPrice(session.total, locale)} — أدخل بيانات البطاقة أدناه للدفع`
              : `Total: ${formatPrice(session.total, locale)} — Enter your card details below to pay`}
          </div>

          <section className="p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-sm">
            <h2 className="font-display text-xl mb-4">
              {isAr ? 'ادفع الآن' : 'Pay now'}
            </h2>
            <MoyasarCheckout
              key={session.orderId}
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
            {isAr ? '← العودة لتعديل الطلب' : '← Back to edit order'}
          </button>
        </div>
      )}
    </div>
  );
}
