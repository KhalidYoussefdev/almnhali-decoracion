import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

function sanitizeItems(items: CartItem[] | undefined | null): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(
      (i) =>
        i &&
        typeof i.productId === 'string' &&
        i.productId.length > 0 &&
        typeof i.quantity === 'number' &&
        Number.isFinite(i.quantity) &&
        i.quantity > 0,
    )
    .map((i) => ({
      productId: i.productId,
      quantity: Math.floor(i.quantity),
      ...(i.variant ? { variant: i.variant } : {}),
    }));
}

export function getCartItemCount(items: CartItem[]): number {
  return sanitizeItems(items).reduce((sum, i) => sum + i.quantity, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1) => {
        const qty = Math.max(1, Math.floor(quantity || 1));
        set((state) => {
          const items = sanitizeItems(state.items);
          const existing = items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: items.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...items, { productId, quantity: qty }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: sanitizeItems(state.items).filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: sanitizeItems(state.items).map((i) =>
            i.productId === productId ? { ...i, quantity: Math.floor(quantity) } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'almnhali-cart',
      partialize: (state) => ({ items: sanitizeItems(state.items) }),
      merge: (persisted, current) => {
        const p = persisted as { items?: CartItem[] } | undefined;
        return {
          ...current,
          items: sanitizeItems(p?.items ?? current.items),
        };
      },
    },
  ),
);
