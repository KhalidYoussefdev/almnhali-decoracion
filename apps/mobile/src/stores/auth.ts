import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { PublicUser } from '@/lib/api';
import { authLogin, authMe, authRegister } from '@/lib/api';

const TOKEN_KEY = 'almnhali_auth_token';

interface AuthState {
  user: PublicUser | null;
  token: string | null;
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
  token: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        set({ hydrated: true });
        return;
      }
      const user = await authMe(token);
      set({ token, user, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    const result = await authLogin(email, password);
    if (result.error || !result.token || !result.user) {
      set({ loading: false });
      return result.error ?? 'Login failed';
    }
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    set({ user: result.user, token: result.token, loading: false });
    return null;
  },

  register: async (data) => {
    set({ loading: true });
    const result = await authRegister(data);
    if (result.error || !result.token || !result.user) {
      set({ loading: false });
      return result.error ?? 'Registration failed';
    }
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    set({ user: result.user, token: result.token, loading: false });
    return null;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));