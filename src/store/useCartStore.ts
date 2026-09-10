import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, ProductSizeOption, CartItem } from '../types';
import { api } from '../services/api';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  appliedCoupon: string | null;
  discountPercent: number;
  couponDescription: string | null;
  
  // Actions
  addItem: (product: Product, variant?: ProductVariant, size?: ProductSizeOption, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Computed values
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      appliedCoupon: null,
      discountPercent: 0,
      couponDescription: null,

      addItem: (product, variant, size, quantity = 1) => {
        const variantKey = variant ? variant.id : 'default';
        const sizeKey = size ? size.id : 'default';
        const cartItemId = `${product.id}-${variantKey}-${sizeKey}`;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.cartItemId === cartItemId);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const currentQty = updated[existingIndex].quantity;
          const maxStock = product.stockCount || 99;
          updated[existingIndex].quantity = Math.min(currentQty + quantity, maxStock);
          set({ items: updated, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            cartItemId,
            product,
            selectedVariant: variant,
            selectedSize: size,
            quantity,
          };
          set({ items: [...currentItems, newItem], isCartOpen: true });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const updated = get().items.map((item) => {
          if (item.cartItemId === cartItemId) {
            const maxStock = item.product.stockCount || 99;
            return { ...item, quantity: Math.min(quantity, maxStock) };
          }
          return item;
        });
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, discountPercent: 0, couponDescription: null });
      },

      setIsCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      applyCoupon: async (code: string) => {
        const res = await api.validateCoupon(code);
        if (res.valid && res.discountPercent) {
          set({
            appliedCoupon: code.toUpperCase().trim(),
            discountPercent: res.discountPercent,
            couponDescription: res.description || null,
          });
          return { success: true, message: `Promo code "${code.toUpperCase()}" applied successfully!` };
        } else {
          return { success: false, message: res.message || 'Invalid promo code' };
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, discountPercent: 0, couponDescription: null });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const basePrice = item.product.price;
          const variantModifier = item.selectedVariant?.priceModifier || 0;
          return acc + (basePrice + variantModifier) * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * get().discountPercent);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free shipping if subtotal >= 150 or FREESHIP promo code applied
        if (subtotal >= 150 || get().appliedCoupon === 'FREESHIP') {
          return 0;
        }
        return 15;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * 0.08); // 8% standard tax
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'aura-cart-storage',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        discountPercent: state.discountPercent,
        couponDescription: state.couponDescription,
      }),
    }
  )
);
