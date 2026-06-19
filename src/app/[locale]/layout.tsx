import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { LocaleHtmlAttrs } from '@/components/layout/LocaleHtmlAttrs';
import { ThemeInjector } from '@/components/layout/ThemeInjector';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { getSettings } from '@/lib/data-store';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlAttrs locale={locale} />
      <ThemeInjector settings={settings} />
      <AnnouncementBar settings={settings} locale={locale} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <AIAssistant />
    </NextIntlClientProvider>
  );
}