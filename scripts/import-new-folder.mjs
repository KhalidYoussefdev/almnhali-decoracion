import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = 'C:\\Users\\kyle7\\Desktop\\New folder';
const OUT_ROOT = path.join(ROOT, 'public', 'uploads', 'catalog');
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'catalog-products.json');

const FOLDER_RULES = [
  {
    test: (name) => /WPC WALL PANEL/i.test(name),
    slug: 'wpc-wall-panel',
    category: 'wall-panels',
    category_ar: 'ألواح جدران WPC',
    name_en: 'WPC Wall Panel',
    name_ar: 'لوح جداري WPC',
    collection: 'heritage',
    price: 145,
  },
  {
    test: (name) => /OUTDOOR WPC PANEL/i.test(name) || /بديل الخشب الخارجي/i.test(name),
    slug: 'outdoor-wpc-panel',
    category: 'outdoor-panels',
    category_ar: 'ألواح WPC الخارجية',
    name_en: 'Outdoor WPC Panel',
    name_ar: 'لوح WPC خارجي',
    collection: 'desert-luxe',
    price: 195,
  },
  {
    test: (name) => /timber tube/i.test(name),
    slug: 'wpc-timber-tube',
    category: 'timber-tubes',
    category_ar: 'أنابيب خشب WPC',
    name_en: 'WPC Timber Tube',
    name_ar: 'أنبوب خشب WPC',
    collection: 'desert-luxe',
    price: 155,
  },
  {
    test: (name) => /spc/i.test(name) && /ارضيات/i.test(name),
    slug: 'spc-flooring',
    category: 'flooring',
    category_ar: 'أرضيات SPC',
    name_en: 'SPC Flooring',
    name_ar: 'أرضيات SPC',
    collection: 'heritage',
    price: 189,
  },
  {
    test: (name) => /بديل الخشب الداخلي/i.test(name),
    slug: 'interior-wood-panel',
    category: 'interior-wood',
    category_ar: 'بديل الخشب الداخلي',
    name_en: 'Interior Wood Panel',
    name_ar: 'بديل الخشب الداخلي',
    collection: 'heritage',
    price: 165,
  },
  {
    test: (name) => /بديل الحجر/i.test(name),
    slug: 'stone-alternative',
    category: 'stone-alternative',
    category_ar: 'بديل الحجر',
    name_en: 'Stone Alternative Panel',
    name_ar: 'بديل الحجر',
    collection: 'marble-elegance',
    price: 175,
  },
  {
    test: (name) => /Chipboard/i.test(name),
    slug: 'chipboard',
    category: 'chipboard',
    category_ar: 'بديل الشيبورد',
    name_en: 'Chipboard Veneer',
    name_ar: 'بديل الشيبورد',
    collection: 'heritage',
    price: 110,
  },
  {
    test: (name) => /نعلات فايبر/i.test(name),
    slug: 'fiber-baseboards',
    category: 'baseboards',
    category_ar: 'نعلات فايبر',
    name_en: 'Fiber Baseboard',
    name_ar: 'نعلة فايبر',
    collection: 'marble-elegance',
    price: 85,
  },
  {
    test: (name) => /عوازل الصوت/i.test(name),
    slug: 'soundproofing',
    category: 'soundproofing',
    category_ar: 'عوازل الصوت',
    name_en: 'Soundproof Panel',
    name_ar: 'عازل صوت',
    collection: 'quiet-luxury',
    price: 120,
  },
  {
    test: (name) => /بارتشن/i.test(name),
    slug: 'partition-columns',
    category: 'partition-columns',
    category_ar: 'أعمدة بارتشن',
    name_en: 'Partition Column',
    name_ar: 'عمود بارتشن',
    collection: 'desert-luxe',
    price: 220,
  },
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function matchFolder(folderName) {
  for (const rule of FOLDER_RULES) {
    if (rule.test(folderName)) return rule;
  }
  return {
    slug: slugify(folderName),
    category: 'decor',
    category_ar: 'ديكور',
    name_en: 'Decoration Product',
    name_ar: 'منتج ديكور',
    collection: 'heritage',
    price: 150,
  };
}

function pageNumber(file) {
  const m = file.match(/page-(\d+)/i) || file.match(/_(\d+)\./);
  return m ? parseInt(m[1], 10) : 0;
}

function stableId(slug, folderName, file, index) {
  const hash = createHash('md5').update(`${folderName}/${file}`).digest('hex').slice(0, 8);
  const page = pageNumber(file);
  return `${slug}-${String(page || index).padStart(4, '0')}-${hash}`;
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source not found:', SOURCE);
    process.exit(1);
  }

  if (fs.existsSync(OUT_ROOT)) {
    fs.rmSync(OUT_ROOT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const products = [];
  const slugCounters = {};
  const folders = fs.readdirSync(SOURCE, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const dir of folders) {
    const folderName = dir.name;
    const cfg = matchFolder(folderName);
    const srcDir = path.join(SOURCE, folderName);
    const outDir = path.join(OUT_ROOT, cfg.slug);
    fs.mkdirSync(outDir, { recursive: true });
    slugCounters[cfg.slug] = slugCounters[cfg.slug] ?? 0;

    const files = fs
      .readdirSync(srcDir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => pageNumber(a) - pageNumber(b));

    let index = 0;
    for (const file of files) {
      index++;
      slugCounters[cfg.slug] += 1;
      const globalIndex = slugCounters[cfg.slug];
      const page = pageNumber(file) || index;
      const src = path.join(srcDir, file);
      const destName = `${cfg.slug}-${String(globalIndex).padStart(4, '0')}.jpg`;
      const dest = path.join(outDir, destName);

      const info = await sharp(src).jpeg({ quality: 88 }).toFile(dest);
      const id = stableId(cfg.slug, folderName, file, index);

      const badge = index === 1 ? 'New' : undefined;
      const badge_ar = index === 1 ? 'جديد' : undefined;

      products.push({
        id,
        name_en: `${cfg.name_en} ${String(page).padStart(3, '0')}`,
        name_ar: `${cfg.name_ar} ${String(page).padStart(3, '0')}`,
        desc_en: `Premium ${cfg.name_en.toLowerCase()} from Almanhali Decoration. Catalog: ${folderName}. Image ${info.width}×${info.height}px.`,
        desc_ar: `${cfg.category_ar} فاخر من المنهالي للديكور. الكتالوج: ${folderName}.`,
        price: cfg.price,
        category: cfg.category,
        category_ar: cfg.category_ar,
        collection: cfg.collection,
        images: [`/api/uploads/catalog/${cfg.slug}/${destName}`],
        badge,
        badge_ar,
        rating: 4.8,
        reviewCount: 0,
        colors: [],
        materials: [cfg.category_ar],
        inStock: true,
        tags: [cfg.slug, `page-${page}`],
      });
    }

    console.log(`${folderName}: ${files.length} products -> ${cfg.slug}`);
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(products, null, 2));
  console.log(`\nImported ${products.length} products -> ${CATALOG_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});