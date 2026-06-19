import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const i18n = new I18n({
  en: {
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    account: 'Account',
    heroTitle: 'Elevate Your Space',
    heroSubtitle: 'Premium home decoration crafted for Saudi elegance',
    exploreCollections: 'Explore Collections',
    featured: 'Featured',
    bestsellers: 'Bestsellers',
    addToCart: 'Add to Cart',
    viewAR: 'View in AR',
    placeInRoom: 'Place in Room',
    completeLook: 'Complete the Look',
    checkout: 'Checkout',
    wishlist: 'Wishlist',
    savedRooms: 'Saved AR Rooms',
    aiAssistant: 'Design Assistant',
    aiGreeting: "Hello! I'm your Almnhali design assistant. How can I help elevate your space today?",
    filters: 'Filters',
    search: 'Search products...',
    freeShipping: 'Free shipping on orders over 500 SAR',
    biometricLogin: 'Sign in with Face ID',
    orderTracking: 'Track Order',
    delivery: 'Saudi-wide Delivery',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    cart: 'السلة',
    account: 'حسابي',
    heroTitle: 'ارتقِ بمساحتك',
    heroSubtitle: 'ديكور منزلي فاخر مصمم للأناقة السعودية',
    exploreCollections: 'استكشف المجموعات',
    featured: 'مميز',
    bestsellers: 'الأكثر مبيعاً',
    addToCart: 'أضف للسلة',
    viewAR: 'عرض بالواقع المعزز',
    placeInRoom: 'ضع في الغرفة',
    completeLook: 'أكمل الإطلالة',
    checkout: 'إتمام الشراء',
    wishlist: 'المفضلة',
    savedRooms: 'الغرف المحفوظة',
    aiAssistant: 'مساعد التصميم',
    aiGreeting: 'مرحباً! أنا مساعد التصميم في المنهالي. كيف يمكنني مساعدتك في ترتيب مساحتك اليوم؟',
    filters: 'تصفية',
    search: 'ابحث عن منتجات...',
    freeShipping: 'شحن مجاني للطلبات فوق ٥٠٠ ر.س',
    biometricLogin: 'تسجيل الدخول ببصمة الوجه',
    orderTracking: 'تتبع الطلب',
    delivery: 'توصيل لجميع أنحاء السعودية',
  },
});

i18n.locale = Localization.getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en';
i18n.enableFallback = true;

export function setLocale(locale: 'en' | 'ar') {
  i18n.locale = locale;
}

export function getLocale(): 'en' | 'ar' {
  return i18n.locale as 'en' | 'ar';
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export function isRTL(): boolean {
  return i18n.locale === 'ar';
}

export default i18n;