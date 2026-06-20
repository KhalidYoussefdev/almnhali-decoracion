import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createHash } from 'crypto';

const require = createRequire(import.meta.url);
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = 'C:\\Users\\kyle7\\Desktop\\Desc\\Website Mnhali\\Products';
const OUT_DIR = path.join(ROOT, 'public', 'uploads', 'products');
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');

const CATALOGS = [
  {
    match: /spc/i,
    slug: 'spc-flooring',
    category: 'flooring',
    category_en: 'SPC Flooring',
    category_ar: 'أرضيات SPC',
    collection: 'heritage',
    name_en: 'SPC Flooring',
    name_ar: 'أرضيات SPC',
    price: 189,
  },
  {
    match: /WPC WALL PANEL/i,
    slug: 'wpc-wall-panel',
    category: 'wall-panels',
    category_en: 'WPC Wall Panels',
    category_ar: 'ألواح جدران WPC',
    collection: 'desert-luxe',
    name_en: 'WPC Wall Panel',
    name_ar: 'لوح جدار WPC',
    price: 145,
  },
  {
    match: /الخشب الداخلي|interior.*wood/i,
    slug: 'interior-wood',
    category: 'wood-alternative',
    category_en: 'Interior Wood Alternative',
    category_ar: 'بديل الخشب الداخلي',
    collection: 'heritage',
    name_en: 'Interior Wood Panel',
    name_ar: 'بديل الخشب الداخلي',
    price: 165,
  },
  {
    match: /نعلات|fiber|baseboard/i,
    slug: 'fiber-baseboards',
    category: 'baseboards',
    category_en: 'Fiber Baseboards',
    category_ar: 'نعلات فايبر',
    collection: 'marble-elegance',
    name_en: 'Fiber Baseboard',
    name_ar: 'نعلة فايبر',
    price: 85,
  },
  {
    match: /عوازل|sound/i,
    slug: 'soundproofing',
    category: 'soundproofing',
    category_en: 'Soundproofing',
    category_ar: 'عوازل الصوت',
    collection: 'quiet-luxury',
    name_en: 'Soundproof Panel',
    name_ar: 'عازل صوت',
    price: 120,
  },
  {
    match: /Chipboard|شيبورد.*5|木饰面/i,
    slug: 'chipboard',
    category: 'chipboard',
    category_en: 'Chipboard Veneer',
    category_ar: 'بديل الشيبورد',
    collection: 'heritage',
    name_en: 'Chipboard Panel',
    name_ar: 'بديل الشيبورد',
    price: 110,
  },
  {
    match: /الحجر|stone/i,
    slug: 'stone-alternative',
    category: 'stone-alternative',
    category_en: 'Stone Alternative',
    category_ar: 'بديل الحجر',
    collection: 'marble-elegance',
    name_en: 'Stone Alternative Panel',
    name_ar: 'بديل الحجر',
    price: 175,
  },
  {
    match: /بارتشن|partition/i,
    slug: 'partition-columns',
    category: 'partition-columns',
    category_en: 'Partition Columns',
    category_ar: 'أعمدة بارتشن',
    collection: 'desert-luxe',
    name_en: 'Partition Column',
    name_ar: 'عمود بارتشن',
    price: 220,
  },
  {
    match: /الخشب الخارجي|OUTDOOR WPC|outdoor/i,
    slug: 'outdoor-wpc',
    category: 'outdoor-panels',
    category_en: 'Outdoor WPC Panels',
    category_ar: 'بديل الخشب الخارجي',
    collection: 'desert-luxe',
    name_en: 'Outdoor WPC Panel',
    name_ar: 'لوح WPC خارجي',
    price: 195,
  },
  {
    match: /timber tube/i,
    slug: 'wpc-timber-tube',
    category: 'timber-tubes',
    category_en: 'WPC Timber Tubes',
    category_ar: 'أنابيب خشب WPC',
    collection: 'desert-luxe',
    name_en: 'WPC Timber Tube',
    name_ar: 'أنبوب خشب WPC',
    price: 155,
  },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function matchCatalog(filename) {
  for (const catalog of CATALOGS) {
    if (catalog.match.test(filename)) return catalog;
  }
  return {
    slug: slugify(path.basename(filename, '.pdf')),
    category: 'decor',
    category_en: 'Decoration',
    category_ar: 'ديكور',
    collection: 'heritage',
    name_en: 'Decoration Product',
    name_ar: 'منتج ديكور',
    price: 150,
  };
}

async function extractImagesFromPdf(pdfPath, catalog) {
  const buffer = fs.readFileSync(pdfPath);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), disableFontFace: true, useSystemFonts: true }).promise;
  const images = [];
  const seen = new Set();

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      if (fn !== pdfjs.OPS?.paintImageXObject && fn !== pdfjs.OPS?.paintInlineImageXObject) continue;

      const imgName = ops.argsArray[i][0];
      const key = `${pageNum}:${imgName}`;
      if (seen.has(key)) continue;
      seen.add(key);

      try {
        const img = await page.objs.get(imgName);
        if (!img?.data || !img.width || !img.height) continue;
        if (img.width < 120 || img.height < 120) continue;

        const hash = createHash('md5').update(img.data).digest('hex').slice(0, 8);
        if (seen.has(hash)) continue;
        seen.add(hash);

        images.push({ img, pageNum, hash });
      } catch {
        // skip unreadable image objects
      }
    }
  }

  return images;
}

function saveRgbaPng(img, outPath) {
  const { PNG } = require('pngjs');
  const png = new PNG({ width: img.width, height: img.height });
  png.data = Buffer.from(img.data);
  fs.writeFileSync(outPath, PNG.sync.write(png));
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('Source folder not found:', SOURCE_DIR);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(PRODUCTS_FILE), { recursive: true });

  const pdfs = fs.readdirSync(SOURCE_DIR).filter((f) => f.toLowerCase().endsWith('.pdf'));
  const products = [];
  let productIndex = 0;

  for (const pdfName of pdfs) {
    const catalog = matchCatalog(pdfName);
    const pdfPath = path.join(SOURCE_DIR, pdfName);
    console.log(`Processing: ${pdfName} -> ${catalog.category_en}`);

    const images = await extractImagesFromPdf(pdfPath, catalog);
    const catDir = path.join(OUT_DIR, catalog.slug);
    fs.mkdirSync(catDir, { recursive: true });

    let imgIndex = 0;
    for (const { img, hash } of images) {
      imgIndex++;
      const filename = `${catalog.slug}-${String(imgIndex).padStart(3, '0')}-${hash}.png`;
      const outPath = path.join(catDir, filename);
      saveRgbaPng(img, outPath);

      productIndex++;
      const id = `${catalog.slug}-${String(imgIndex).padStart(3, '0')}`;
      products.push({
        id,
        name_en: `${catalog.name_en} — Design ${imgIndex}`,
        name_ar: `${catalog.name_ar} — تصميم ${imgIndex}`,
        desc_en: `Premium ${catalog.category_en.toLowerCase()} from Almanhali Decoration catalog.`,
        desc_ar: `${catalog.category_ar} فاخر من كتالوج المنهالي للديكور.`,
        price: catalog.price,
        category: catalog.category,
        category_ar: catalog.category_ar,
        collection: catalog.collection,
        images: [`/api/uploads/products/${catalog.slug}/${filename}`],
        rating: 4.8,
        reviewCount: 0,
        colors: [],
        materials: [catalog.category_en],
        inStock: true,
        tags: [catalog.slug],
      });
    }

    console.log(`  Extracted ${imgIndex} product images`);
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  console.log(`\nDone: ${products.length} products written to ${PRODUCTS_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});