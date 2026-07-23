'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme';

function resolveIsDark(theme: 'light' | 'dark' | 'system'): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeClass(theme: 'light' | 'dark' | 'system') {
  if (typeof document === 'undefined') return;
  const isDark = resolveIsDark(theme);
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

/** Applies and keeps light/dark theme in sync (works on mobile + desktop). */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyThemeClass(theme);

    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyThemeClass('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  // Re-apply after zustand persist rehydrates from localStorage
  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      applyThemeClass(useThemeStore.getState().theme);
    });
    if (useThemeStore.persist.hasHydrated()) {
      applyThemeClass(useThemeStore.getState().theme);
    }
    return unsub;
  }, []);

  return <>{children}</>;
}
