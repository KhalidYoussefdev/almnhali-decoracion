import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@almnhali/design-system';

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSizes,
  fontWeights,
  fonts: {
    display: 'PlayfairDisplay-Bold',
    body: 'Inter-Regular',
    bodyMedium: 'Inter-Medium',
    bodySemiBold: 'Inter-SemiBold',
    arabic: 'NotoNaskhArabic-Regular',
  },
} as const;

export type Theme = typeof theme;