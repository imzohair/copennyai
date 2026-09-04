import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { query } from '../config/db';

// Extend Express Request to include user object
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    return;
  }

  try {
    // Try Firebase token verification first (frontend sends Firebase ID tokens)
    if (auth && typeof (auth as any).verifyIdToken === 'function') {
      try {
        const decoded = await (auth as any).verifyIdToken(token);
        // Look up user in our DB by firebase_uid
        const result = await query('SELECT id, email, name, firebase_uid FROM users WHERE firebase_uid = $1', [decoded.uid]);
        
        if (result.rows.length > 0) {
          req.user = result.rows[0];
          next();
          return;
        }

        // User not in DB yet — auto-create them
        const email = decoded.email || '';
        const name = decoded.name || decoded.email || 'User';
        const insertResult = await query(
          'INSERT INTO users (email, name, firebase_uid) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET firebase_uid = $3 RETURNING id, email, name, firebase_uid',
          [email, name, decoded.uid]
        );
        req.user = insertResult.rows[0];
        next();
        return;
      } catch (firebaseErr: any) {
        // Firebase verification failed — fall through to JWT check
      }
    }

    // Fallback: verify as our own JWT (for email/password login)
    const jwt = await import('jsonwebtoken');
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const decoded = jwt.default.verify(token, jwtSecret) as { id: number; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};
