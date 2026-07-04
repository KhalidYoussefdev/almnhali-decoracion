import type { Product } from '@/data/products';

export type RoomType = 'living' | 'bedroom' | 'outdoor' | 'kitchen';
export type SurfaceType = 'wall' | 'floor' | 'ceiling';

export interface PlacementConfig {
  surface: SurfaceType;
  defaultScale: number;
  perspectiveSkew: number;
  hint_en: string;
  hint_ar: string;
}

const ROOM_LABELS: Record<RoomType, { en: string; ar: string }> = {
  living: { en: 'Living Room', ar: 'غرفة المعيشة' },
  bedroom: { en: 'Bedroom', ar: 'غرفة النوم' },
  outdoor: { en: 'Outdoor', ar: 'خارجي' },
  kitchen: { en: 'Kitchen', ar: 'المطبخ' },
};

export function getRoomLabel(room: RoomType, locale: 'en' | 'ar'): string {
  return ROOM_LABELS[room][locale];
}

export function getPlacementConfig(category: string, room: RoomType): PlacementConfig {
  const cat = category.toLowerCase();

  if (cat.includes('outdoor') || room === 'outdoor') {
    return {
      surface: 'wall',
      defaultScale: 0.85,
      perspectiveSkew: 6,
      hint_en: 'Align with an exterior wall or patio backdrop for a realistic facade preview.',
      hint_ar: 'محاذاة الجدار الخارجي أو الواجهة للحصول على معاينة واقعية.',
    };
  }

  if (cat.includes('timber') || cat.includes('tube')) {
    return {
      surface: 'ceiling',
      defaultScale: 0.7,
      perspectiveSkew: -12,
      hint_en: 'Point at the ceiling or upper wall — timber accents work best overhead.',
      hint_ar: 'وجّه الكاميرا نحو السقف أو الجدار العلوي — ألواح الخشب تناسب المناطق العليا.',
    };
  }

  if (cat.includes('floor') || cat.includes('spc')) {
    return {
      surface: 'floor',
      defaultScale: 1.1,
      perspectiveSkew: 58,
      hint_en: 'Point at the floor and tap to preview how the surface will look underfoot.',
      hint_ar: 'وجّه الكاميرا نحو الأرض واضغط لمعاينة شكل السطح.',
    };
  }

  if (room === 'kitchen') {
    return {
      surface: 'wall',
      defaultScale: 0.75,
      perspectiveSkew: 8,
      hint_en: 'Kitchen backsplashes and accent walls — tap a flat wall behind counters.',
      hint_ar: 'مناسب لجدران المطبخ والإكسسوارات — اضغط على جدار مسطح خلف الأسطح.',
    };
  }

  return {
    surface: 'wall',
    defaultScale: 0.8,
    perspectiveSkew: 10,
    hint_en: 'Point at a flat wall, then tap to place the panel in your room.',
    hint_ar: 'وجّه الكاميرا نحو جدار مسطح، ثم اضغط لوضع اللوح في غرفتك.',
  };
}

export function getSmartTip(product: Product, room: RoomType, locale: 'en' | 'ar'): string {
  const config = getPlacementConfig(product.category, room);
  const roomName = getRoomLabel(room, locale);
  const name = locale === 'ar' ? product.name_ar : product.name_en;

  if (locale === 'ar') {
    if (product.collection === 'desert-luxe') {
      return `نصيحة ذكية: ${name} يتماشى مع أسلوب ${roomName} الصحراوي الفاخر. ${config.hint_ar}`;
    }
    if (product.badge || product.badge_ar) {
      return `منتج مميز لـ${roomName}. ${config.hint_ar}`;
    }
    return `معاينة ${name} في ${roomName}. ${config.hint_ar}`;
  }

  if (product.collection === 'desert-luxe') {
    return `Smart tip: ${name} complements a Desert Luxe ${roomName}. ${config.hint_en}`;
  }
  if (product.badge) {
    return `Popular pick for ${roomName}. ${config.hint_en}`;
  }
  return `Preview ${name} in your ${roomName}. ${config.hint_en}`;
}

export function supportsAR(product: Product): boolean {
  return Array.isArray(product.images) && product.images.length > 0 && product.inStock !== false;
}