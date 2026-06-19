# Almnhali Decoración — Design System

## Brand Identity

**Logo**: Text-only wordmark — "Almnhali" in deep navy (`#0A2540`) + "Decoración" in gold (`#C5A46E`), with Arabic subline "المنهالي للديكور" and a gold gradient underline.

**Voice**: Sophisticated, warm, authoritative. Bilingual by default. Culturally grounded in Saudi heritage without cliché.

---

## Color Palette

```
Navy (Primary)     #0A2540  ████████  Headers, nav, dark mode base
Navy-600           #081E33  ████████  Dark mode surfaces
Gold (Accent)      #C5A46E  ████████  CTAs, badges, highlights
Gold Light         #D4BC8E  ████████  Hover states, gradients
Gold Dark          #A88B52  ████████  Secondary gold text
Beige              #F5F0E8  ████████  Card backgrounds, sections
Beige Warm         #EDE6DA  ████████  Input backgrounds
Terracotta         #C4785A  ████████  Wishlist, warm accents
Cream              #FAF8F5  ████████  Page background (light)
White              #FFFFFF  ████████  Cards, overlays
Charcoal           #2C2C2C  ████████  Body text secondary
```

### Dark Mode Mapping
| Light | Dark |
|-------|------|
| Cream bg | Navy-900 bg |
| Navy text | Cream text |
| White cards | Navy-800 cards |
| Beige sections | Navy-800 sections |

---

## Typography

| Role | English | Arabic | Weight | Usage |
|------|---------|--------|--------|-------|
| Display | Playfair Display | Noto Naskh Arabic | 700 | H1–H3, hero, collection titles |
| Body | Inter | IBM Plex Sans Arabic | 400–600 | Paragraphs, UI labels, buttons |
| Caption | Inter | IBM Plex Sans Arabic | 500 | Badges, metadata, prices |

### Scale
| Token | Size | Line Height |
|-------|------|-------------|
| xs | 12px | 16px |
| sm | 14px | 20px |
| base | 16px | 24px |
| lg | 18px | 28px |
| xl | 20px | 28px |
| 2xl | 24px | 32px |
| 3xl | 30px | 36px |
| 4xl | 36px | 40px |
| 5xl | 48px | 52px |
| 6xl | 60px | 64px |
| 7xl | 72px | 76px |

---

## Spacing & Layout

Base unit: **4px**. Scale: 4, 8, 16, 24, 32, 48, 64, 96.

- **Container max-width**: 1280px (80rem)
- **Grid gaps**: 24px mobile, 32px desktop
- **Section padding**: 80px vertical (mobile: 64px)
- **Border radius**: 8px (buttons), 16px (cards), 24px (hero/images)

---

## Component Library

### Web (`apps/web/src/components/`)

| Component | Path | Variants |
|-----------|------|----------|
| Button | `ui/Button.tsx` | primary, secondary, outline, ghost, gold |
| Logo | `ui/Logo.tsx` | full, compact; light, dark |
| ProductCard | `ui/ProductCard.tsx` | — (hover reveal actions) |
| Header | `layout/Header.tsx` | sticky, search expand, mobile drawer |
| Footer | `layout/Footer.tsx` | newsletter, social links |
| Hero | `home/Hero.tsx` | parallax scroll |
| BentoGallery | `home/BentoGallery.tsx` | asymmetric grid |
| ARViewer | `ar/ARViewer.tsx` | 3D preview → camera AR |
| AIAssistant | `ai/AIAssistant.tsx` | floating chat FAB |

### Mobile (`apps/mobile/src/components/`)

| Component | Mirrors Web |
|-----------|-------------|
| Button | Same variants + haptic feedback |
| Logo | Same wordmark |
| ProductCard | Same layout (4:5 image ratio) |
| AIChat | Same floating assistant pattern |

---

## Motion & Micro-animations

| Pattern | Web (Framer Motion) | Mobile (Reanimated) |
|---------|---------------------|---------------------|
| Page enter | fade + slide up 20px, 0.5s | native stack transition |
| Card hover | scale 1.05 image, reveal CTA | press scale 0.98 |
| Button tap | scale 0.98 | scale 0.98 + haptic |
| Hero parallax | scroll-linked Y transform | — |
| Stagger grid | 80ms delay per item | — |
| AI typing | bouncing dots | bouncing dots |
| FAB | scale hover 1.05 | scale press |

**Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — luxury feel, no bouncy overshoot except FAB.

---

## Accessibility

- WCAG 2.2 AA contrast ratios (navy/cream, gold/navy pairs verified)
- Focus rings: 2px gold offset
- `aria-label` on icon-only buttons
- RTL logical properties (`start`/`end` not `left`/`right`)
- Reduced motion: respect `prefers-reduced-motion`
- SAR currency formatted via `Intl.NumberFormat('ar-SA')`