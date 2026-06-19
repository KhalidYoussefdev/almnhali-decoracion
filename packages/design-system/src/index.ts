export * from './tokens';
export * from './typography';

export const brand = {
  name: 'Almnhali Decoración',
  nameAr: 'المنهالي للديكور',
  tagline: {
    en: 'Elevating Saudi Homes with Timeless Elegance',
    ar: 'نرتقي بمنازل السعودية بأناقة خالدة',
  },
  location: 'Riyadh, Saudi Arabia',
  currency: 'SAR',
  currencySymbol: 'ر.س',
  phone: '+966 11 XXX XXXX',
  email: 'hello@almnhali.com',
  social: {
    instagram: 'https://instagram.com/almnhali',
    twitter: 'https://twitter.com/almnhali',
    pinterest: 'https://pinterest.com/almnhali',
  },
} as const;