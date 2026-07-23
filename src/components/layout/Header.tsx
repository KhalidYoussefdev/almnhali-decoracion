'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { useCartStore } from '@/stores/cart';
import { useThemeStore } from '@/stores/theme';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const settings = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [isDark, setIsDark] = useState(false);
  const announcement = settings.announcement.enabled
    ? locale === 'ar'
      ? settings.announcement.text_ar
      : settings.announcement.text_en
    : null;

  const navLinks = [
    { href: '/catalog', label: t('catalog') },
    { href: '/shop', label: t('shop') },
    { href: '/collections', label: t('collections') },
    { href: '/inspiration', label: t('inspiration') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, [theme]);

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' });
  };

  const onToggleTheme = () => {
    toggleTheme();
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-[100] transition-all duration-300',
        scrolled
          ? 'bg-cream/98 dark:bg-navy-800/98 backdrop-blur-xl shadow-md border-b border-beige-dark/40 dark:border-navy-600/50'
          : 'bg-cream/90 dark:bg-navy-800/90 backdrop-blur-md border-b border-transparent',
      )}
    >
      {announcement && (
        <div className="bg-gold text-navy text-center text-sm py-2 px-4 font-medium">
          {announcement}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
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

          {/* Always-visible main menu on desktop while scrolling */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium tracking-wide transition-colors hover:text-gold py-1',
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? 'text-gold'
                    : 'text-navy dark:text-cream',
                )}
              >
                {link.label}
                {(pathname === link.href || pathname.startsWith(`${link.href}/`)) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-navy dark:text-cream hover:text-gold transition-colors"
              aria-label={t('search')}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 text-navy dark:text-cream hover:text-gold transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
            className="border-t border-beige-dark/30 dark:border-navy-600/30 overflow-hidden bg-cream dark:bg-navy-800"
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
            className="fixed inset-0 z-[110] bg-navy/60 backdrop-blur-sm md:hidden"
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
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block py-3 text-lg font-medium border-b border-beige-dark/30',
                      pathname.startsWith(link.href) ? 'text-gold' : 'text-navy dark:text-cream hover:text-gold',
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="text-navy dark:text-cream">
                  {t('account')}
                </Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-navy dark:text-cream">
                  {t('wishlist')}
                </Link>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gold/40 text-navy dark:text-cream font-medium hover:bg-gold/10"
              >
                {isDark ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-gold" />}
                {isDark
                  ? locale === 'ar'
                    ? 'الوضع الفاتح'
                    : 'Light mode'
                  : locale === 'ar'
                    ? 'الوضع الداكن'
                    : 'Dark mode'}
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
