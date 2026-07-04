export interface AIAction {
  type: 'shop' | 'whatsapp' | 'phone' | 'email' | 'product';
  label: string;
  value?: string;
  category?: string;
}

export interface AIResponse {
  message: string;
  actions?: AIAction[];
  suggestions?: string[];
}

export interface AIContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  location_en: string;
  location_ar: string;
}

const CATEGORY_KEYWORDS: Record<string, { en: string[]; ar: string[]; slug: string }> = {
  flooring: { slug: 'flooring', en: ['floor', 'flooring', 'spc'], ar: ['أرض', 'أرضيات', 'ارضيات'] },
  'wall-panels': { slug: 'wall-panels', en: ['wall', 'panel', 'wpc'], ar: ['جدار', 'جدران', 'لوح', 'ألواح'] },
  chipboard: { slug: 'chipboard', en: ['chipboard', 'veneer'], ar: ['شيبورد', 'الشيبورد'] },
  'outdoor-panels': { slug: 'outdoor-panels', en: ['outdoor', 'fence'], ar: ['خارجي', 'سياج'] },
};

function matchesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

function detectCategory(text: string): string | null {
  for (const config of Object.values(CATEGORY_KEYWORDS)) {
    if (matchesAny(text, config.en) || matchesAny(text, config.ar)) return config.slug;
  }
  return null;
}

export function getAIResponse(input: string, locale: 'en' | 'ar', contact: AIContactInfo): AIResponse {
  const text = input.trim().toLowerCase();
  const isAr = locale === 'ar';
  const location = isAr ? contact.location_ar : contact.location_en;

  if (
    matchesAny(text, ['contact', 'call', 'phone', 'whatsapp', 'email', 'location']) ||
    matchesAny(text, ['تواصل', 'اتصال', 'هاتف', 'واتس', 'واتساب', 'بريد', 'موقع', 'عنوان'])
  ) {
    return {
      message: isAr
        ? `يسعدنا تواصلك من ${location}.\n📞 ${contact.phone}\n✉️ ${contact.email}\n💬 واتساب متاح`
        : `Contact us in ${location}.\n📞 ${contact.phone}\n✉️ ${contact.email}\n💬 WhatsApp available`,
      actions: [
        { type: 'whatsapp', label: isAr ? 'واتساب' : 'WhatsApp', value: contact.whatsapp },
        { type: 'phone', label: isAr ? 'اتصل' : 'Call', value: contact.phone },
        { type: 'shop', label: isAr ? 'المتجر' : 'Shop' },
      ],
      suggestions: isAr ? ['أرني المنتجات', 'ألواح جدران'] : ['Show products', 'Wall panels'],
    };
  }

  if (
    matchesAny(text, ['product', 'shop', 'buy', 'browse', 'show']) ||
    matchesAny(text, ['منتج', 'متجر', 'شراء', 'أرني', 'عرض'])
  ) {
    const category = detectCategory(text);
    return {
      message: isAr
        ? 'لدينا 195+ منتج. افتح المتجر أو اختر فئة من الأزرار أدناه.'
        : 'We have 195+ products. Open the shop or pick a category below.',
      actions: [
        { type: 'shop', label: isAr ? 'المتجر' : 'Shop', category: category ?? undefined },
        ...(category ? [{ type: 'shop' as const, label: isAr ? 'هذه الفئة' : 'This category', category }] : []),
      ],
      suggestions: isAr ? ['تواصل معنا', 'أرضيات SPC'] : ['Contact us', 'SPC flooring'],
    };
  }

  const category = detectCategory(text);
  if (category) {
    return {
      message: isAr ? 'تصفح هذه الفئة وجرّب المعاينة بالواقع المعزز.' : 'Browse this category and try AR preview.',
      actions: [{ type: 'shop', label: isAr ? 'عرض المنتجات' : 'View Products', category }],
    };
  }

  return {
    message: isAr
      ? 'مرحباً! أساعدك في المنتجات والتواصل مع فريقنا في الدمام.'
      : "Hello! I can help with products or contacting our Dammam team.",
    actions: [
      { type: 'shop', label: isAr ? 'المتجر' : 'Shop' },
      { type: 'whatsapp', label: isAr ? 'واتساب' : 'WhatsApp', value: contact.whatsapp },
    ],
    suggestions: isAr ? ['أرني المنتجات', 'رقم الهاتف'] : ['Show products', 'Phone number'],
  };
}

export function getDefaultSuggestions(locale: 'en' | 'ar'): string[] {
  return locale === 'ar'
    ? ['أرني المنتجات', 'رقم التواصل', 'أفضل أرضيات للدمام']
    : ['Show me products', 'Contact info', 'Best flooring for Dammam'];
}