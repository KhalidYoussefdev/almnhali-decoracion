'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Palette, LogOut, ExternalLink } from 'lucide-react';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/appearance', label: 'Site Content', icon: Palette },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-beige flex">
      <aside className="w-64 bg-navy text-cream flex flex-col shrink-0">
        <div className="p-6 border-b border-navy-600">
          <p className="font-display text-xl">Almnhali</p>
          <p className="text-gold text-xs tracking-widest mt-1">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname.startsWith(href) ? 'bg-gold/20 text-gold' : 'hover:bg-navy-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-navy-600 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold px-4 py-2">
            <ExternalLink className="h-4 w-4" /> View Website
          </a>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-cream/70 hover:text-terracotta px-4 py-2 w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}