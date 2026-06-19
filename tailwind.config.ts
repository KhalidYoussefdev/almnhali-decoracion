import type { Config } from 'tailwindcss';
import { colors, borderRadius } from '@almnhali/design-system/tokens';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: colors.navy,
        gold: colors.gold,
        beige: colors.beige,
        terracotta: colors.terracotta,
        cream: colors.cream,
        charcoal: colors.charcoal,
      },
      borderRadius: {
        luxury: `${borderRadius['2xl']}px`,
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-arabic)', 'var(--font-ibm-arabic)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A46E 0%, #D4BC8E 50%, #A88B52 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0A2540 0%, #081E33 100%)',
        'hero-overlay': 'linear-gradient(to top, rgba(10,37,64,0.85) 0%, rgba(10,37,64,0.2) 60%, transparent 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;