import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getOrders } from '@/lib/orders';
import { getProducts } from '@/lib/data-store';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [orders, products] = await Promise.all([getOrders(), getProducts()]);

  const enriched = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        name: product?.name_en ?? item.productId,
        price: product?.price ?? 0,
        image: product?.images[0] ?? '',
      };
    }),
  }));

  return NextResponse.json(enriched);
}