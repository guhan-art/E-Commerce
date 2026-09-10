export type Category = 'All' | 'Audio' | 'Workspace' | 'Wearables' | 'Lifestyle' | 'Optics';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Matte Black", "Space Gray", "Alabaster White"
  colorHex?: string;
  sku?: string;
  priceModifier?: number; // difference from base price
  inStock: boolean;
}

export interface ProductSizeOption {
  id: string;
  label: string; // e.g. "Standard", "Extended", "256GB", "512GB"
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
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

export interface CartItem {
  cartItemId: string; // unique combo of product id + selected variants
  product: Product;
  selectedVariant?: ProductVariant;
  selectedSize?: ProductSizeOption;
  quantity: number;
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

export interface PaymentDetails {
  method: 'card' | 'upi' | 'cod' | 'applepay';
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
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
  membershipTier?: 'Standard' | 'Pro' | 'Aura Gold';
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}
