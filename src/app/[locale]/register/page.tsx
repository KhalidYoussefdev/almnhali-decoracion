'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = await register({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
    if (err) {
      setError(err);
      return;
    }
    router.push('/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-navy dark:text-cream">{t('registerTitle')}</h1>
        <p className="mt-2 text-charcoal/60 dark:text-cream/60 text-sm">{t('registerSubtitle')}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={t('fullName')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder={t('email')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder={t('phone')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          <input
            required
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={t('password')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          <input
            required
            type="password"
            minLength={8}
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            placeholder={t('confirmPassword')}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            dir="ltr"
          />
          {error && <p className="text-terracotta text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t('creating') : t('createAccount')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal/60 dark:text-cream/60">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-gold font-medium hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}