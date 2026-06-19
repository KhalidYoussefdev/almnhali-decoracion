/**
 * Typography scale — Playfair Display (headings) + Inter (body)
 * Arabic: Noto Naskh Arabic + IBM Plex Sans Arabic
 */

export const fontFamilies = {
  display: {
    en: '"Playfair Display", Georgia, serif',
    ar: '"Noto Naskh Arabic", "Playfair Display", serif',
  },
  body: {
    en: '"Inter", system-ui, sans-serif',
    ar: '"IBM Plex Sans Arabic", "Inter", system-ui, sans-serif',
  },
} as const;

export const fontSizes = {
  xs: { size: 12, lineHeight: 16 },
  sm: { size: 14, lineHeight: 20 },
  base: { size: 16, lineHeight: 24 },
  lg: { size: 18, lineHeight: 28 },
  xl: { size: 20, lineHeight: 28 },
  '2xl': { size: 24, lineHeight: 32 },
  '3xl': { size: 30, lineHeight: 36 },
  '4xl': { size: 36, lineHeight: 40 },
  '5xl': { size: 48, lineHeight: 52 },
  '6xl': { size: 60, lineHeight: 64 },
  '7xl': { size: 72, lineHeight: 76 },
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.05em',
  wider: '0.1em',
  widest: '0.2em',
} as const;