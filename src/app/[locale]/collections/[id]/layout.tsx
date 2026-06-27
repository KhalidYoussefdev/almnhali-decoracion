import type { Metadata } from 'next';
import { getSettings } from '@/lib/data-store';
import { buildBaseMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const settings = await getSettings();
  const collection = settings.collections.find((c) => c.id === id);
  if (!collection) return { title: 'Collection Not Found' };

  const isAr = locale === 'ar';
  const name = isAr ? collection.name_ar : collection.name_en;
  const description = isAr ? collection.desc_ar : collection.desc_en;

  return buildBaseMetadata(locale, settings, `/collections/${id}`, {
    title: `${name} | Almanhali Decoration — Dammam`,
    description,
  });
}

export default function CollectionDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}