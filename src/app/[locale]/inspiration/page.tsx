import { redirect } from 'next/navigation';

/** Inspiration page removed — redirect to catalog */
export default async function InspirationRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(locale === 'ar' ? '/ar/catalog' : '/catalog');
}
