import type { Metadata } from 'next';
import { getSettings } from '@/lib/data-store';
import { buildBaseMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const isAr = locale === 'ar';

  return buildBaseMetadata(locale, settings, '/catalog', {
    title: isAr
      ? 'تصفح الكتالوج | المنهالي للديكور — الدمام'
      : 'Browse Catalog | Almanhali Decoration — Dammam',
    description: isAr
      ? 'كتالوج المنتجات الأكثر مبيعاً — ألواح WPC وأرضيات SPC وبديل الشيبورد في الدمام.'
      : 'Bestseller product catalogue — WPC panels, SPC flooring, chipboard veneer in Dammam.',
  });
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}