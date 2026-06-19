import type { SiteSettings } from '@/types/product';

export function AnnouncementBar({ settings, locale }: { settings: SiteSettings; locale: string }) {
  if (!settings.announcement.enabled) return null;
  const text = locale === 'ar' ? settings.announcement.text_ar : settings.announcement.text_en;
  return (
    <div className="bg-gold text-navy text-center text-sm py-2 px-4 font-medium">
      {text}
    </div>
  );
}