import type { Product } from '@/data/products';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://almnhali.com';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export function resolveImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Product[]) : [];
  } catch {
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error) return null;
    return data as Product;
  } catch {
    return null;
  }
}

export async function fetchSettings(): Promise<{
  contact: { phone: string; whatsapp: string; email: string };
  brand: { location_en: string; location_ar: string };
} | null> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function authRegister(
  data: { name: string; email: string; phone?: string; password: string; confirmPassword: string },
): Promise<{ user?: PublicUser; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? 'Registration failed' };
    return { user: body.user, token: body.token };
  } catch {
    return { error: 'Registration failed' };
  }
}

export async function authLogin(
  email: string,
  password: string,
): Promise<{ user?: PublicUser; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? 'Login failed' };
    return { user: body.user, token: body.token };
  } catch {
    return { error: 'Login failed' };
  }
}

export async function authMe(token: string): Promise<PublicUser | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicUser;
  } catch {
    return null;
  }
}