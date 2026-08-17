import { promises as fs } from 'fs';
import path from 'path';
import type { Product, SiteSettings } from '@/types/product';
import { SEED_PRODUCTS, DEFAULT_SETTINGS } from '@/data/seed';
import { deepMerge } from '@/lib/merge';
import { getDataDir } from '@/lib/persist-path';

const DATA_DIR = getDataDir();
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const CATALOG_VERSION_FILE = path.join(DATA_DIR, '.catalog-version');
const SETTINGS_VERSION_FILE = path.join(DATA_DIR, '.settings-version');
const CATALOG_VERSION = '5';
const SETTINGS_VERSION = '11';

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Seed fills missing products; admin edits (price, names, stock, images) always win. */
function mergeCatalog(seed: Product[], stored: Product[] | null): Product[] {
  if (!stored?.length) return seed.map((p) => ({ ...p }));

  const storedById = new Map(stored.map((p) => [p.id, p]));
  const seedIds = new Set(seed.map((p) => p.id));

  const merged = seed.map((seedProduct) => {
    const existing = storedById.get(seedProduct.id);
    if (!existing) return { ...seedProduct };
    return {
      ...seedProduct,
      ...existing,
      id: seedProduct.id,
      price: existing.price,
      name_en: existing.name_en,
      name_ar: existing.name_ar,
      desc_en: existing.desc_en,
      desc_ar: existing.desc_ar,
      inStock: existing.inStock,
      badge: existing.badge,
      badge_ar: existing.badge_ar,
      images: existing.images?.length ? existing.images : seedProduct.images,
      category: existing.category || seedProduct.category,
      category_ar: existing.category_ar || seedProduct.category_ar,
      collection: existing.collection || seedProduct.collection,
    };
  });

  for (const extra of stored) {
    if (!seedIds.has(extra.id)) merged.push(extra);
  }

  return merged;
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataDir();
  const stored = await readJsonFile<Product[]>(PRODUCTS_FILE);
  let version = '';
  try {
    version = (await fs.readFile(CATALOG_VERSION_FILE, 'utf-8')).trim();
  } catch {
    version = '';
  }

  const products = mergeCatalog(SEED_PRODUCTS, stored);

  if (!stored || version !== CATALOG_VERSION) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    await fs.writeFile(CATALOG_VERSION_FILE, CATALOG_VERSION);
  }

  return products;
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function getSettings(): Promise<SiteSettings> {
  await ensureDataDir();
  const stored = (await readJsonFile<Partial<SiteSettings>>(SETTINGS_FILE)) ?? {};

  if (!Object.keys(stored).length) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    await fs.writeFile(SETTINGS_VERSION_FILE, SETTINGS_VERSION);
    return DEFAULT_SETTINGS;
  }

  // Stored admin settings win. Defaults only fill missing keys.
  const merged = deepMerge(DEFAULT_SETTINGS, stored);

  let version = '';
  try {
    version = (await fs.readFile(SETTINGS_VERSION_FILE, 'utf-8')).trim();
  } catch {
    version = '';
  }

  if (version !== SETTINGS_VERSION) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2));
    await fs.writeFile(SETTINGS_VERSION_FILE, SETTINGS_VERSION);
  }

  return merged;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  await fs.writeFile(SETTINGS_VERSION_FILE, SETTINGS_VERSION);
}

export async function getLocaleMessages(locale: 'en' | 'ar'): Promise<SiteSettings['messages']['en']> {
  const settings = await getSettings();
  return settings.messages[locale];
}
