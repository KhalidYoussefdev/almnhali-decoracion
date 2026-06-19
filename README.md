# Almnhali Decoración — Luxury E-Commerce Ecosystem

Premium home decoration and interior design brand for Riyadh, Saudi Arabia.

## Monorepo Structure

```
almnhali-decoracion/
├── packages/design-system/   # Shared tokens, typography, brand constants
├── apps/web/                 # Next.js 15 website (desktop + mobile web)
├── apps/mobile/              # Expo React Native app (iOS + Android)
└── docs/                     # Architecture, flows, consistency guides
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- For mobile: Expo Go app or Xcode/Android Studio

### Install & Run Web
```bash
cd almnhali-decoracion
npm install
npm run dev:web
```
Open http://localhost:3000

### Install & Run Mobile
```bash
cd almnhali-decoracion
npm install
npm run dev:mobile
```
Scan QR code with Expo Go.

## Features

| Feature | Web | Mobile |
|---------|-----|--------|
| Bilingual AR/EN + RTL | ✅ | ✅ |
| Dark / Light mode | ✅ | ✅ (system) |
| Shop + filters | ✅ | ✅ |
| AR product view | ✅ | ✅ |
| AI design assistant | ✅ | ✅ |
| Wishlist | ✅ | ✅ |
| Saudi payments (Mada, STC, Apple Pay, Tabby) | ✅ | ✅ |
| Biometric login | — | ✅ |
| Micro-animations | Framer Motion | Reanimated |

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0A2540` | Primary, headers, dark mode bg |
| Gold | `#C5A46E` | Accents, CTAs, luxury highlights |
| Beige | `#F5F0E8` | Backgrounds, cards |
| Terracotta | `#C4785A` | Warm accents, wishlist |
| Cream | `#FAF8F5` | Page backgrounds |

## Documentation

- [Design System](./docs/DESIGN_SYSTEM.md)
- [Navigation & User Flows](./docs/NAVIGATION_FLOWS.md)
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Cross-Platform Consistency](./docs/CONSISTENCY_GUIDE.md)

## Production Deployment

- **Web**: Vercel (recommended) with Edge CDN for Saudi region
- **Mobile**: EAS Build → App Store + Google Play
- **Payments**: Moyasar, Tap Payments, or HyperPay
- **AR**: Google model-viewer (web) + ARKit/ARCore via expo-three (mobile)
- **AI**: OpenAI GPT-4o or Claude API with product catalog RAG

© 2026 Almnhali Decoración