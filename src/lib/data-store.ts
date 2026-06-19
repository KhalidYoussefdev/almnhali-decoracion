import { promises as fs } from 'fs';
import path from 'path';
import type { Product, SiteSettings } from '@/types/product';
import { SEED_PRODUCTS, DEFAULT_SETTINGS } from '@/data/seed';
import { deepMerge } from '@/lib/merge';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
    return SEED_PRODUCTS;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function getSettings(): Promise<SiteSettings> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const stored = JSON.parse(raw) as Partial<SiteSettings>;
    return deepMerge(DEFAULT_SETTINGS, stored);
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function getLocaleMessages(locale: 'en' | 'ar'): Promise<SiteSettings['messages']['en']> {
  const settings = await getSettings();
  return settings.messages[locale];
}