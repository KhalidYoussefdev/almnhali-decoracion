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
    arTapToPlace: 'Tap anywhere on your room to place the product',
    arCameraPermission: 'Camera access is needed to preview products in your room',
    arGrantCamera: 'Allow Camera',
    arLoading: 'Preparing AR preview...',
    arNotAvailable: 'AR preview is not available for this product',
    arReset: 'Reset',
    arRotate: 'Rotate',
    arZoomIn: 'Bigger',
    arZoomOut: 'Smaller',
    arSaveRoom: 'Save',
    completeLook: 'Complete the Look',
    checkout: 'Checkout',
    wishlist: 'Wishlist',
    savedRooms: 'Saved AR Rooms',
    aiAssistant: 'Design Assistant',
    filters: 'Filters',
    search: 'Search products...',
    freeShipping: 'Free shipping on orders over 500 SAR',
    biometricLogin: 'Sign in with Face ID',
    orderTracking: 'Track Order',
    delivery: 'Saudi-wide Delivery',
    products: 'products',
    quality: 'Premium Quality',
    returns: '30-Day Returns',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    fullName: 'Full name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginSubtitle: 'Welcome back to Almanhali Decoration.',
    registerSubtitle: 'Join Almanhali — shop and save wishlists in Dammam.',
    signingIn: 'Signing in...',
    creating: 'Creating account...',
    noAccount: "Don't have an account? Create one",
    alreadyHaveAccount: 'Already have an account? Sign in',
    guestPrompt: 'Sign in or create an account to save your wishlist.',
    logout: 'Sign Out',
    privacy: 'Privacy Policy',
    error: 'Error',
    welcomeBack: 'Welcome back',
    biometricUnavailable: 'Biometric login not available',
    wishlistEmpty: 'Your wishlist is empty',
    aiPlaceholder: 'Ask about products, contact, or delivery...',
    aiGreeting: "Hello! I'm your Almanhali assistant in Dammam. I can guide you to products or help you contact our team.",
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
    arTapToPlace: 'اضغط على أي مكان في الغرفة لوضع المنتج',
    arCameraPermission: 'يحتاج الوصول للكاميرا لمعاينة المنتجات في غرفتك',
    arGrantCamera: 'السماح بالكاميرا',
    arLoading: 'جاري تحضير المعاينة...',
    arNotAvailable: 'المعاينة بالواقع المعزز غير متاحة لهذا المنتج',
    arReset: 'إعادة',
    arRotate: 'تدوير',
    arZoomIn: 'تكبير',
    arZoomOut: 'تصغير',
    arSaveRoom: 'حفظ',
    completeLook: 'أكمل الإطلالة',
    checkout: 'إتمام الشراء',
    wishlist: 'المفضلة',
    savedRooms: 'الغرف المحفوظة',
    aiAssistant: 'مساعد التصميم',
    aiGreeting: 'مرحباً! أنا مساعد المنهالي في الدمام. أوجّهك للمنتجات أو أساعدك في التواصل مع فريقنا.',
    filters: 'تصفية',
    search: 'ابحث عن منتجات...',
    freeShipping: 'شحن مجاني للطلبات فوق ٥٠٠ ر.س',
    biometricLogin: 'تسجيل الدخول ببصمة الوجه',
    orderTracking: 'تتبع الطلب',
    delivery: 'توصيل لجميع أنحاء السعودية',
    products: 'منتج',
    quality: 'جودة فاخرة',
    returns: 'إرجاع خلال ٣٠ يوم',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    loginSubtitle: 'مرحباً بعودتك إلى المنهالي للديكور.',
    registerSubtitle: 'انضم إلى المنهالي — تسوق واحفظ المفضلة في الدمام.',
    signingIn: 'جاري تسجيل الدخول...',
    creating: 'جاري إنشاء الحساب...',
    noAccount: 'ليس لديك حساب؟ أنشئ حساباً',
    alreadyHaveAccount: 'لديك حساب؟ سجّل الدخول',
    guestPrompt: 'سجّل الدخول أو أنشئ حساباً لحفظ المفضلة.',
    logout: 'تسجيل الخروج',
    privacy: 'سياسة الخصوصية',
    error: 'خطأ',
    welcomeBack: 'مرحباً بعودتك',
    biometricUnavailable: 'تسجيل الدخول البيومتري غير متاح',
    wishlistEmpty: 'قائمة المفضلة فارغة',
    aiPlaceholder: 'اسأل عن المنتجات، التواصل، أو التوصيل...',
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