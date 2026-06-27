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

  return buildBaseMetadata(locale, settings, '/shop', {
    title: isAr
      ? 'متجر الديكور | المنهالي للديكور — الدمام'
      : 'Shop Home Decor | Almanhali Decoration — Dammam',
    description: isAr
      ? 'تسوق ألواح جدران WPC وأرضيات SPC وبديل الشيبورد والمزيد. أكثر من 195 منتج مع توصيل في الدمام والمنطقة الشرقية.'
      : 'Shop WPC wall panels, SPC flooring, chipboard veneer and more. 195+ products with delivery in Dammam and the Eastern Province.',
  });
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}