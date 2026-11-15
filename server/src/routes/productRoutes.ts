import { Router, Request, Response } from 'express';
import { mockDb } from '../data/mockDb.js';
import { Category, Product } from '../types.js';

export const productRouter = Router();

// GET /api/products
productRouter.get('/', (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, inStockOnly, minRating, sortBy } = req.query;

  let filtered: Product[] = [...mockDb.products];

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (inStockOnly === 'true') {
    filtered = filtered.filter((p) => p.inStock);
  }

  if (minRating) {
    filtered = filtered.filter((p) => p.rating >= Number(minRating));
  }

  if (sortBy) {
    switch (sortBy) {
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
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// GET /api/products/:id
productRouter.get('/:id', (req: Request, res: Response) => {
  const product = mockDb.products.find((p) => p.id === req.params.id || p.slug === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, data: product });
});

// GET /api/products/:id/related
productRouter.get('/:id/related', (req: Request, res: Response) => {
  const target = mockDb.products.find((p) => p.id === req.params.id);
  const limit = Number(req.query.limit) || 4;

  if (!target) {
    return res.json({ success: true, data: mockDb.products.slice(0, limit) });
  }

  const related = mockDb.products
    .filter((p) => p.id !== target.id && p.category === target.category)
    .concat(mockDb.products.filter((p) => p.id !== target.id && p.category !== target.category))
    .slice(0, limit);

  res.json({ success: true, data: related });
});
