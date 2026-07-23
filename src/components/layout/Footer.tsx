'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { SnapchatIcon } from '@/components/ui/SnapchatIcon';
import { whatsappUrl } from '@/lib/image';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const settings = useSiteSettings();
  const isAr = locale === 'ar';

  const tagline = isAr ? settings.brand.tagline_ar : settings.brand.tagline_en;
  const location = isAr ? settings.brand.location_ar : settings.brand.location_en;
  const shopHeading = isAr ? settings.footer.shopHeading_ar : settings.footer.shopHeading_en;
  const allProducts = isAr ? settings.footer.allProducts_ar : settings.footer.allProducts_en;
  const collectionsLink = isAr ? settings.footer.collectionsLink_ar : settings.footer.collectionsLink_en;
  const email = settings.contact.email || 'info@almnhali.com';

  return (
    <footer className="bg-navy text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo theme="dark" />
            <p className="mt-4 text-cream/70 max-w-md leading-relaxed">{tagline}</p>

            <div className="mt-6 space-y-2 text-sm text-cream/70">
              {location && (
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>{location}</span>
                </p>
              )}
              {settings.contact.phone && (
                <a href={`tel:${settings.contact.phone}`} className="flex items-center gap-2 hover:text-gold" dir="ltr">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  {settings.contact.phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gold" dir="ltr">
                  <Mail className="h-4 w-4 text-gold shrink-0" />
                  {email}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {settings.contact.whatsapp && (
                <a
                  href={whatsappUrl(settings.contact.whatsapp, isAr ? 'مرحباً' : 'Hello')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors"
                  aria-label="WhatsApp"
                >
                  <Phone className="h-5 w-5 text-gold" />
                </a>
              )}
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-gold" />
                </a>
              )}
              {settings.social.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="h-5 w-5 text-gold" />
                </a>
              )}
              {settings.social.snapchat && (
                <a
                  href={settings.social.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors"
                  aria-label="Snapchat"
                >
                  <SnapchatIcon className="h-5 w-5 text-gold" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">{shopHeading}</h4>
            <ul className="space-y-2 text-cream/70">
              <li>
                <Link href="/catalog" className="hover:text-gold transition-colors">
                  {isAr ? 'تصفح الكتالوج' : 'Browse Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  {allProducts}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold transition-colors">
                  {collectionsLink}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">{isAr ? 'تواصل معنا' : 'Contact'}</h4>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>
                <a href={`mailto:${email}`} className="hover:text-gold break-all" dir="ltr">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.contact.phone}`} className="hover:text-gold" dir="ltr">
                  {settings.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(settings.contact.whatsapp, isAr ? 'مرحباً' : 'Hello')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-600 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/50">
          <p>{t('rights')}</p>
          <p>{location}</p>
        </div>
      </div>
    </footer>
  );
}
