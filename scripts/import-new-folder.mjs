import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = 'C:\\Users\\kyle7\\Desktop\\New folder';
const OUT_ROOT = path.join(ROOT, 'public', 'uploads', 'catalog');
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'catalog-products.json');
const META_FILE = path.join(__dirname, 'product-metadata.json');

const FOLDER_MAP = {
  'WPC WALL PANEL': {
    slug: 'wpc-wall-panel',
    category: 'wall-panels',
    category_ar: 'ألواح جدران WPC',
    collection: 'heritage',
    price: 145,
  },
  'OUTDOOR WPC PANEL': {
    slug: 'outdoor-wpc-panel',
    category: 'outdoor-panels',
    category_ar: 'ألواح WPC الخارجية',
    collection: 'desert-luxe',
    price: 195,
  },
  'wpc timber tube1': {
    slug: 'wpc-timber-tube',
    category: 'timber-tubes',
    category_ar: 'أنابيب خشب WPC',
    collection: 'desert-luxe',
    price: 155,
  },
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function sizeSuffix(meta, pxW, pxH) {
  const sizes = meta.sizes?.length ? ` Size: ${meta.sizes.join(', ')}.` : '';
  const px = ` Image: ${pxW}×${pxH}px.`;
  return `${sizes}${px}`;
}

async function main() {
  const metadata = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
  const metaByFile = new Map(metadata.map((m) => [m.file.replace(/\\/g, '/'), m]));

  if (fs.existsSync(path.join(ROOT, 'public', 'uploads', 'products'))) {
    fs.rmSync(path.join(ROOT, 'public', 'uploads', 'products'), { recursive: true, force: true });
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const products = [];

  for (const [folder, cfg] of Object.entries(FOLDER_MAP)) {
    const srcDir = path.join(SOURCE, folder);
    if (!fs.existsSync(srcDir)) continue;
    const outDir = path.join(OUT_ROOT, cfg.slug);
    fs.mkdirSync(outDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => {
      const ai = parseInt(a.match(/_(\d+)\./)?.[1] ?? '0', 10);
      const bi = parseInt(b.match(/_(\d+)\./)?.[1] ?? '0', 10);
      return ai - bi;
    });

    for (const file of files) {
      const relKey = `${folder}/${file}`;
      const meta = metaByFile.get(relKey);
      const src = path.join(srcDir, file);
      const destName = `${cfg.slug}-${slugify(file.replace(/\.[^.]+$/, ''))}.jpg`;
      const dest = path.join(outDir, destName);
      const img = sharp(src);
      const info = await img.jpeg({ quality: 88 }).toFile(dest);

      const id = slugify(`${cfg.slug}-${file.replace(/\.[^.]+$/, '')}`);
      const codes = meta?.codes?.join(', ') ?? '';
      const descEn = `${meta?.desc_en ?? cfg.slug}${sizeSuffix(meta ?? {}, info.width, info.height)}${codes ? ` Codes: ${codes}.` : ''}`;
      const descAr = `${meta?.desc_ar ?? cfg.category_ar}${meta?.sizes?.length ? ` المقاس: ${meta.sizes.join('، ')}.` : ''}${codes ? ` الرموز: ${codes}.` : ''}`;

      products.push({
        id,
        name_en: meta?.name_en ?? `${cfg.slug} ${file}`,
        name_ar: meta?.name_ar ?? cfg.category_ar,
        desc_en: descEn.trim(),
        desc_ar: descAr.trim(),
        price: cfg.price,
        category: cfg.category,
        category_ar: cfg.category_ar,
        collection: cfg.collection,
        images: [`/api/uploads/catalog/${cfg.slug}/${destName}`],
        rating: 4.8,
        reviewCount: 0,
        colors: meta?.colors ?? [],
        materials: [cfg.category_ar],
        inStock: true,
        tags: [cfg.slug, ...(meta?.codes ?? []).map((c) => c.replace(/\s+/g, ''))],
      });
    }
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(products, null, 2));
  console.log(`Imported ${products.length} products to ${CATALOG_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});