import { create } from 'zustand';
import { Product } from '../types';

interface CompareState {
  items: Product[];
  isOpen: boolean;
  toggleCompare: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  clearCompare: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  isOpen: false,

  toggleCompare: (product) => {
    const current = get().items;
    const exists = current.some((p) => p.id === product.id);

    if (exists) {
      set({ items: current.filter((p) => p.id !== product.id) });
      return false;
    } else {
      if (current.length >= 4) {
        // limit to 4 products
        set({ items: [...current.slice(1), product] });
      } else {
        set({ items: [...current, product] });
      }
      return true;
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((p) => p.id !== productId) });
  },

  clearCompare: () => {
    set({ items: [], isOpen: false });
  },

  setIsOpen: (isOpen) => {
    set({ isOpen });
  },
}));
