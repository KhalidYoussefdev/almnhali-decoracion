import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getProducts } from '@/lib/data-store';
import { saveOrder } from '@/lib/orders';
import { getPublishableKey, isPaymentConfigured, toHalalas, moyasarMethods } from '@/lib/moyasar';
import type { Order, PaymentMethod, ShippingInfo } from '@/types/order';
import type { CartItem } from '@/stores/cart';

const SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 500;

interface PrepareBody {
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  locale: string;
}

export async function POST(req: Request) {
  if (!isPaymentConfigured()) {
    return NextResponse.json({ error: 'Payment gateway not configured. Add Moyasar API keys.' }, { status: 503 });
  }

  const body = (await req.json()) as PrepareBody;
  const { items, shipping, paymentMethod, locale } = body;

  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!shipping?.fullName?.trim() || !shipping?.phone?.trim() || !shipping?.address?.trim()) {
    return NextResponse.json({ error: 'Please fill in all required shipping fields' }, { status: 400 });
  }

  if (paymentMethod === 'tabby') {
    return NextResponse.json({
      error: 'Tabby requires a separate merchant account. Contact Tabby at tabby.ai or use Mada/Card/Apple Pay/STC Pay.',
    }, { status: 400 });
  }

  const products = await getProducts();
  let subtotal = 0;
  const orderItems: CartItem[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `${product.name_en} is out of stock` }, { status: 400 });
    }
    subtotal += product.price * item.quantity;
    orderItems.push(item);
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCost;
  const amountHalalas = toHalalas(total);

  if (amountHalalas < 100) {
    return NextResponse.json({ error: 'Order total must be at least 1 SAR' }, { status: 400 });
  }

  const orderId = randomUUID();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const order: Order = {
    id: orderId,
    status: 'pending',
    items: orderItems,
    shipping,
    paymentMethod,
    subtotal,
    shippingCost,
    total,
    amountHalalas,
    locale,
    createdAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return NextResponse.json({
    orderId,
    amount: amountHalalas,
    total,
    publishableKey: getPublishableKey(),
    callbackUrl: `${siteUrl}/${locale}/checkout/success`,
    methods: moyasarMethods(paymentMethod),
    description: `Almnhali Order ${orderId.slice(0, 8)}`,
    metadata: { order_id: orderId },
  });
}