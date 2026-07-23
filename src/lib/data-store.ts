import { promises as fs } from 'fs';
import path from 'path';
import type { Product, SiteSettings } from '@/types/product';
import { SEED_PRODUCTS, DEFAULT_SETTINGS } from '@/data/seed';
import { deepMerge } from '@/lib/merge';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const CATALOG_VERSION_FILE = path.join(DATA_DIR, '.catalog-version');
const SETTINGS_VERSION_FILE = path.join(DATA_DIR, '.settings-version');
const CATALOG_VERSION = '5';
const SETTINGS_VERSION = '10';

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function needsCatalogRefresh(): Promise<boolean> {
  try {
    const version = await fs.readFile(CATALOG_VERSION_FILE, 'utf-8');
    return version.trim() !== CATALOG_VERSION;
  } catch {
    return true;
  }
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataDir();
  if (await needsCatalogRefresh()) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
    await fs.writeFile(CATALOG_VERSION_FILE, CATALOG_VERSION);
    return SEED_PRODUCTS;
  }
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
    await fs.writeFile(CATALOG_VERSION_FILE, CATALOG_VERSION);
    return SEED_PRODUCTS;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function getSettings(): Promise<SiteSettings> {
  await ensureDataDir();
  let stored: Partial<SiteSettings> = {};
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    stored = JSON.parse(raw) as Partial<SiteSettings>;
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    await fs.writeFile(SETTINGS_VERSION_FILE, SETTINGS_VERSION);
    return DEFAULT_SETTINGS;
  }

  const merged = deepMerge(DEFAULT_SETTINGS, stored);
  let version = '';
  try {
    version = (await fs.readFile(SETTINGS_VERSION_FILE, 'utf-8')).trim();
  } catch {
    version = '';
  }

  if (version !== SETTINGS_VERSION) {
    merged.brand = { ...merged.brand, ...DEFAULT_SETTINGS.brand };
    merged.seo = { ...merged.seo, ...DEFAULT_SETTINGS.seo };
    merged.hero = { ...merged.hero, ...DEFAULT_SETTINGS.hero };
    merged.contact = DEFAULT_SETTINGS.contact;
    merged.social = DEFAULT_SETTINGS.social;
    merged.categories = DEFAULT_SETTINGS.categories;
    merged.collections = DEFAULT_SETTINGS.collections;
    merged.gallery = DEFAULT_SETTINGS.gallery;
    merged.messages = DEFAULT_SETTINGS.messages;
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2));
    await fs.writeFile(SETTINGS_VERSION_FILE, SETTINGS_VERSION);
  }

  return merged;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function getLocaleMessages(locale: 'en' | 'ar'): Promise<SiteSettings['messages']['en']> {
  const settings = await getSettings();
  return settings.messages[locale];
}