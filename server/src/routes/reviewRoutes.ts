import { Router, Request, Response } from 'express';
import { mockDb } from '../data/mockDb.js';

export const reviewRouter = Router();

// POST /api/products/:id/reviews
reviewRouter.post('/:id/reviews', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userName, rating, title, comment, userAvatar } = req.body;

  const product = mockDb.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    userName: userName || 'Anonymous',
    userAvatar: userAvatar || `https://api.dicebear.com/7.x/micah/svg?seed=${userName}`,
    rating: Number(rating) || 5,
    title: title || '',
    comment: comment || '',
    date: 'Just now',
    verifiedPurchase: true,
    helpfulCount: 0,
  };

  product.reviews.unshift(newReview);
  const totalScore = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = Number((totalScore / product.reviews.length).toFixed(1));
  product.reviewCount = product.reviews.length;

  res.status(201).json({
    success: true,
    data: newReview,
  });
});

export const couponRouter = Router();

// POST /api/coupons/validate
couponRouter.post('/validate', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code required' });
  }

  const clean = String(code).toUpperCase().trim();
  const coupon = mockDb.coupons[clean];

  if (coupon) {
    return res.json({
      success: true,
      data: {
        code: clean,
        discountPercent: coupon.discountPercent,
        description: coupon.description,
      },
    });
  }

  res.status(404).json({
    success: false,
    error: 'Invalid or expired promo code. Try WELCOME10, AURA20, or COLORPOP',
  });
});

export const analyticsRouter = Router();

// GET /api/analytics
analyticsRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : 1240,
      totalCatalogItems: mockDb.products.length,
      totalOrdersProcessed: mockDb.orders.length,
      activeUsers: mockDb.users.length,
      serverMemoryUsage: '48.2 MB',
      environment: 'production-ready',
      apiEndpointsActive: 14,
    },
  });
});
