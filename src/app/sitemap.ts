import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/data/products';
import { getSettings } from '@/lib/data-store';
import { localePath } from '@/lib/seo';

const STATIC_PATHS = ['', '/shop', '/catalog', '/collections', '/login', '/register', '/privacy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ['en', 'ar'] as const) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }

    for (const collection of settings.collections) {
      entries.push({
        url: localePath(locale, `/collections/${collection.id}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const category of settings.categories) {
      entries.push({
        url: localePath(locale, `/catalog/${category.id}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }

    for (const product of products) {
      entries.push({
        url: localePath(locale, `/product/${product.id}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}