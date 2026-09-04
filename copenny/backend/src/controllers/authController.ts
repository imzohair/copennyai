import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from '../config/firebase';
import { query } from '../config/db';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Please provide email, password, and name' });
    }

    // Check if user exists in PostgreSQL
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    // Create user in Firebase Auth
    let firebaseRecord;
    try {
      firebaseRecord = await firebaseAuth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (fbError: any) {
      // If Firebase fails, we don't proceed with Postgres insertion
      console.error('Firebase Auth Error:', fbError);
      return res.status(400).json({ success: false, error: fbError.message });
    }

    // Hash password for local database
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    // Ensure you have a users table: 
    // CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, name VARCHAR(255), password_hash TEXT, firebase_uid VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    const result = await query(
      'INSERT INTO users (email, name, password_hash, firebase_uid) VALUES ($1, $2, $3, $4) RETURNING id, email, name, firebase_uid, created_at',
      [email, name, passwordHash, firebaseRecord.uid]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Fetch user from PostgreSQL
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Remove password hash from response
    delete user.password_hash;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const result = await query('SELECT id, email, name, firebase_uid, created_at FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const syncFirebase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ success: false, error: 'Please provide firebaseUid' });
    }

    // Update the PostgreSQL user record with the Firebase UID
    const result = await query(
      'UPDATE users SET firebase_uid = $1 WHERE id = $2 RETURNING id, email, name, firebase_uid',
      [firebaseUid, userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Firebase UID synced successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
