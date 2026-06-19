import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Almnhali Decoración',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}