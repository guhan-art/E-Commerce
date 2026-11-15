export type Category = 'All' | 'Audio' | 'Workspace' | 'Wearables' | 'Lifestyle' | 'Optics';

export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface ProductSizeOption {
  id: string;
  label: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  badge?: 'Best Seller' | 'New Release' | 'Staff Pick' | 'Limited Edition' | 'Sale';
  images: string[];
  variants?: ProductVariant[];
  sizeOptions?: ProductSizeOption[];
  features: string[];
  specs: Record<string, string>;
  reviews: ProductReview[];
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariantName?: string;
  selectedSizeLabel?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  appliedCoupon?: string;
  status: OrderStatus;
  paymentMethod: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membershipTier?: 'Standard' | 'Pro' | 'VIP';
  token?: string;
}
