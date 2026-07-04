export interface AIAction {
  type: 'link' | 'whatsapp' | 'phone' | 'email';
  href?: string;
  label: string;
  value?: string;
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
  flooring: {
    slug: 'flooring',
    en: ['floor', 'flooring', 'spc', 'tile'],
    ar: ['أرض', 'أرضيات', 'ارضيات', 'بلاط'],
  },
  'wall-panels': {
    slug: 'wall-panels',
    en: ['wall', 'panel', 'wpc', 'slat'],
    ar: ['جدار', 'جدران', 'لوح', 'ألواح', 'لوحه'],
  },
  chipboard: {
    slug: 'chipboard',
    en: ['chipboard', 'veneer', 'wood panel'],
    ar: ['شيبورد', 'الشيبورد', 'بديل الشيبورد'],
  },
  'outdoor-panels': {
    slug: 'outdoor-panels',
    en: ['outdoor', 'fence', 'exterior', 'garden'],
    ar: ['خارجي', 'خارجية', 'سياج', 'حديقة'],
  },
  'interior-wood': {
    slug: 'interior-wood',
    en: ['interior wood', 'wood alternative'],
    ar: ['خشب', 'بديل الخشب'],
  },
};

function matchesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

function detectCategory(text: string): string | null {
  for (const config of Object.values(CATEGORY_KEYWORDS)) {
    if (matchesAny(text, config.en) || matchesAny(text, config.ar)) {
      return config.slug;
    }
  }
  return null;
}

