import type { Product, SiteSettings } from '@/types/product';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';
import catalogProducts from './catalog-products.json';

export const SEED_CATEGORIES: SiteSettings['categories'] = [
  { id: 'flooring', name_en: 'SPC Flooring', name_ar: 'أرضيات SPC' },
  { id: 'wall-panels', name_en: 'WPC Wall Panels', name_ar: 'ألواح جدران WPC' },
  { id: 'wood-alternative', name_en: 'Interior Wood Alternative', name_ar: 'بديل الخشب الداخلي' },
  { id: 'outdoor-panels', name_en: 'Outdoor WPC Panels', name_ar: 'بديل الخشب الخارجي' },
  { id: 'stone-alternative', name_en: 'Stone Alternative', name_ar: 'بديل الحجر' },
  { id: 'chipboard', name_en: 'Chipboard Veneer', name_ar: 'بديل الشيبورد' },
  { id: 'soundproofing', name_en: 'Soundproofing', name_ar: 'عوازل الصوت' },
  { id: 'baseboards', name_en: 'Fiber Baseboards', name_ar: 'نعلات فايبر' },
  { id: 'partition-columns', name_en: 'Partition Columns', name_ar: 'أعمدة بارتشن' },
  { id: 'timber-tubes', name_en: 'WPC Timber Tubes', name_ar: 'أنابيب خشب WPC' },
];

export const SEED_COLLECTIONS: SiteSettings['collections'] = [
  {
    id: 'heritage',
    name_en: 'Heritage Collection',
    name_ar: 'مجموعة التراث',
    desc_en: 'Timeless designs inspired by Saudi architectural heritage.',
    desc_ar: 'تصاميم خالدة مستوحاة من التراث المعماري السعودي.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    productCount: 12,
  },
  {
    id: 'desert-luxe',
    name_en: 'Desert Luxe',
    name_ar: 'فخامة الصحراء',
    desc_en: 'Warm earth tones celebrating the Arabian landscape.',
    desc_ar: 'درجات ألوان ترابية دافئة تحتفي بالمناظر العربية.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=1200&q=80',
    productCount: 8,
  },
  {
    id: 'marble-elegance',
    name_en: 'Marble Elegance',
    name_ar: 'أناقة الرخام',
    desc_en: 'Sophisticated stone alternatives for Saudi interiors.',
    desc_ar: 'بدائل حجرية راقية للديكورات السعودية.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    productCount: 6,
  },
  {
    id: 'quiet-luxury',
    name_en: 'Quiet Luxury',
    name_ar: 'الفخامة الهادئة',
    desc_en: 'Understated elegance through acoustic solutions.',
    desc_ar: 'أناقة راقية من خلال حلول عزل صوتي.',
    productCount: 5,
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
  },
];

