import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/orders';
import { fetchMoyasarPayment, isPaymentConfigured } from '@/lib/moyasar';

export async function GET(req: Request) {
  if (!isPaymentConfigured()) {
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('id');
  const orderId = searchParams.get('order_id');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  try {
    const payment = await fetchMoyasarPayment(paymentId);
    const resolvedOrderId = orderId ?? payment.metadata?.order_id;

    if (!resolvedOrderId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = await getOrderById(resolvedOrderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isPaid = payment.status === 'paid' || payment.status === 'captured';
    const amountMatch = payment.amount === order.amountHalalas;
    const currencyMatch = payment.currency === 'SAR';

    if (isPaid && amountMatch && currencyMatch) {
      order.status = 'paid';
      order.paymentId = payment.id;
      order.paidAt = new Date().toISOString();
      await saveOrder(order);
      return NextResponse.json({ success: true, order, payment: { id: payment.id, status: payment.status } });
    }

    if (!isPaid) {
      order.status = 'failed';
      order.paymentId = payment.id;
      await saveOrder(order);
    }

    return NextResponse.json({
      success: false,
      order,
      payment: { id: payment.id, status: payment.status },
      message: isPaid ? 'Payment amount mismatch' : 'Payment not completed',
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Verification failed' }, { status: 500 });
  }
}