import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/orders';

/** Called from Moyasar on_completed before 3DS redirect — saves payment ID on the order */
export async function POST(req: Request) {
  const body = (await req.json()) as {
    id?: string;
    status?: string;
    metadata?: { order_id?: string };
  };

  const paymentId = body.id;
  const orderId = body.metadata?.order_id;

  if (!paymentId || !orderId) {
    return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  order.paymentId = paymentId;
  await saveOrder(order);

  return NextResponse.json({ ok: true });
}