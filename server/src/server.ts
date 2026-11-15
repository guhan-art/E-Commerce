import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productRouter } from './routes/productRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { reviewRouter, couponRouter, analyticsRouter } from './routes/reviewRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CHROMALUX Studio API Gateway',
    version: '2.0.0',
  });
});

// Mount Routes
app.use('/api/products', productRouter);
app.use('/api/products', reviewRouter);
app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/analytics', analyticsRouter);

// Global Error Handler
app.use(errorHandler);

// Only listen if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ CHROMALUX Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
