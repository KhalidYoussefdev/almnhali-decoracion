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

export type LocaleMessages = Record<string, Record<string, string>>;

export interface GalleryItem {
  id: string;
  image: string;
  title_en: string;
  title_ar: string;
  span: string;
}

export interface MoodBoard {
  id: string;
  title_en: string;
  title_ar: string;
  image: string;
  tags_en: string;
  tags_ar: string;
}

export interface CollectionItem {
  id: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  image: string;
  productCount: number;
}

export interface CategoryItem {
  id: string;
  name_en: string;
  name_ar: string;
}

export interface SiteSettings {
  brand: {
    logo: string;
    name_en: string;
    name_ar: string;
    tagline_en: string;
    tagline_ar: string;
    location_en: string;
    location_ar: string;
  };
  seo: {
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    keywords_en: string;
    keywords_ar: string;
    ogImage: string;
  };
  hero: {
    image: string;
    imageAlt_en: string;
    imageAlt_ar: string;
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    cta_en: string;
    cta_ar: string;
    secondaryCta_en: string;
    secondaryCta_ar: string;
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
  social: {
    instagram: string;
    twitter: string;
    snapchat: string;
    pinterest: string;
  };
  footer: {
    shopHeading_en: string;
    shopHeading_ar: string;
    allProducts_en: string;
    allProducts_ar: string;
    collectionsLink_en: string;
    collectionsLink_ar: string;
    inspirationLink_en: string;
    inspirationLink_ar: string;
    emailPlaceholder_en: string;
    emailPlaceholder_ar: string;
  };
  homepage: {
    bestsellersEyebrow_en: string;
    bestsellersEyebrow_ar: string;
    bestsellersTitle_en: string;
    bestsellersTitle_ar: string;
    collectionsTitle_en: string;
    collectionsTitle_ar: string;
    collectionsSubtitle_en: string;
    collectionsSubtitle_ar: string;
    galleryEyebrow_en: string;
    galleryEyebrow_ar: string;
    galleryTitle_en: string;
    galleryTitle_ar: string;
    gallerySubtitle_en: string;
    gallerySubtitle_ar: string;
    productsLabel_en: string;
    productsLabel_ar: string;
  };
  inspiration: {
    heroImage: string;
    heroTitle_en: string;
    heroTitle_ar: string;
    heroSubtitle_en: string;
    heroSubtitle_ar: string;
    moodboardsHeading_en: string;
    moodboardsHeading_ar: string;
    moodboards: MoodBoard[];
  };
  gallery: GalleryItem[];
  collections: CollectionItem[];
  categories: CategoryItem[];
  messages: {
    en: LocaleMessages;
    ar: LocaleMessages;
  };
}