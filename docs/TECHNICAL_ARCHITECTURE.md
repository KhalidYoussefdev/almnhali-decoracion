# Technical Architecture

## Stack Overview

| Layer | Web | Mobile | Shared |
|-------|-----|--------|--------|
| Framework | Next.js 15 (App Router) | Expo 52 + React Native 0.76 | — |
| Language | TypeScript 5.7 | TypeScript 5.7 | TypeScript |
| Styling | Tailwind CSS 3.4 | StyleSheet + design tokens | `@almnhali/design-system` |
| Animation | Framer Motion 11 | Reanimated 3 + Haptics | Token easing curves |
| State | Zustand 5 (persist) | Zustand 5 | Same store patterns |
| i18n | next-intl 3 | i18n-js + expo-localization | Shared message keys |
| Routing | App Router + middleware | Expo Router (file-based) | Parallel route structure |

---

## Shared Design System Package

```
packages/design-system/src/
├── tokens.ts      # colors, spacing, shadows, breakpoints, z-index
├── typography.ts  # font families, sizes, weights
└── index.ts       # brand constants (name, tagline, social, currency)
```

Imported by both apps via npm workspaces:
```json
"@almnhali/design-system": "*"
```

Web maps tokens to Tailwind in `tailwind.config.ts`.
Mobile imports tokens directly into StyleSheet values.

---

## Web Architecture

```
apps/web/src/
├── app/[locale]/          # Locale-wrapped pages
│   ├── page.tsx           # Homepage
│   ├── shop/
│   ├── product/[id]/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   ├── collections/[id]/
│   ├── inspiration/
│   └── wishlist/
├── components/
│   ├── ui/                # Design system components
│   ├── layout/            # Header, Footer
│   ├── home/              # Hero, Bento, Trust
│   ├── ar/                # AR viewer
│   └── ai/                # AI assistant
├── stores/                # Zustand (cart, wishlist, theme)
├── data/                  # Product catalog (→ CMS in production)
├── i18n/                  # next-intl routing + request config
└── lib/                   # utils (cn, formatPrice, getLocalizedField)
```

### Production Integrations (Web)

| Service | Purpose | Recommendation |
|---------|---------|----------------|
| CMS | Product catalog | Sanity.io or Strapi (bilingual fields) |
| Payments | Checkout | Moyasar (Mada native) or Tap Payments |
| AR | 3D models | `@google/model-viewer` + `.glb` on CDN |
| AI | Chat assistant | OpenAI API + product embedding RAG |
| Auth | Account | NextAuth.js + Saudi phone OTP (Unifonic) |
| Analytics | Conversion | GA4 + Hotjar heatmaps |
| CDN | Images | Cloudinary (auto WebP, Saudi edge) |
| Search | Product search | Algolia (bilingual index) |

---

## Mobile Architecture

```
apps/mobile/
├── app/                   # Expo Router screens
│   ├── (tabs)/            # Bottom navigation
│   ├── product/[id].tsx
│   ├── ar/[id].tsx
│   └── checkout.tsx
├── src/
│   ├── components/        # UI components
│   ├── stores/            # Zustand
│   ├── data/              # Products (sync from API)
│   ├── i18n/              # Translations
│   └── theme/             # Token re-exports
```

### Production Integrations (Mobile)

| Service | Purpose | Recommendation |
|---------|---------|----------------|
| AR | Room placement | expo-three + ARKit/ARCore, or 8th Wall |
| Auth | Biometric | expo-local-authentication + JWT refresh |
| Push | Order updates | Expo Notifications + FCM |
| Deep links | Web → App | `almnhali://product/[id]` scheme |
| OTA updates | Fast fixes | EAS Update |
| Crash reporting | Stability | Sentry |

---

## API Design (Production Backend)

```
/api/v1/
├── products              GET (list, filter, search)
├── products/:id          GET (detail + recommendations)
├── cart                  GET/POST/DELETE (authenticated)
├── wishlist              GET/POST/DELETE (synced)
├── orders                GET/POST
├── orders/:id/track      GET (delivery status)
├── ar/rooms              GET/POST (saved configurations)
├── ai/chat               POST (streaming SSE)
└── auth/
    ├── otp/send          POST (Saudi phone)
    └── otp/verify        POST
```

Recommended: **Supabase** (Postgres + Auth + Realtime) or **Firebase** for rapid MVP.

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP (web) | < 2.0s |
| FID (web) | < 100ms |
| CLS (web) | < 0.1 |
| Lighthouse | 90+ all categories |
| App launch | < 2s cold start |
| Image format | WebP/AVIF with `next/image` |

---

## Security

- HTTPS everywhere
- PCI DSS via payment gateway (never store card data)
- JWT with short expiry + refresh tokens
- Rate limiting on AI chat endpoint
- Input sanitization on reviews/photo uploads
- Saudi PDPL compliance for user data