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

export interface SiteSettings {
  hero: {
    image: string;
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    cta_en: string;
    cta_ar: string;
  };
  theme: {
    navy: string;
    gold: string;
    beige: string;
  };
  announcement: {
    enabled: boolean;
    text_en: string;
    text_ar: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
}