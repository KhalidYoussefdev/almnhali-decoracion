'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { Package, Heart, Box, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

const menuItems = [
  { href: '/account/orders', icon: Package, labelKey: 'orders' },
  { href: '/wishlist', icon: Heart, labelKey: 'wishlist' },
  { href: '/account/rooms', icon: Box, labelKey: 'savedRooms' },
  { href: '/account/settings', icon: Settings, labelKey: 'settings' },
] as const;

export default function AccountPage() {
  const t = useTranslations('account');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const { user, hydrated, hydrate, logout, loading } = useAuthStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  if (!hydrated || loading) {
    return <div className="p-12 text-center text-charcoal/60">...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="font-display text-3xl text-navy dark:text-cream">{t('title')}</h1>
        <p className="mt-3 text-charcoal/60 dark:text-cream/60">{tAuth('guestPrompt')}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/login" className="py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90">
            {tAuth('signIn')}
          </Link>
          <Link href="/register" className="py-3 border border-gold/40 text-navy dark:text-cream font-semibold rounded-xl hover:bg-gold/10">
            {tAuth('createAccount')}
          </Link>
        </div>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-navy font-display text-2xl">
            {initial}
          </div>
          <div>
            <h1 className="font-display text-2xl text-navy dark:text-cream">{user.name}</h1>
            <p className="text-charcoal/60 text-sm" dir="ltr">{user.email}</p>
            {user.phone && <p className="text-charcoal/60 text-sm" dir="ltr">{user.phone}</p>}
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map(({ href, icon: Icon, labelKey }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={href}
                className="flex items-center justify-between p-4 bg-white dark:bg-navy-800 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="font-medium text-navy dark:text-cream">{t(labelKey)}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-charcoal/40" />
              </Link>
            </motion.div>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 text-terracotta rounded-xl hover:bg-terracotta/10 transition-colors mt-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}