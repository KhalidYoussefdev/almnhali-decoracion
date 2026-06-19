'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { brand } from '@almnhali/design-system';
import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-navy text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo theme="dark" />
            <p className="mt-4 text-cream/70 max-w-md leading-relaxed">
              {brand.tagline.en}
            </p>
            <div className="flex gap-4 mt-6">
              <a href={brand.social.instagram} className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gold" />
              </a>
              <a href={brand.social.twitter} className="p-2 rounded-full border border-gold/30 hover:bg-gold/10 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gold" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">Shop</h4>
            <ul className="space-y-2 text-cream/70">
              <li><Link href="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
              <li><Link href="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
              <li><Link href="/inspiration" className="hover:text-gold transition-colors">Inspiration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">{t('newsletter')}</h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-4 py-2 rounded-lg bg-navy-600 border border-navy-400 text-cream placeholder:text-cream/40 focus:border-gold outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-gold text-navy font-semibold rounded-lg hover:opacity-90 transition-opacity">
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-600 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/50">
          <p>{t('rights')}</p>
          <p>{brand.location}</p>
        </div>
      </div>
    </footer>
  );
}