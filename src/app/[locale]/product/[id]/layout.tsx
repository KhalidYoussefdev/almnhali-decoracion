import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProductById } from '@/data/products';
import { getSettings } from '@/lib/data-store';
import { breadcrumbJsonLd, buildBaseMetadata, productJsonLd } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const [product, settings] = await Promise.all([getProductById(id), getSettings()]);
  if (!product) return { title: 'Product Not Found' };

  const isAr = locale === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const description = isAr ? product.desc_ar : product.desc_en;
  const image = product.images[0];

  return buildBaseMetadata(locale, settings, `/product/${id}`, {
    title: `${name} | Almanhali Decoration — Dammam`,
    description: description.slice(0, 160),
    openGraph: {
      images: image ? [{ url: image.startsWith('http') ? image : `https://almnhali.com${image}` }] : undefined,
    },
  });
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const isAr = locale === 'ar';
  const name = isAr ? product.name_ar : product.name_en;

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product, locale),
          breadcrumbJsonLd(locale, [
            { name: isAr ? 'الرئيسية' : 'Home', path: '' },
            { name: isAr ? 'المتجر' : 'Shop', path: '/shop' },
            { name, path: `/product/${id}` },
          ]),
        ]}
      />
      {children}
    </>
  );
}