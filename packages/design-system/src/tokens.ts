/**
 * Almnhali Decoración — Shared Design Tokens
 * Single source of truth for web (Tailwind) and mobile (React Native)
 */

export const colors = {
  navy: {
    DEFAULT: '#0A2540',
    50: '#E8EDF2',
    100: '#C5D0DB',
    200: '#8FA1B5',
    300: '#5A7290',
    400: '#2E4A6B',
    500: '#0A2540',
    600: '#081E33',
    700: '#061726',
    800: '#04101A',
    900: '#02080D',
  },
  gold: {
    DEFAULT: '#C5A46E',
    light: '#D4BC8E',
    dark: '#A88B52',
    muted: '#E8D9C0',
  },
  beige: {
    DEFAULT: '#F5F0E8',
    warm: '#EDE6DA',
    dark: '#D9CEBD',
  },
  terracotta: {
    DEFAULT: '#C4785A',
    light: '#D99B82',
    dark: '#A35D42',
  },
  white: '#FFFFFF',
  cream: '#FAF8F5',
  charcoal: '#2C2C2C',
  success: '#2D6A4F',
  warning: '#D4A017',
  error: '#C0392B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(10, 37, 64, 0.05)',
  md: '0 4px 12px rgba(10, 37, 64, 0.08)',
  lg: '0 8px 24px rgba(10, 37, 64, 0.12)',
  xl: '0 16px 48px rgba(10, 37, 64, 0.16)',
  gold: '0 4px 20px rgba(197, 164, 110, 0.25)',
} as const;

export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;

export type ColorToken = typeof colors;
export type SpacingToken = typeof spacing;