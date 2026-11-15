import { Product, ProductReview, Category } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useApiLogStore } from '../store/useApiLogStore';

// In-memory store that can receive runtime updates (like new reviews)
let productsData: Product[] = [...INITIAL_PRODUCTS];

export const VALID_COUPONS: Record<string, { discountPercent: number; description: string }> = {
  'WELCOME10': { discountPercent: 0.10, description: '10% off entire order for new creators' },
  'AURA20': { discountPercent: 0.20, description: '20% off summer studio refresh' },
  'STUDIO50': { discountPercent: 0.15, description: '15% off workspace collection' },
  'FREESHIP': { discountPercent: 0.05, description: '5% bonus + priority freight waive' },
  'COLORPOP': { discountPercent: 0.25, description: '25% bright chromatic collection discount' },
};

export const api = {
  async getProducts(params?: {
    category?: Category;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    minRating?: number;
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
  }): Promise<Product[]> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 180));

    let filtered = [...productsData];

    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (params?.minRating !== undefined && params.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= params.minRating!);
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'featured':
        default:
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    const durationMs = Math.round(performance.now() - startTime);
    useApiLogStore.getState().addLog({
      method: 'GET',
      endpoint: `/api/products?category=${params?.category || 'All'}`,
      status: 200,
      durationMs,
      responseBody: { count: filtered.length, results: filtered.slice(0, 3) },
    });

    return filtered;
  },

  async getProductById(id: string): Promise<Product | null> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 140));
    const product = productsData.find((p) => p.id === id || p.slug === id);

    const durationMs = Math.round(performance.now() - startTime);
    useApiLogStore.getState().addLog({
      method: 'GET',
      endpoint: `/api/products/${id}`,
      status: product ? 200 : 404,
      durationMs,
      responseBody: product || { error: 'Product not found' },
    });

    return product || null;
  },

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const target = productsData.find((p) => p.id === productId);
    if (!target) return productsData.slice(0, limit);

    const related = productsData
      .filter((p) => p.id !== target.id && p.category === target.category)
      .concat(productsData.filter((p) => p.id !== target.id && p.category !== target.category))
      .slice(0, limit);

    const durationMs = Math.round(performance.now() - startTime);
    useApiLogStore.getState().addLog({
      method: 'GET',
      endpoint: `/api/products/${productId}/related`,
      status: 200,
      durationMs,
      responseBody: { count: related.length },
    });

    return related;
  },

  async addReview(
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount' | 'verifiedPurchase'>
  ): Promise<ProductReview> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 250));
    const target = productsData.find((p) => p.id === productId);
    if (!target) throw new Error('Product not found');

    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    target.reviews = [newReview, ...target.reviews];
    const totalScore = target.reviews.reduce((acc, r) => acc + r.rating, 0);
    target.rating = Number((totalScore / target.reviews.length).toFixed(1));
    target.reviewCount = target.reviews.length;

    const durationMs = Math.round(performance.now() - startTime);
    useApiLogStore.getState().addLog({
      method: 'POST',
      endpoint: `/api/products/${productId}/reviews`,
      status: 201,
      durationMs,
      requestBody: reviewData,
      responseBody: newReview,
    });

    return newReview;
  },

  async validateCoupon(code: string): Promise<{ valid: boolean; discountPercent?: number; description?: string; message?: string }> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 180));
    const cleanCode = code.toUpperCase().trim();
    const coupon = VALID_COUPONS[cleanCode];

    const durationMs = Math.round(performance.now() - startTime);

    if (coupon) {
      useApiLogStore.getState().addLog({
        method: 'POST',
        endpoint: '/api/coupons/validate',
        status: 200,
        durationMs,
        requestBody: { code: cleanCode },
        responseBody: coupon,
      });

      return {
        valid: true,
        discountPercent: coupon.discountPercent,
        description: coupon.description,
      };
    }

    useApiLogStore.getState().addLog({
      method: 'POST',
      endpoint: '/api/coupons/validate',
      status: 404,
      durationMs,
      requestBody: { code: cleanCode },
      responseBody: { valid: false, error: 'Invalid coupon' },
    });

    return {
      valid: false,
      message: 'Invalid or expired promo code. Try WELCOME10, AURA20, or COLORPOP',
    };
  },
};
