import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LocaleHtmlAttrs } from '@/components/layout/LocaleHtmlAttrs';
import { ThemeInjector } from '@/components/layout/ThemeInjector';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { getSettings } from '@/lib/data-store';
import { SettingsProvider } from '@/contexts/SettingsContext';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const isAr = locale === 'ar';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://almnhali.com';

  return {
    title: isAr ? settings.seo.title_ar : settings.seo.title_en,
    description: isAr ? settings.seo.description_ar : settings.seo.description_en,
    keywords: (isAr ? settings.seo.keywords_ar : settings.seo.keywords_en).split(',').map((k) => k.trim()),
    openGraph: {
      title: isAr ? settings.seo.title_ar : settings.seo.title_en,
      description: isAr ? settings.seo.description_ar : settings.seo.description_en,
      images: [{ url: settings.seo.ogImage.startsWith('http') ? settings.seo.ogImage : `${siteUrl}${settings.seo.ogImage}` }],
      locale: isAr ? 'ar_SA' : 'en_SA',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ar')) notFound();

  const settings = await getSettings();
  const messages = settings.messages[locale as 'en' | 'ar'];

  return (
    <NextIntlClientProvider messages={messages}>
      <SettingsProvider settings={settings}>
        <LocaleHtmlAttrs locale={locale} />
        <ThemeInjector settings={settings} />
        <AnnouncementBar settings={settings} locale={locale} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <AIAssistant />
      </SettingsProvider>
    </NextIntlClientProvider>
  );
}