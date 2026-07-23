const MOYASAR_API = 'https://api.moyasar.com/v1';

export function getPublishableKey(): string {
  return (process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ?? '').trim();
}

export function getSecretKey(): string {
  return (process.env.MOYASAR_SECRET_KEY ?? '').trim();
}

export function isPaymentConfigured(): boolean {
  const pk = getPublishableKey();
  const sk = getSecretKey();
  return Boolean(pk && sk && (pk.startsWith('pk_') || pk.startsWith('pk_test_') || pk.startsWith('pk_live_')));
}

export function toHalalas(amountSar: number): number {
  return Math.round(amountSar * 100);
}

/**
 * Moyasar form methods.
 * Always include creditcard for Mada/Visa/MC so the pay form is never empty.
 * Apple Pay / STC Pay are optional extras when selected.
 */
export function moyasarMethods(method: string): string[] {
  switch (method) {
    case 'apple':
      // Apple Pay alone is empty on non-Safari — keep card as fallback
      return ['applepay', 'creditcard'];
    case 'stc':
      return ['stcpay', 'creditcard'];
    case 'mada':
    case 'tabby':
    default:
      return ['creditcard'];
  }
}

export interface MoyasarPayment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export async function fetchMoyasarPayment(paymentId: string): Promise<MoyasarPayment> {
  const secret = getSecretKey();
  if (!secret) throw new Error('Payment gateway not configured');

  const res = await fetch(`${MOYASAR_API}/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secret}:`).toString('base64')}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to verify payment');
  }

  return res.json() as Promise<MoyasarPayment>;
}
