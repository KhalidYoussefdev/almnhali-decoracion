import { cookies } from 'next/headers';

const COOKIE_NAME = 'almnhali_admin';
const DEFAULT_PASSWORD = 'Almnhali2026!';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === getAdminPassword();
}

export function adminCookieOptions(password: string) {
  return {
    name: COOKIE_NAME,
    value: password,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  };
}