import { getProducts } from '@/lib/data-store';
import type { Product } from '@/types/product';

export type { Product } from '@/types/product';
export { categories, collections } from './catalog';

export async function getAllProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.collection === collectionId);
}

export async function getRecommendations(productId: string, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return products.slice(0, limit);
  return products
    .filter((p) => p.id !== productId && (p.collection === product.collection || p.category === product.category))
    .slice(0, limit);
}