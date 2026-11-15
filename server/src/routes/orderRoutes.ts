import { Router, Request, Response } from 'express';
import { mockDb } from '../data/mockDb.js';
import { Order } from '../types.js';

export const orderRouter = Router();

// GET /api/orders
orderRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: mockDb.orders.length,
    data: mockDb.orders,
  });
});

// GET /api/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = mockDb.orders.find((o) => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders
orderRouter.post('/', (req: Request, res: Response) => {
  const { customer, items, subtotal, discount, shipping, tax, total, appliedCoupon, paymentMethod } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid order payload' });
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randSuffix = '';
  for (let i = 0; i < 5; i++) {
    randSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const id = `CHRO-${randSuffix}`;
  const trackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

  const newOrder: Order = {
    id,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    shipping: Number(shipping || 0),
    tax: Number(tax || 0),
    total: Number(total),
    appliedCoupon,
    status: 'processing',
    paymentMethod: paymentMethod || 'Credit Card',
    estimatedDelivery: 'Dispatches within 24 hours (Est. 2-3 business days)',
    trackingNumber,
  };

  mockDb.orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder,
  });
});

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const order = mockDb.orders.find((o) => o.id.toLowerCase() === req.params.id.toLowerCase());

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  order.status = status;
  res.json({ success: true, data: order });
});
