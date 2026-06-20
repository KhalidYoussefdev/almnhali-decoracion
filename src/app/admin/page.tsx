'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError('Invalid password');
      return;
    }
    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <form onSubmit={login} className="w-full max-w-md bg-cream rounded-2xl p-8 shadow-xl">
        <h1 className="font-display text-3xl text-navy">Admin Login</h1>
        <p className="text-charcoal/60 mt-2 text-sm">Almanhali Decoration management panel</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full mt-6 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none"
          autoFocus
        />
        {error && <p className="text-terracotta text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}