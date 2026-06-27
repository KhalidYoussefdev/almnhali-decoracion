import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoArabic = Noto_Naskh_Arabic({ subsets: ['arabic'], variable: '--font-noto-arabic', display: 'swap' });
const ibmArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-arabic', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://almnhali.com'),
  title: 'Almanhali Decoration | Premium Home Decoration — Dammam',
  description:
    'Luxury home decoration and interior design in Dammam and the Eastern Province. WPC wall panels, SPC flooring, and curated decor with delivery across Saudi Arabia.',
  keywords: [
    'home decor',
    'Dammam',
    'Khobar',
    'Eastern Province',
    'Saudi Arabia',
    'interior design',
    'WPC wall panels',
    'SPC flooring',
    'المنهالي للديكور',
    'الدمام',
  ],
  openGraph: {
    title: 'Almanhali Decoration | Premium Home Decoration — Dammam',
    description: 'Elevating Saudi homes in Dammam and the Eastern Province with timeless elegance',
    locale: 'en_SA',
    type: 'website',
    siteName: 'Almanhali Decoration',
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable} ${notoArabic.variable} ${ibmArabic.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}