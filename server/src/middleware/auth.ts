import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo/guest checkout we allow continuation or optional auth
    return next();
  }

  // Simulated JWT verification
  if (token.startsWith('jwt-mock-token')) {
    req.user = {
      id: 'usr-1',
      name: 'Guhan Raj',
      email: 'demo@aura.design',
    };
    return next();
  }

  return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
};
