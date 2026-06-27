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

  return buildBaseMetadata(locale, settings, '/collections', {
    title: isAr
      ? 'مجموعات الديكور | المنهالي للديكور — الدمام'
      : 'Decor Collections | Almanhali Decoration — Dammam',
    description: isAr
      ? 'مجموعات ديكور منزلية فاخرة منتقاة للمنازل السعودية في الدمام والمنطقة الشرقية.'
      : 'Curated luxury home decor collections for Saudi homes in Dammam and the Eastern Province.',
  });
}

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}