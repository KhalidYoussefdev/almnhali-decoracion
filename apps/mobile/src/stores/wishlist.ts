import { create } from 'zustand';

interface WishlistState {
  items: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  toggle: (productId) => {
    set((state) => ({
      items: state.items.includes(productId)
        ? state.items.filter((id) => id !== productId)
        : [...state.items, productId],
    }));
  },
  has: (productId) => get().items.includes(productId),
}));