'use client';

import { useEffect, useId, useRef } from 'react';
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
  const elementId = `mysr-${reactId.replace(/:/g, '')}`;
  const initialized = useRef(false);

  const initForm = () => {
    if (initialized.current || !window.Moyasar) return;
    const el = document.getElementById(elementId);
    if (!el) return;

    initialized.current = true;
    el.innerHTML = '';

    window.Moyasar.init({
      element: `#${elementId}`,
      amount,
      currency: 'SAR',
      description,
      publishable_api_key: publishableKey,
      callback_url: `${callbackUrl}?order_id=${orderId}`,
      methods,
      supported_networks: methods.includes('creditcard') ? ['mada', 'visa', 'mastercard'] : undefined,
      metadata: { order_id: orderId },
      on_completed: async (payment) => {
        await fetch('/api/checkout/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payment, metadata: { order_id: orderId } }),
        });
      },
    });
  };

  useEffect(() => {
    initialized.current = false;
    if (window.Moyasar) initForm();
  }, [amount, description, publishableKey, callbackUrl, methods, orderId, elementId]);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.moyasar.com/moyasar.css" />
      <Script src="https://cdn.moyasar.com/moyasar.js" strategy="afterInteractive" onLoad={initForm} />
      <div id={elementId} />
    </>
  );
}