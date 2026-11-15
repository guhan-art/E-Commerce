import { Router, Request, Response } from 'express';
import { mockDb } from '../data/mockDb.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  let user = mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${email}`,
      membershipTier: 'Standard',
      token: `jwt-mock-token-${Date.now()}`,
    };
    mockDb.users.push(user);
  }

  res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      user,
      token: user.token,
    },
  });
});

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  res.json({ success: true, data: mockDb.users[0] });
});
