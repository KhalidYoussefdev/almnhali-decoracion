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
import { JsonLd } from '@/components/seo/JsonLd';
import { getSettings } from '@/lib/data-store';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { buildBaseMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  return buildBaseMetadata(locale, settings);
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
        <AuthProvider>
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
        <LocaleHtmlAttrs locale={locale} />
        <ThemeInjector settings={settings} />
        <Header />
        <main className="min-h-screen pt-16 md:pt-[4.5rem]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <AIAssistant />
        </AuthProvider>
      </SettingsProvider>
    </NextIntlClientProvider>
  );
}