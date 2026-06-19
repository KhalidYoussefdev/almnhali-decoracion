'use client';

import { useEffect } from 'react';
import type { SiteSettings } from '@/types/product';

export function ThemeInjector({ settings }: { settings: SiteSettings }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-navy', settings.theme.navy);
    root.style.setProperty('--color-gold', settings.theme.gold);
    root.style.setProperty('--color-beige', settings.theme.beige);
  }, [settings]);

  return null;
}