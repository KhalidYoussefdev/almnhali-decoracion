# Navigation Structure & User Flows

## Website Navigation (Next.js)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]    Shop  Collections  Inspiration    🔍 🌙 EN 🛒   │
└─────────────────────────────────────────────────────────────┘

Routes:
/                          → Homepage (hero, collections, bento, trust)
/shop                      → Product grid + filters + search + sort
/shop?category=flooring      → Filtered shop
/product/[id]              → Product detail + AR + complete-the-look
/product/[id]?ar=true      → Opens AR viewer
/collections               → Collection mood board grid
/collections/[id]          → Collection products
/inspiration               → Scrollytelling + mood boards
/cart                      → Cart with quantity controls
/checkout                  → Shipping + Saudi payment methods
/account                   → Profile hub
/account/orders            → Order history + tracking
/account/rooms             → Saved AR room configurations
/wishlist                  → Synced wishlist
```

### Arabic Routes
Same paths with `/ar` prefix when locale is Arabic (next-intl `localePrefix: 'as-needed'`).
RTL layout auto-applied via `dir="rtl"` on `<html>`.

---

## Mobile Navigation (Expo Router)

```
Bottom Tabs:
┌──────────┬──────────┬──────────┬──────────┐
│  Home    │   Shop   │   Cart   │ Account  │
│  🏠      │   ▦      │   🛍 (n) │   👤     │
└──────────┴──────────┴──────────┴──────────┘

Stack Screens (modal/card):
/product/[id]     → Product detail
/ar/[id]         → Full-screen AR camera placement
/checkout        → Modal checkout flow
```

---

## Key User Flows

### 1. Browse → Purchase
```
Home → Featured Product → Product Detail → Add to Cart → Cart → Checkout → Payment → Confirmation
         ↓
    Complete the Look (AI recommendations)
```

### 2. AR Room Placement
```
Product Detail → "View in AR" → Camera permission → Place on surface → Adjust → Save Room
                                                                              ↓
                                                                    Account → Saved AR Rooms
```

### 3. AI-Assisted Shopping
```
Any screen → FAB chat → Ask question → AI suggests products → Deep link to product/AR
```

### 4. Wishlist Sync (cross-device)
```
Product → Heart icon → Local storage (Zustand persist)
                              ↓
                    [Production: Firebase/Supabase sync via user ID]
```

### 5. Account & Biometric (mobile only)
```
Account → Face ID / Fingerprint → Authenticate → Access orders, wishlist, saved rooms
```

### 6. Order Tracking
```
Account → Orders → Select order → Status timeline
  ├── Confirmed
  ├── Processing (Riyadh warehouse)
  ├── Shipped (SMSA / Aramex / local courier)
  └── Delivered
```

---

## Conversion Optimizations

1. **Sticky cart badge** — always visible item count
2. **Hover/quick-add** on product cards (web)
3. **One-tap add** on mobile product cards
4. **Free shipping threshold** — 500 SAR progress indicator
5. **Saudi payment methods** — Mada first (default), Tabby for installments
6. **Complete the Look** — increases AOV 15–25% (industry benchmark)
7. **AR reduces returns** — "Place in Room" before purchase
8. **AI assistant** — reduces bounce on complex products (flooring, panels)