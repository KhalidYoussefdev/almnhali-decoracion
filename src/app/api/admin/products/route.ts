import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProducts, saveProducts } from '@/lib/data-store';
import type { Product } from '@/types/product';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getProducts());
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const product = (await req.json()) as Product;
  const products = await getProducts();
  if (products.some((p) => p.id === product.id)) {
    return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
  }
  products.push(product);
  await saveProducts(products);
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const product = (await req.json()) as Product;
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = product;
  await saveProducts(products);
  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}