export function getAIResponse(
  input: string,
  locale: 'en' | 'ar',
  contact: AIContactInfo,
): AIResponse {
  const text = input.trim().toLowerCase();
  const isAr = locale === 'ar';
  const location = isAr ? contact.location_ar : contact.location_en;

  const shopAction: AIAction = {
    type: 'link',
    href: '/shop',
    label: isAr ? 'تصفح المتجر' : 'Browse Shop',
  };

  if (
    matchesAny(text, ['contact', 'call', 'phone', 'whatsapp', 'email', 'location', 'address', 'where']) ||
    matchesAny(text, ['تواصل', 'اتصال', 'هاتف', 'واتس', 'واتساب', 'بريد', 'موقع', 'عنوان', 'الدمام', 'فروع'])
  ) {
    return {
      message: isAr
        ? `يسعدنا تواصلك معنا من ${location}.\n\n📞 الهاتف: ${contact.phone}\n💬 واتساب: متاح\n✉️ البريد: ${contact.email}\n\nفريقنا يساعدك في اختيار المنتجات والتوصيل في المنطقة الشرقية.`
        : `We'd love to hear from you in ${location}.\n\n📞 Phone: ${contact.phone}\n💬 WhatsApp: available\n✉️ Email: ${contact.email}\n\nOur team can help you choose products and arrange delivery across the Eastern Province.`,
      actions: [
        { type: 'whatsapp', label: isAr ? 'راسلنا على واتساب' : 'Message on WhatsApp', value: contact.whatsapp },
        { type: 'phone', label: isAr ? 'اتصل بنا' : 'Call Us', value: contact.phone },
        { type: 'email', label: isAr ? 'أرسل بريداً' : 'Send Email', value: contact.email },
        shopAction,
      ],
      suggestions: isAr
        ? ['أرني ألواح الجدران', 'ما أفضل أرضيات للدمام؟']
        : ['Show me wall panels', 'Best flooring for Dammam?'],
    };
  }

  if (
    matchesAny(text, ['product', 'shop', 'buy', 'catalog', 'price', 'browse', 'show me', 'find']) ||
    matchesAny(text, ['منتج', 'متجر', 'شراء', 'كتالوج', 'سعر', 'أرني', 'ابحث', 'عرض'])
  ) {
    const category = detectCategory(text);
    const categoryHref = category ? `/shop?category=${category}` : '/shop';
    const categoryLabel = isAr ? 'عرض هذه الفئة' : 'View this category';

    return {
      message: category
        ? isAr
          ? `لدينا أكثر من 195 منتجاً. وجدت اهتمامك بهذه الفئة — اضغط أدناه لتصفح المنتجات المناسبة في الدمام والمنطقة الشرقية.`
          : `We have 195+ products. Based on your interest, tap below to browse the right category for Dammam and the Eastern Province.`
        : isAr
          ? `متجرنا يضم 195 منتجاً: ألواح WPC، أرضيات SPC، بديل الشيبورد، وأكثر. اختر من المتجر أو أخبرني بما تبحث عنه (مثل: ألواح جدران، أرضيات، خارجي).`
          : `Our shop has 195 products: WPC panels, SPC flooring, chipboard veneer, and more. Open the shop or tell me what you need (e.g. wall panels, flooring, outdoor).`,
      actions: [
        { type: 'link', href: categoryHref, label: category ? categoryLabel : shopAction.label },
        { type: 'link', href: '/collections', label: isAr ? 'المجموعات' : 'Collections' },
      ],
      suggestions: isAr
        ? ['بديل الشيبورد', 'ألواح خارجية', 'كيف أتواصل معكم؟']
        : ['Chipboard veneer', 'Outdoor panels', 'How do I contact you?'],
    };
  }

  const category = detectCategory(text);
  if (category) {
    return {
      message: isAr
        ? `اختيار ممتاز! هذه الفئة مناسبة للمنازل في الدمام. تصفح المنتجات وجرّب معاينة الواقع المعزز AR على هاتفك.`
        : `Great choice! This category works well for homes in Dammam. Browse products and try AR preview on your phone.`,
      actions: [
        { type: 'link', href: `/shop?category=${category}`, label: isAr ? 'عرض المنتجات' : 'View Products' },
        shopAction,
      ],
      suggestions: isAr ? ['تواصل مع الفريق', 'أرضيات SPC'] : ['Contact the team', 'SPC flooring'],
    };
  }

  if (
    matchesAny(text, ['ar', 'reality', 'camera', 'room', 'visualize', 'place']) ||
    matchesAny(text, ['واقع', 'معزز', 'كاميرا', 'غرفة', 'معاينة'])
  ) {
    return {
      message: isAr
        ? 'افتح أي منتج واضغط "عرض بالواقع المعزز" لوضعه في غرفتك. متوفر في تطبيق الموبايل والموقع.'
        : 'Open any product and tap "View in AR" to place it in your room. Available on mobile and web.',
      actions: [shopAction],
      suggestions: isAr ? ['ألواح جدران WPC', 'رقم التواصل'] : ['WPC wall panels', 'Contact number'],
    };
  }

  if (
    matchesAny(text, ['deliver', 'shipping', 'dammam', 'khobar', 'eastern']) ||
    matchesAny(text, ['توصيل', 'شحن', 'الدمام', 'الخبر', 'الشرقية'])
  ) {
    return {
      message: isAr
        ? 'نوصّل إلى الدمام والخبر والظهران وجميع مناطق المملكة. التوصيل المحلي 2–5 أيام. شحن مجاني للطلبات فوق 500 ر.س.'
        : 'We deliver to Dammam, Khobar, Dhahran, and all of Saudi Arabia. Local delivery in 2–5 days. Free shipping on orders over 500 SAR.',
      actions: [shopAction, { type: 'whatsapp', label: isAr ? 'اسأل عن التوصيل' : 'Ask about delivery', value: contact.whatsapp }],
    };
  }

  if (matchesAny(text, ['hello', 'hi', 'hey', 'help', 'start']) || matchesAny(text, ['مرحبا', 'مرحباً', 'اهلا', 'أهلا', 'مساعدة', 'ابدأ'])) {
    return {
      message: isAr
        ? 'مرحباً! أنا مساعد المنهالي للديكور. أساعدك في:\n• توجيهك للمنتجات (ألواح، أرضيات، شيبورد...)\n• التواصل مع فريقنا في الدمام\n• معلومات التوصيل والمعاينة AR'
        : "Hello! I'm the Almanhali assistant. I can help you:\n• Find products (panels, flooring, chipboard...)\n• Connect with our Dammam team\n• Delivery info & AR preview",
      actions: [shopAction, { type: 'whatsapp', label: isAr ? 'واتساب' : 'WhatsApp', value: contact.whatsapp }],
      suggestions: isAr
        ? ['أرني المنتجات', 'رقم الهاتف', 'أفضل أرضيات للدمام']
        : ['Show me products', 'Phone number', 'Best flooring for Dammam'],
    };
  }

  return {
    message: isAr
      ? 'يمكنني توجيهك للمنتجات أو مساعدتك في التواصل مع فريقنا في الدمام. جرّب أحد الاقتراحات أدناه.'
      : 'I can guide you to products or help you contact our Dammam team. Try a suggestion below.',
    actions: [shopAction, { type: 'whatsapp', label: isAr ? 'تواصل واتساب' : 'WhatsApp Us', value: contact.whatsapp }],
    suggestions: isAr
      ? ['تصفح المتجر', 'معلومات التواصل', 'ألواح جدران']
      : ['Browse shop', 'Contact info', 'Wall panels'],
  };
}

export function getDefaultSuggestions(locale: 'en' | 'ar'): string[] {
  return locale === 'ar'
    ? ['أرني المنتجات', 'رقم التواصل', 'أفضل أرضيات للدمام']
    : ['Show me products', 'Contact info', 'Best flooring for Dammam'];
}