'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { useCartStore } from '@/stores/cart';
import { useThemeStore } from '@/stores/theme';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());
  const { theme, setTheme } = useThemeStore();

  const navLinks = [
    { href: '/catalog', label: t('catalog') },
    { href: '/shop', label: t('shop') },
    { href: '/collections', label: t('collections') },
    { href: '/inspiration', label: t('inspiration') },
  ];

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' });
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <header className="sticky top-0 z-sticky bg-cream/95 dark:bg-navy-800/95 backdrop-blur-lg border-b border-beige-dark/30 dark:border-navy-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            className="md:hidden p-2 text-navy dark:text-cream"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex-shrink-0">
            <Logo variant="compact" theme="light" className="dark:[&_span]:text-cream" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors hover:text-gold',
                  pathname.startsWith(link.href)
                    ? 'text-gold'
                    : 'text-navy dark:text-cream'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-navy dark:text-cream hover:text-gold transition-colors"
              aria-label={t('search')}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-navy dark:text-cream hover:text-gold transition-colors hidden sm:block"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleLocale}
              className="px-2 py-1 text-xs font-semibold text-navy dark:text-cream border border-gold/40 rounded-md hover:bg-gold/10 transition-colors"
            >
              {locale === 'en' ? 'عربي' : 'EN'}
            </button>

            <Link href="/wishlist" className="p-2 text-navy dark:text-cream hover:text-gold transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
            </Link>

            <Link href="/account" className="p-2 text-navy dark:text-cream hover:text-gold transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </Link>

            <Link href="/cart" className="relative p-2 text-navy dark:text-cream hover:text-gold transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 h-5 w-5 flex items-center justify-center bg-gold text-navy text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-beige-dark/30 dark:border-navy-600/30 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <input
                type="search"
                placeholder={t('search')}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-navy-700 border border-beige-dark/50 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy dark:text-cream"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal bg-navy/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: locale === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute top-0 start-0 h-full w-80 max-w-[85vw] bg-cream dark:bg-navy-800 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Logo variant="compact" />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6 text-navy dark:text-cream" />
                </button>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-navy dark:text-cream hover:text-gold border-b border-beige-dark/30"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 flex gap-4">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="text-navy dark:text-cream">
                  {t('account')}
                </Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-navy dark:text-cream">
                  {t('wishlist')}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}