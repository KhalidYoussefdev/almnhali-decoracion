'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Script from 'next/script';

interface MoyasarCheckoutProps {
  amount: number;
  description: string;
  publishableKey: string;
  callbackUrl: string;
  methods: string[];
  orderId: string;
}

export function MoyasarCheckout({
  amount,
  description,
  publishableKey,
  callbackUrl,
  methods,
  orderId,
}: MoyasarCheckoutProps) {
  const reactId = useId();
  const elementId = `mysrform${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const initAttempt = useRef(0);

  const initForm = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!window.Moyasar) {
      setStatus('loading');
      return;
    }
    if (!publishableKey) {
      setStatus('error');
      setErrorMsg('Missing Moyasar publishable key');
      return;
    }

    const el = document.getElementById(elementId);
    if (!el) {
      // DOM not ready yet — retry shortly
      if (initAttempt.current < 20) {
        initAttempt.current += 1;
        window.setTimeout(initForm, 100);
      }
      return;
    }

    try {
      el.innerHTML = '';
      window.Moyasar.init({
        element: `#${elementId}`,
        amount,
        currency: 'SAR',
        description,
        publishable_api_key: publishableKey,
        callback_url: `${callbackUrl}?order_id=${encodeURIComponent(orderId)}`,
        methods: methods.length ? methods : ['creditcard'],
        supported_networks: ['mada', 'visa', 'mastercard'],
        metadata: { order_id: orderId },
        on_completed: async (payment) => {
          try {
            await fetch('/api/checkout/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payment, metadata: { order_id: orderId } }),
            });
          } catch {
            // redirect still happens via callback_url
          }
        },
      });
      setStatus('ready');

      // If form stays empty (wrong key / network), surface error
      window.setTimeout(() => {
        const node = document.getElementById(elementId);
        if (node && node.childElementCount === 0) {
          setStatus('error');
          setErrorMsg(
            'Payment form could not load. Check Moyasar live keys in Hostinger and that Mada/card is enabled in your Moyasar dashboard.',
          );
        }
      }, 2500);
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Failed to start payment form');
    }
  }, [amount, callbackUrl, description, elementId, methods, orderId, publishableKey]);

  useEffect(() => {
    initAttempt.current = 0;
    setStatus('loading');
    setErrorMsg('');
    const t = window.setTimeout(initForm, 50);
    return () => window.clearTimeout(t);
  }, [initForm]);

  return (
    <div className="space-y-4">
      <Script
        src="https://cdn.moyasar.com/mpf/1.14.0/moyasar.js"
        strategy="afterInteractive"
        onLoad={initForm}
        onError={() => {
          setStatus('error');
          setErrorMsg('Could not load Moyasar payment script. Check your network.');
        }}
      />
      {/* CSS for Moyasar Payment Form */}
      <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.14.0/moyasar.css" />

      {status === 'loading' && (
        <p className="text-sm text-charcoal/60 dark:text-cream/60 text-center py-6">
          Loading secure payment form…
        </p>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-terracotta/10 text-terracotta text-sm">
          {errorMsg || 'Payment form failed to load.'}
        </div>
      )}

      <div
        id={elementId}
        className="moyasar-form min-h-[200px]"
        data-order={orderId}
      />
    </div>
  );
}
