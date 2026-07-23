import { NextResponse } from 'next/server';
import { isPaymentConfigured, getPublishableKey } from '@/lib/moyasar';

export async function GET() {
  const configured = isPaymentConfigured();
  return NextResponse.json({
    configured,
    // only whether a public key exists — never return secret
    hasPublishableKey: Boolean(getPublishableKey()),
  });
}
