import { promises as fs } from 'fs';
import path from 'path';
import type { Product, SiteSettings } from '@/types/product';
import { SEED_PRODUCTS, DEFAULT_SETTINGS } from '@/data/seed';
import { deepMerge } from '@/lib/merge';

/**
 * Persist outside the app folder so Hostinger redeploys do not wipe admin edits.
 * Override with DATA_DIR if needed.
 */
function resolveDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  return path.join(process.cwd(), '..', 'almnhali-data');
}

const DATA_DIR = resolveDataDir();
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

/** Keep admin fields (especially price) when the same product id exists in seed. */
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
      // Admin-controlled fields always win
      price: existing.price,
      name_en: existing.name_en,
      name_ar: existing.name_ar,
      desc_en: existing.desc_en,
      desc_ar: existing.desc_ar,
      inStock: existing.inStock,
      badge: existing.badge,
      badge_ar: existing.badge_ar,
      images: existing.images?.length ? existing.images : seedProduct.images,
    };
  });

  // Keep products created in admin that are not in the seed catalog
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

  // Write merged file if first boot or catalog version changed (adds new seed items, keeps prices)
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
