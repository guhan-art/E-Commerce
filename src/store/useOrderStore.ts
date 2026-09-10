import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'AUR-92841',
    createdAt: '2025-02-28T14:20:00Z',
    customer: {
      fullName: 'Guhan Raj',
      email: 'demo@aura.design',
      phone: '+1 (555) 382-9912',
      street: '742 Evergreen Terrace',
      apartment: 'Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    },
    items: [
      {
        id: 'item-demo-1',
        productId: 'prod-1',
        name: 'AURA One Acoustic Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        price: 349,
        quantity: 1,
        selectedVariantName: 'Matte Obsidian',
        selectedSizeLabel: 'Standard Cushion',
      },
      {
        id: 'item-demo-2',
        productId: 'prod-7',
        name: 'Strata Merino Wool Desk Pad',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
        price: 79,
        quantity: 1,
        selectedVariantName: 'Anthracite Gray',
        selectedSizeLabel: 'Large (90 x 40 cm)',
      },
    ],
    subtotal: 428,
    discount: 43,
    shipping: 0,
    tax: 31,
    total: 416,
    appliedCoupon: 'WELCOME10',
    status: 'delivered',
    paymentMethod: 'Credit Card (ending in 4242)',
    estimatedDelivery: 'Delivered Mar 03, 2025',
    trackingNumber: 'TRK-837492019',
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_SAMPLE_ORDERS,

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] });
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        });
      },
    }),
    {
      name: 'aura-orders-storage',
    }
  )
);
