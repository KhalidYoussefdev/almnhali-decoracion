import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme;
        // Cycle light ↔ dark (simple toggle for mobile + desktop)
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next === 'dark');
          document.documentElement.style.colorScheme = next === 'dark' ? 'dark' : 'light';
        }
      },
    }),
    { name: 'almnhali-theme' },
  ),
);
