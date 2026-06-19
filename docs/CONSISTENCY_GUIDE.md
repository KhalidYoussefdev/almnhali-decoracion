# Cross-Platform Consistency Guide

How the website and mobile app stay perfectly aligned in branding, UX, and functionality.

---

## 1. Single Source of Truth — Design Tokens

Both platforms import from `@almnhali/design-system`:

```typescript
// Web (tailwind.config.ts)
import { colors } from '@almnhali/design-system/tokens';

// Mobile (StyleSheet)
import { colors, spacing, borderRadius } from '@almnhali/design-system';
```

**Rule**: Never hardcode hex values in components. Always use tokens.

---

## 2. Parallel Information Architecture

| Web Route | Mobile Screen | Same Content |
|-----------|---------------|--------------|
| `/` | `(tabs)/index` | Hero, featured, trust signals |
| `/shop` | `(tabs)/shop` | Filters, search, product grid |
| `/product/[id]` | `product/[id]` | Detail, AR, complete-the-look |
| `/cart` | `(tabs)/cart` | Items, quantities, total |
| `/checkout` | `checkout` | Address, Saudi payments |
| `/account` | `(tabs)/account` | Profile, orders, wishlist, rooms |
| `/ar` (inline) | `ar/[id]` | Camera AR placement |
| AI FAB | AI FAB | Same greeting, same suggestions |

---

## 3. Shared Data Model

Both apps use identical `Product` interface:

```typescript
interface Product {
  id: string;
  name_en / name_ar: string;
  desc_en / desc_ar: string;
  price: number;          // Always SAR
  category / category_ar: string;
  images: string[];
  arModelUrl?: string;
  rating, reviewCount, badge, ...
}
```

**Production**: Both fetch from the same REST/GraphQL API. Product IDs are identical across platforms.

---

## 4. Shared i18n Keys

Web (`messages/en.json`) and mobile (`i18n/index.ts`) use matching keys:

| Key | EN | AR |
|-----|----|----|
| `shop.addToCart` | Add to Cart | أضف للسلة |
| `shop.viewAR` | View in AR | عرض بالواقع المعزز |
| `checkout.mada` | Mada | مدى |
| `ai.greeting` | Hello! I'm your... | مرحباً! أنا مساعد... |

**Rule**: Add a new string to BOTH files simultaneously.

---

## 5. Component Parity Checklist

| Element | Web | Mobile | Match Criteria |
|---------|-----|--------|----------------|
| Logo | Text wordmark + gold underline | Same | Identical text, colors |
| Product card ratio | 4:5 aspect | 4:5 aspect | Same |
| Gold CTA button | Gradient + navy text | Gradient + navy text | Same colors |
| Badge style | Gold pill, navy text | Gold pill, navy text | Same |
| Price format | `189 ر.س` / `SAR 189` | Same Intl format | Same |
| Cart badge | Gold circle, navy number | Gold badge | Same |
| AI chat bubble | Navy (user), beige (AI) | Same colors | Same |
| Trust icons | Gold icon in white card | Gold ✦ symbol | Same messaging |

---

## 6. State Sync Strategy

### Phase 1 (Current) — Local Persist
- Zustand `persist` middleware stores cart/wishlist in localStorage (web) / AsyncStorage (mobile)
- Works offline, no account required

### Phase 2 (Production) — Cloud Sync
```
User logs in (phone OTP)
    ↓
Server assigns cart/wishlist/rooms to user ID
    ↓
On login from any device → merge local + server state
    ↓
Realtime sync via Supabase Realtime or Firebase
```

---

## 7. Feature Parity Matrix

| Feature | Web | Mobile | Notes |
|---------|-----|--------|-------|
| AR View | model-viewer | Camera + ARKit | Different tech, same UX |
| Biometric login | — | Face ID / fingerprint | Mobile-only |
| Dark mode toggle | Manual toggle | System auto | Both support dark |
| Scroll animations | Parallax, stagger | Native scroll | Mobile skips parallax |
| Push notifications | Web push (optional) | Expo push | Order tracking |
| Photo reviews | File upload | Camera/gallery | Same review API |

---

## 8. QA Consistency Checklist

Before any release, verify:

- [ ] Logo renders correctly in both EN and AR
- [ ] RTL layout mirrors correctly (nav, cards, chat bubbles)
- [ ] All product prices show SAR with correct locale formatting
- [ ] Cart total calculation matches (subtotal + 49 SAR shipping if < 500)
- [ ] Payment methods show same 4 options in same order
- [ ] AI assistant gives same responses to same prompts
- [ ] Product images load from same CDN URLs
- [ ] "Complete the Look" shows same recommendations for same product ID
- [ ] Gold gradient CTAs are visually identical
- [ ] Free shipping message appears at same threshold

---

## 9. Release Coordination

```
Design token change → update packages/design-system → both apps rebuild
New product → add to API → both apps auto-fetch
New feature → implement web + mobile in same sprint → ship together
Copy change → update both i18n files → deploy both
```

Use a shared Figma file with component specs that map 1:1 to code components in both repos.