/**
 * Authentication routes
 */
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../models/User';
import { AUTH_CONFIG } from '../config/auth';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    if (UserModel.findByUsername(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (UserModel.findByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const user = UserModel.create(username, email, password);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      AUTH_CONFIG.jwtSecret,
      { expiresIn: AUTH_CONFIG.jwtExpiresIn } as jwt.SignOptions
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Find user
    const user = UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    if (!UserModel.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      AUTH_CONFIG.jwtSecret,
      { expiresIn: AUTH_CONFIG.jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
