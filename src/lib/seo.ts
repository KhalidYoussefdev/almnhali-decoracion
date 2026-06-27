import type { Metadata } from 'next';
import type { Product, SiteSettings } from '@/types/product';
import { routing } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://almnhali.com';

export function localePath(locale: string, pathname = ''): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === routing.defaultLocale) {
    return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  }
  return path === '/' ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${path}`;
}

export function buildAlternates(pathname = ''): Metadata['alternates'] {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return {
    canonical: localePath(routing.defaultLocale, normalized),
    languages: {
      en: localePath('en', normalized),
      ar: localePath('ar', normalized),
      'x-default': localePath(routing.defaultLocale, normalized),
    },
  };
}

export function buildOpenGraph(
  locale: string,
  title: string,
  description: string,
  pathname = '',
  image?: string,
): NonNullable<Metadata['openGraph']> {
  return {
    title,
    description,
    url: localePath(locale, pathname),
    siteName: 'Almanhali Decoration',
    locale: locale === 'ar' ? 'ar_SA' : 'en_SA',
    type: 'website',
    images: image ? [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}` }] : undefined,
  };
}

export function buildBaseMetadata(
  locale: string,
  settings: SiteSettings,
  pathname = '',
  overrides?: Partial<Metadata>,
): Metadata {
  const isAr = locale === 'ar';
  const title = overrides?.title ?? (isAr ? settings.seo.title_ar : settings.seo.title_en);
  const description =
    overrides?.description ?? (isAr ? settings.seo.description_ar : settings.seo.description_en);
  const keywords = (isAr ? settings.seo.keywords_ar : settings.seo.keywords_en)
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  const ogImage = settings.seo.ogImage.startsWith('http')
    ? settings.seo.ogImage
    : `${SITE_URL}${settings.seo.ogImage}`;

  const { openGraph: openGraphOverride, twitter: twitterOverride, ...restOverrides } = overrides ?? {};
  const overrideImages = openGraphOverride?.images;
  const firstOverrideImage = Array.isArray(overrideImages) ? overrideImages[0] : overrideImages;
  const resolvedOgImage =
    (typeof firstOverrideImage === 'object' && firstOverrideImage && 'url' in firstOverrideImage
      ? String(firstOverrideImage.url)
      : undefined) ?? ogImage;

  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(pathname),
    openGraph: {
      ...buildOpenGraph(locale, String(title), String(description), pathname, resolvedOgImage),
      ...openGraphOverride,
    },
    twitter: {
      card: 'summary_large_image',
      title: String(title),
      description: String(description),
      images: [resolvedOgImage],
      ...twitterOverride,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...restOverrides,
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: settings.brand.name_en,
    alternateName: settings.brand.name_ar,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    image: settings.seo.ogImage.startsWith('http')
      ? settings.seo.ogImage
      : `${SITE_URL}${settings.seo.ogImage}`,
    description: settings.seo.description_en,
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dammam',
      addressRegion: 'Eastern Province',
      addressCountry: 'SA',
    },
    areaServed: [
      { '@type': 'City', name: 'Dammam' },
      { '@type': 'City', name: 'Khobar' },
      { '@type': 'City', name: 'Dhahran' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    sameAs: [settings.social.instagram, settings.social.twitter, settings.social.snapchat].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Almanhali Decoration',
    alternateName: 'المنهالي للديكور',
    url: SITE_URL,
    inLanguage: ['en-SA', 'ar-SA'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productJsonLd(product: Product, locale: string) {
  const isAr = locale === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const description = isAr ? product.desc_ar : product.desc_en;
  const image = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `${SITE_URL}${product.images[0]}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.images.map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img}`)),
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Almanhali Decoration',
    },
    offers: {
      '@type': 'Offer',
      url: localePath(locale, `/product/${product.id}`),
      priceCurrency: 'SAR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Almanhali Decoration',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
    },
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: localePath(locale, item.path),
    })),
  };
}