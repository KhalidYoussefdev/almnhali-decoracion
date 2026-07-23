'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [isDark, setIsDark] = useState(false);
  const isAr = locale === 'ar';

  const announcement = settings.announcement.enabled
    ? isAr
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
    setMounted(true);
  }, []);

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
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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
    router.replace(pathname, { locale: isAr ? 'en' : 'ar' });
  };

  const closeMenu = () => setMobileOpen(false);

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-[2px]"
              onClick={closeMenu}
            />

            {/* Drawer panel — solid background, full height, not clipped by header */}
            <motion.aside
              initial={{ x: isAr ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '100%' : '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'fixed top-0 bottom-0 z-[210] flex w-[min(20rem,88vw)] flex-col',
                'bg-cream dark:bg-navy-800 shadow-2xl',
                isAr ? 'right-0' : 'left-0',
              )}
            >
              <div className="flex items-center justify-between gap-3 border-b border-beige-dark/40 dark:border-navy-600 px-4 py-4">
                <Logo variant="compact" theme={isDark ? 'dark' : 'light'} />
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-full p-2 text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        'mx-2 my-1 flex items-center rounded-xl px-4 py-3.5 text-base font-semibold transition-colors',
                        active
                          ? 'bg-gold/20 text-navy dark:text-gold'
                          : 'text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mx-4 my-4 h-px bg-beige-dark/50 dark:bg-navy-600" />

                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="mx-2 my-1 flex items-center gap-3 rounded-xl px-4 py-3 text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700"
                >
                  <User className="h-5 w-5 text-gold" />
                  {t('account')}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                  className="mx-2 my-1 flex items-center gap-3 rounded-xl px-4 py-3 text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700"
                >
                  <Heart className="h-5 w-5 text-gold" />
                  {t('wishlist')}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="mx-2 my-1 flex items-center gap-3 rounded-xl px-4 py-3 text-navy dark:text-cream hover:bg-beige dark:hover:bg-navy-700"
                >
                  <ShoppingBag className="h-5 w-5 text-gold" />
                  {t('cart')}
                  {cartCount > 0 && (
                    <span className="ms-auto rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </nav>

              <div className="border-t border-beige-dark/40 dark:border-navy-600 p-4 space-y-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3 font-medium text-navy dark:text-cream hover:bg-gold/10"
                >
                  {isDark ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-gold" />}
                  {isDark
                    ? isAr
                      ? 'الوضع الفاتح'
                      : 'Light mode'
                    : isAr
                      ? 'الوضع الداكن'
                      : 'Dark mode'}
                </button>
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="flex w-full items-center justify-center rounded-xl bg-navy dark:bg-navy-700 py-3 text-sm font-semibold text-cream hover:opacity-90"
                >
                  {isAr ? 'English' : 'العربية'}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
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
              type="button"
              className="md:hidden p-2.5 -ms-1 rounded-xl text-navy dark:text-cream hover:bg-beige/80 dark:hover:bg-navy-700"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" strokeWidth={2.25} />
            </button>

            <Link href="/" className="flex-shrink-0">
              <Logo
                variant="compact"
                theme={isDark ? 'dark' : 'light'}
                className="dark:[&_span]:text-cream"
              />
            </Link>

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
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-navy dark:text-cream hover:text-gold transition-colors"
                aria-label={t('search')}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 text-navy dark:text-cream hover:text-gold transition-colors"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={toggleLocale}
                className="px-2 py-1 text-xs font-semibold text-navy dark:text-cream border border-gold/40 rounded-md hover:bg-gold/10 transition-colors"
              >
                {isAr ? 'EN' : 'عربي'}
              </button>

              <Link
                href="/wishlist"
                className="p-2 text-navy dark:text-cream hover:text-gold transition-colors hidden sm:block"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/account"
                className="p-2 text-navy dark:text-cream hover:text-gold transition-colors hidden sm:block"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-navy dark:text-cream hover:text-gold transition-colors"
              >
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
      </header>

      {mobileMenu}
    </>
  );
}
