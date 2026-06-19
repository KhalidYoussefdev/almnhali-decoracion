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
  arModelUrl?: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 'spc-oak-heritage',
    name_en: 'Heritage Oak SPC Flooring',
    name_ar: 'أرضيات SPC بلوط التراث',
    desc_en: 'Waterproof SPC flooring with authentic oak grain texture.',
    desc_ar: 'أرضيات SPC مقاومة للماء بملمس حبيبات البلوط الأصيل.',
    price: 189,
    category: 'flooring',
    category_ar: 'أرضيات SPC',
    collection: 'heritage',
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80'],
    badge: 'Bestseller',
    badge_ar: 'الأكثر مبيعاً',
    rating: 4.9,
    reviewCount: 127,
    arModelUrl: '/models/spc-oak.glb',
    inStock: true,
  },
  {
    id: 'wpc-wall-sand',
    name_en: 'Desert Sand WPC Wall Panel',
    name_ar: 'لوح جدار WPC رمل الصحراء',
    desc_en: 'Premium WPC interior wall panel in warm desert sand tone.',
    desc_ar: 'لوح جدار داخلي WPC فاخر بلون رمل الصحراء الدافئ.',
    price: 145,
    category: 'wall-panels',
    category_ar: 'ألواح الجدران',
    collection: 'desert-luxe',
    images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
    badge: 'New',
    badge_ar: 'جديد',
    rating: 4.8,
    reviewCount: 43,
    arModelUrl: '/models/wpc-panel.glb',
    inStock: true,
  },
  {
    id: 'stone-marble-white',
    name_en: 'Carrara Marble Alternative Panel',
    name_ar: 'لوح بديل رخام كارارا',
    desc_en: 'Lightweight stone alternative panel mimicking Italian Carrara marble.',
    desc_ar: 'لوح بديل حجر خفيف الوزن يحاكي رخام كارارا الإيطالي.',
    price: 220,
    category: 'stone-alternative',
    category_ar: 'بديل الحجر',
    collection: 'marble-elegance',
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
    rating: 4.7,
    reviewCount: 89,
    arModelUrl: '/models/marble-panel.glb',
    inStock: true,
  },
  {
    id: 'lamp-aura-gold',
    name_en: 'Aura Gold Table Lamp',
    name_ar: 'مصباح أورا الذهبي',
    desc_en: 'Sculptural ceramic base with gold leaf accents.',
    desc_ar: 'قاعدة خزفية منحوتة بلمسات ورق الذهب.',
    price: 890,
    category: 'lighting',
    category_ar: 'إضاءة',
    collection: 'aura',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    badge: 'Limited',
    badge_ar: 'محدود',
    rating: 5.0,
    reviewCount: 18,
    arModelUrl: '/models/aura-lamp.glb',
    inStock: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRecommendations(productId: string, limit = 3): Product[] {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  return products.filter((p) => p.id !== productId && p.collection === product.collection).slice(0, limit);
}