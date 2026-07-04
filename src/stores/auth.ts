'use client';

import { create } from 'zustand';
import type { PublicUser } from '@/types/user';

interface AuthState {
  user: PublicUser | null;
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => Promise<string | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = (await res.json()) as PublicUser;
        set({ user, hydrated: true, loading: false });
      } else {
        set({ user: null, hydrated: true, loading: false });
      }
    } catch {
      set({ user: null, hydrated: true, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ loading: false });
        return data.error ?? 'Login failed';
      }
      set({ user: data.user, loading: false, hydrated: true });
      return null;
    } catch {
      set({ loading: false });
      return 'Login failed';
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        set({ loading: false });
        return body.error ?? 'Registration failed';
      }
      set({ user: body.user, loading: false, hydrated: true });
      return null;
    } catch {
      set({ loading: false });
      return 'Registration failed';
    }
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },
}));