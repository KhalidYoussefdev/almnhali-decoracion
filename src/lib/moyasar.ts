const MOYASAR_API = 'https://api.moyasar.com/v1';

export function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ?? '';
}

export function getSecretKey(): string {
  return process.env.MOYASAR_SECRET_KEY ?? '';
}

export function isPaymentConfigured(): boolean {
  return Boolean(getPublishableKey() && getSecretKey());
}

export function toHalalas(amountSar: number): number {
  return Math.round(amountSar * 100);
}

/** Map UI payment choice to Moyasar form methods (live account). */
export function moyasarMethods(method: string): string[] {
  switch (method) {
    case 'apple':
      return ['applepay'];
    case 'stc':
      return ['stcpay'];
    case 'mada':
      // Moyasar creditcard form accepts Mada + Visa/MC when enabled in dashboard
      return ['creditcard'];
    case 'tabby':
      return ['creditcard'];
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