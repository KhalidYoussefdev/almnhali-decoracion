'use client';

import { useEffect, useRef, useState } from 'react';

interface MoyasarCheckoutProps {
  amount: number;
  description: string;
  publishableKey: string;
  callbackUrl: string;
  methods: string[];
  orderId: string;
  language?: 'en' | 'ar';
}

const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';
const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Failed to load Moyasar CSS'));
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (window.Moyasar) resolve();
      else existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Moyasar JS'));
    document.body.appendChild(script);
  });
}

export function MoyasarCheckout({
  amount,
  description,
  publishableKey,
  callbackUrl,
  methods,
  orderId,
  language = 'en',
}: MoyasarCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initedFor = useRef<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const sessionKey = `${orderId}-${amount}-${publishableKey}`;

    async function setup() {
      setStatus('loading');
      setErrorMsg('');

      if (!publishableKey) {
        setStatus('error');
        setErrorMsg(
          language === 'ar'
            ? 'مفتاح الدفع غير موجود. أضفه في Hostinger.'
            : 'Payment key missing. Add NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY on Hostinger.',
        );
        return;
      }

      if (!amount || amount < 100) {
        setStatus('error');
        setErrorMsg(language === 'ar' ? 'مبلغ غير صالح' : 'Invalid payment amount');
        return;
      }

      try {
        await loadStylesheet(MOYASAR_CSS);
        await loadScript(MOYASAR_JS);

        if (cancelled) return;

        // Wait a tick for the div to be in the DOM
        await new Promise((r) => requestAnimationFrame(() => r(null)));

        const el = containerRef.current;
        if (!el) {
          setStatus('error');
          setErrorMsg(language === 'ar' ? 'تعذر عرض نموذج الدفع' : 'Payment container not found');
          return;
        }

        if (!window.Moyasar) {
          setStatus('error');
          setErrorMsg(
            language === 'ar'
              ? 'مكتبة Moyasar لم تُحمَّل'
              : 'Moyasar library did not load. Disable ad blockers and try again.',
          );
          return;
        }

        // Avoid double-init for same order (React Strict Mode)
        if (initedFor.current === sessionKey && el.childElementCount > 0) {
          setStatus('ready');
          return;
        }

        el.innerHTML = '';
        initedFor.current = sessionKey;

        window.Moyasar.init({
          // Pass the element node (more reliable than CSS selectors)
          element: el,
          amount,
          currency: 'SAR',
          description,
          publishable_api_key: publishableKey,
          callback_url: callbackUrl.includes('order_id=')
            ? callbackUrl
            : `${callbackUrl}${callbackUrl.includes('?') ? '&' : '?'}order_id=${encodeURIComponent(orderId)}`,
          methods: methods?.length ? methods : ['creditcard'],
          supported_networks: ['mada', 'visa', 'mastercard'],
          language,
          metadata: { order_id: orderId },
          on_completed: async (payment) => {
            try {
              await fetch('/api/checkout/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payment, metadata: { order_id: orderId } }),
              });
            } catch {
              /* callback still redirects */
            }
          },
        });

        if (!cancelled) {
          setStatus('ready');
          // Scroll form into view on mobile
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(e instanceof Error ? e.message : 'Payment form failed');
        }
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [amount, callbackUrl, description, language, methods, orderId, publishableKey]);

  return (
    <div className="space-y-4">
      {status === 'loading' && (
        <p className="text-sm text-center text-charcoal/60 dark:text-cream/60 py-8">
          {language === 'ar' ? 'جاري تحميل نموذج الدفع الآمن…' : 'Loading secure payment form…'}
        </p>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {errorMsg}
          <p className="mt-2 text-xs opacity-80">
            {language === 'ar'
              ? 'تأكد من مفاتيح Moyasar live في Hostinger وأن الموقع almnhali.com مسموح في لوحة Moyasar.'
              : 'Confirm Moyasar live keys on Hostinger and that almnhali.com is allowed in the Moyasar dashboard.'}
          </p>
        </div>
      )}

      {/* Always white background so Moyasar fields are visible */}
      <div className="rounded-xl bg-white p-4 sm:p-6 border border-beige-dark/40 shadow-sm">
        <div
          ref={containerRef}
          className="mysr-form moyasar-form"
          style={{ minHeight: status === 'ready' ? 280 : 120 }}
        />
      </div>
    </div>
  );
}
