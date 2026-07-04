'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = await login(email, password);
    if (err) {
      setError(err);
      return;
    }
    router.push('/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-navy dark:text-cream">{t('loginTitle')}</h1>
        <p className="mt-2 text-charcoal/60 dark:text-cream/60 text-sm">{t('loginSubtitle')}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          {error && <p className="text-terracotta text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal/60 dark:text-cream/60">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-gold font-medium hover:underline">
            {t('createAccount')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}