'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Package, Heart, Box, Settings, LogOut, ChevronRight } from 'lucide-react';

const menuItems = [
  { href: '/account/orders', icon: Package, labelKey: 'orders' },
  { href: '/wishlist', icon: Heart, labelKey: 'wishlist' },
  { href: '/account/rooms', icon: Box, labelKey: 'savedRooms' },
  { href: '/account/settings', icon: Settings, labelKey: 'settings' },
] as const;

export default function AccountPage() {
  const t = useTranslations('account');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-navy font-display text-2xl">
            A
          </div>
          <div>
            <h1 className="font-display text-2xl text-navy dark:text-cream">{t('title')}</h1>
            <p className="text-charcoal/60 text-sm">ahmed@example.com</p>
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

          <button className="flex items-center gap-3 w-full p-4 text-terracotta rounded-xl hover:bg-terracotta/10 transition-colors mt-4">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}