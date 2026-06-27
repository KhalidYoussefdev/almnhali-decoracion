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

  return buildBaseMetadata(locale, settings, '/inspiration', {
    title: isAr
      ? 'إلهام التصميم | المنهالي للديكور — الدمام'
      : 'Design Inspiration | Almanhali Decoration — Dammam',
    description: isAr
      ? 'لوحات إلهام وقصص تصميم داخلي للمنازل السعودية في الدمام والمنطقة الشرقية.'
      : 'Mood boards and interior design inspiration for Saudi homes in Dammam and the Eastern Province.',
  });
}

export default function InspirationLayout({ children }: { children: React.ReactNode }) {
  return children;
}