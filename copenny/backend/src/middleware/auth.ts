import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user object
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach the decoded token payload to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};
