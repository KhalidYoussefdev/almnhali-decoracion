export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  price: number;
  category: string;
  category_ar: string;
  collection: string;
  images: string[];
  badge?: string;
  badge_ar?: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  materials: string[];
  arModelUrl?: string;
  inStock: boolean;
  tags: string[];
}

export const categories = [
  { id: 'flooring', name_en: 'SPC Flooring', name_ar: 'أرضيات SPC', count: 24 },
  { id: 'wall-panels', name_en: 'Wall Panels', name_ar: 'ألواح الجدران', count: 18 },
  { id: 'wood-alternative', name_en: 'Wood Alternative', name_ar: 'بديل الخشب', count: 32 },
  { id: 'stone-alternative', name_en: 'Stone Alternative', name_ar: 'بديل الحجر', count: 15 },
  { id: 'soundproofing', name_en: 'Soundproofing', name_ar: 'عوازل الصوت', count: 12 },
  { id: 'baseboards', name_en: 'Baseboards', name_ar: 'نعلات', count: 20 },
  { id: 'lighting', name_en: 'Lighting', name_ar: 'إضاءة', count: 28 },
  { id: 'textiles', name_en: 'Textiles', name_ar: 'منسوجات', count: 16 },
];

export const products: Product[] = [
  {
    id: 'spc-oak-heritage',
    name_en: 'Heritage Oak SPC Flooring',
    name_ar: 'أرضيات SPC بلوط التراث',
    desc_en: 'Waterproof SPC flooring with authentic oak grain texture. Perfect for Saudi climate — heat and humidity resistant.',
    desc_ar: 'أرضيات SPC مقاومة للماء بملمس حبيبات البلوط الأصيل. مثالية للمناخ السعودي — مقاومة للحرارة والرطوبة.',
    price: 189,
    category: 'flooring',
    category_ar: 'أرضيات SPC',
    collection: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    badge: 'Bestseller',
    badge_ar: 'الأكثر مبيعاً',
    rating: 4.9,
    reviewCount: 127,
    colors: ['#C4A882', '#8B7355'],
    materials: ['SPC', 'UV Coating'],
    arModelUrl: '/models/spc-oak.glb',
    inStock: true,
    tags: ['waterproof', 'durable', 'saudi-climate'],
  },
  {
    id: 'wpc-wall-sand',
    name_en: 'Desert Sand WPC Wall Panel',
    name_ar: 'لوح جدار WPC رمل الصحراء',
    desc_en: 'Premium WPC interior wall panel in warm desert sand tone. Easy installation with hidden clip system.',
    desc_ar: 'لوح جدار داخلي WPC فاخر بلون رمل الصحراء الدافئ. تركيب سهل بنظام مشابك مخفية.',
    price: 145,
    category: 'wall-panels',
    category_ar: 'ألواح الجدران',
    collection: 'desert-luxe',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=800&q=80',
    ],
    badge: 'New',
    badge_ar: 'جديد',
    rating: 4.8,
    reviewCount: 43,
    colors: ['#D4BC8E', '#C5A46E'],
    materials: ['WPC', 'Aluminum Clips'],
    arModelUrl: '/models/wpc-panel.glb',
    inStock: true,
    tags: ['interior', 'easy-install'],
  },
  {
    id: 'stone-marble-white',
    name_en: 'Carrara Marble Alternative Panel',
    name_ar: 'لوح بديل رخام كارارا',
    desc_en: 'Lightweight stone alternative panel mimicking Italian Carrara marble. Ideal for accent walls and feature areas.',
    desc_ar: 'لوح بديل حجر خفيف الوزن يحاكي رخام كارارا الإيطالي. مثالي للجدران المميزة ومناطق التركيز.',
    price: 220,
    category: 'stone-alternative',
    category_ar: 'بديل الحجر',
    collection: 'marble-elegance',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    rating: 4.7,
    reviewCount: 89,
    colors: ['#F5F5F0', '#E8E4DF'],
    materials: ['PU Stone', 'Fiberglass'],
    arModelUrl: '/models/marble-panel.glb',
    inStock: true,
    tags: ['accent-wall', 'lightweight'],
  },
  {
    id: 'wood-exterior-charcoal',
    name_en: 'Charcoal Exterior Wood Alternative',
    name_ar: 'بديل خشب خارجي فحمي',
    desc_en: 'Weather-resistant exterior cladding with deep charcoal finish. UV-stable for Saudi sun exposure.',
    desc_ar: 'كسوة خارجية مقاومة للطقس بلمسة نهائية فحمية عميقة. مستقرة للأشعة فوق البنفسجية لشمس السعودية.',
    price: 175,
    category: 'wood-alternative',
    category_ar: 'بديل الخشب',
    collection: 'exterior-pro',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa8a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ],
    rating: 4.6,
    reviewCount: 56,
    colors: ['#2C2C2C', '#1A1A1A'],
    materials: ['WPC', 'UV Stabilizer'],
    inStock: true,
    tags: ['exterior', 'weather-resistant'],
  },
  {
    id: 'acoustic-panel-navy',
    name_en: 'Navy Acoustic Wall Panel',
    name_ar: 'لوح عازل صوتي كحلي',
    desc_en: 'Premium soundproofing panel in deep navy. Reduces noise by up to 35dB while adding sophisticated texture.',
    desc_ar: 'لوح عازل صوتي فاخر باللون الكحلي العميق. يقلل الضوضاء حتى ٣٥ ديسيبل مع إضافة ملمس أنيق.',
    price: 98,
    category: 'soundproofing',
    category_ar: 'عوازل الصوت',
    collection: 'quiet-luxury',
    images: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
    ],
    badge: 'Popular',
    badge_ar: 'رائج',
    rating: 4.8,
    reviewCount: 72,
    colors: ['#0A2540'],
    materials: ['PET Felt', 'Acoustic Foam'],
    inStock: true,
    tags: ['soundproof', 'interior'],
  },
  {
    id: 'baseboard-gold-trim',
    name_en: 'Gold Trim Baseboard Profile',
    name_ar: 'نعلة بإطار ذهبي',
    desc_en: 'Elegant 10cm baseboard with gold accent trim. Moisture-resistant for Saudi homes.',
    desc_ar: 'نعلة أنيقة ١٠ سم بإطار ذهبي مميز. مقاومة للرطوبة للمنازل السعودية.',
    price: 45,
    category: 'baseboards',
    category_ar: 'نعلات',
    collection: 'gold-accent',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
    ],
    rating: 4.5,
    reviewCount: 34,
    colors: ['#FFFFFF', '#C5A46E'],
    materials: ['PVC', 'Gold Foil'],
    inStock: true,
    tags: ['trim', 'moisture-resistant'],
  },
  {
    id: 'lamp-aura-gold',
    name_en: 'Aura Gold Table Lamp',
    name_ar: 'مصباح أورا الذهبي',
    desc_en: 'Sculptural ceramic base with gold leaf accents and natural linen shade. Warm ambient lighting.',
    desc_ar: 'قاعدة خزفية منحوتة بلمسات ورق الذهب مع غطاء كتان طبيعي. إضاءة محيطية دافئة.',
    price: 890,
    category: 'lighting',
    category_ar: 'إضاءة',
    collection: 'aura',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    ],
    badge: 'Limited',
    badge_ar: 'محدود',
    rating: 5.0,
    reviewCount: 18,
    colors: ['#C5A46E', '#F5F0E8'],
    materials: ['Ceramic', 'Linen', 'Gold Leaf'],
    arModelUrl: '/models/aura-lamp.glb',
    inStock: true,
    tags: ['ambient', 'handcrafted'],
  },
  {
    id: 'cushion-linen-set',
    name_en: 'Heritage Linen Cushion Set',
    name_ar: 'مجموعة وسائد كتان التراث',
    desc_en: 'Set of four pure European linen cushions in Oat, Clay, Navy, and Gold. 60×60cm.',
    desc_ar: 'مجموعة من أربع وسائد كتان أوروبي نقي بألوان الشوفان والطين والكحلي والذهبي. ٦٠×٦٠ سم.',
    price: 520,
    category: 'textiles',
    category_ar: 'منسوجات',
    collection: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    ],
    rating: 4.9,
    reviewCount: 61,
    colors: ['#EDE6DA', '#C4785A', '#0A2540', '#C5A46E'],
    materials: ['European Linen'],
    inStock: true,
    tags: ['textile', 'set'],
  },
];

