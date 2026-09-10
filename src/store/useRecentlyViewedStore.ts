import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product) => {
        const filtered = get().items.filter((p) => p.id !== product.id);
        set({ items: [product, ...filtered].slice(0, 8) });
      },

      clearHistory: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'aura-recently-viewed',
    }
  )
);