export const SEED_GALLERY: SiteSettings['gallery'] = [
  { id: 'living', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=800&q=80', span: 'col-span-2 row-span-2', title_en: 'Living Room', title_ar: 'غرفة المعيشة' },
  { id: 'bedroom', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', span: 'col-span-1', title_en: 'Bedroom', title_ar: 'غرفة النوم' },
  { id: 'dining', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', span: 'col-span-1', title_en: 'Dining', title_ar: 'غرفة الطعام' },
  { id: 'majlis', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', span: 'col-span-1', title_en: 'Majlis', title_ar: 'المجلس' },
  { id: 'outdoor', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa8a6c3?w=800&q=80', span: 'col-span-2', title_en: 'Outdoor', title_ar: 'خارجي' },
];

export const SEED_MOODBOARDS: SiteSettings['inspiration']['moodboards'] = [
  { id: 'modern-majlis', title_en: 'Modern Majlis', title_ar: 'مجلس عصري', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c5fb57?w=800&q=80', tags_en: 'Traditional, Gold Accents', tags_ar: 'تقليدي, لمسات ذهبية' },
  { id: 'desert-minimal', title_en: 'Desert Minimalism', title_ar: 'بساطة الصحراء', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', tags_en: 'Earth Tones, Natural', tags_ar: 'ألوان ترابية, طبيعي' },
  { id: 'coastal', title_en: 'Coastal Elegance', title_ar: 'أناقة ساحلية', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', tags_en: 'Light, Airy', tags_ar: 'فاتح, منعش' },
];

export const SEED_PRODUCTS: Product[] = catalogProducts as Product[];

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    logo: '/brand/logo.png',
    name_en: 'Almanhali Decoration',
    name_ar: 'المنهالي للديكور',
    tagline_en: 'Premium decoration solutions for Saudi homes',
    tagline_ar: 'حلول ديكور فاخرة للمنازل السعودية',
    location_en: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
  },
  seo: {
    title_en: 'Almanhali Decoration | Premium Home Decoration — Riyadh',
    title_ar: 'المنهالي للديكور | ديكور منزلي فاخر — الرياض',
    description_en: 'Luxury home decoration and interior design for Saudi Arabia. SPC flooring, wall panels, and curated decor.',
    description_ar: 'ديكور منزلي فاخر وتصميم داخلي للمملكة العربية السعودية. أرضيات SPC وألواح جدران وديكورات منتقاة.',
    keywords_en: 'home decor, Saudi Arabia, Riyadh, interior design, SPC flooring',
    keywords_ar: 'ديكور منزلي, السعودية, الرياض, تصميم داخلي, أرضيات SPC, المنهالي للديكور',
    ogImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85',
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85',
    imageAlt_en: 'Luxury Saudi interior',
    imageAlt_ar: 'ديكور داخلي سعودي فاخر',
    title_en: 'Elevate Your Space',
    title_ar: 'ارتقِ بمساحتك',
    subtitle_en: 'Premium home decoration crafted for Saudi elegance',
    subtitle_ar: 'ديكور منزلي فاخر مصمم للأناقة السعودية',
    cta_en: 'Explore Collections',
    cta_ar: 'استكشف المجموعات',
    secondaryCta_en: 'Virtual Room Tour',
    secondaryCta_ar: 'جولة افتراضية',
  },
  theme: {
    navy: '#0A2540',
    gold: '#C5A46E',
    beige: '#F5F0E8',
  },
  announcement: {
    enabled: false,
    text_en: 'Free shipping on orders over 500 SAR',
    text_ar: 'شحن مجاني للطلبات فوق ٥٠٠ ر.س',
  },
  contact: {
    phone: '+966558466791',
    email: 'hello@almnhali.com',
    whatsapp: '+966558466791',
  },
  social: {
    instagram: 'https://instagram.com/almanhali_decor',
    twitter: 'https://x.com/Almanhali_decor',
    snapchat: 'https://snapchat.com/add/almanhali_decor',
    pinterest: '',
  },
  footer: {
    shopHeading_en: 'Shop',
    shopHeading_ar: 'المتجر',
    allProducts_en: 'All Products',
    allProducts_ar: 'جميع المنتجات',
    collectionsLink_en: 'Collections',
    collectionsLink_ar: 'المجموعات',
    inspirationLink_en: 'Inspiration',
    inspirationLink_ar: 'الإلهام',
    emailPlaceholder_en: 'email@example.com',
    emailPlaceholder_ar: 'بريدك@example.com',
  },
  homepage: {
    bestsellersEyebrow_en: 'Featured',
    bestsellersEyebrow_ar: 'مميز',
    bestsellersTitle_en: 'Bestsellers',
    bestsellersTitle_ar: 'الأكثر مبيعاً',
    collectionsTitle_en: 'Curated Collections',
    collectionsTitle_ar: 'مجموعات منتقاة',
    collectionsSubtitle_en: 'Discover thoughtfully assembled pieces for every room in your home',
    collectionsSubtitle_ar: 'اكتشف قطعاً منتقاة بعناية لكل غرفة في منزلك',
    galleryEyebrow_en: 'Inspiration',
    galleryEyebrow_ar: 'إلهام',
    galleryTitle_en: 'Scrollytelling Gallery',
    galleryTitle_ar: 'معرض بصري',
    gallerySubtitle_en: 'Real Saudi homes transformed with Almanhali — scroll through curated mood boards',
    gallerySubtitle_ar: 'منازل سعودية حقيقية تحولت مع المنهالي — تصفح لوحات الإلهام',
    productsLabel_en: 'products',
    productsLabel_ar: 'منتج',
  },
  inspiration: {
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    heroTitle_en: 'Inspiration',
    heroTitle_ar: 'الإلهام',
    heroSubtitle_en: 'Mood boards & design stories for Saudi homes',
    heroSubtitle_ar: 'لوحات إلهام وقصص تصميم للمنازل السعودية',
    moodboardsHeading_en: 'Mood Boards',
    moodboardsHeading_ar: 'لوحات الإلهام',
    moodboards: SEED_MOODBOARDS,
  },
  gallery: SEED_GALLERY,
  collections: SEED_COLLECTIONS,
  categories: SEED_CATEGORIES,
  messages: {
    en: enMessages as SiteSettings['messages']['en'],
    ar: arMessages as SiteSettings['messages']['ar'],
  },
};