export const collections = [
  {
    id: 'heritage',
    name_en: 'Heritage Collection',
    name_ar: 'مجموعة التراث',
    desc_en: 'Timeless designs inspired by Saudi architectural heritage, reimagined for modern living.',
    desc_ar: 'تصاميم خالدة مستوحاة من التراث المعماري السعودي، معاد تصورها للحياة العصرية.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    productCount: 12,
  },
  {
    id: 'desert-luxe',
    name_en: 'Desert Luxe',
    name_ar: 'فخامة الصحراء',
    desc_en: 'Warm earth tones and natural textures celebrating the beauty of the Arabian landscape.',
    desc_ar: 'درجات ألوان ترابية دافئة وملمس طبيعي يحتفي بجمال المناظر العربية.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=1200&q=80',
    productCount: 8,
  },
  {
    id: 'marble-elegance',
    name_en: 'Marble Elegance',
    name_ar: 'أناقة الرخام',
    desc_en: 'Sophisticated stone alternatives that bring Italian luxury to Saudi interiors.',
    desc_ar: 'بدائل حجرية راقية تجلب الفخامة الإيطالية للديكورات السعودية.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    productCount: 6,
  },
  {
    id: 'quiet-luxury',
    name_en: 'Quiet Luxury',
    name_ar: 'الفخامة الهادئة',
    desc_en: 'Understated elegance through acoustic solutions and refined textures.',
    desc_ar: 'أناقة راقية من خلال حلول عزل صوتي وملمس مكرر.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
    productCount: 5,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCollection(collectionId: string): Product[] {
  return products.filter((p) => p.collection === collectionId);
}

export function getRecommendations(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  return products
    .filter((p) => p.id !== productId && (p.collection === product.collection || p.category === product.category))
    .slice(0, limit);
}