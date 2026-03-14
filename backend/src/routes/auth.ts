import express from 'express';
import { hashPassword, verifyPassword, generateToken, verifyToken, UserPayload } from '../auth.js';
import { query } from '../db.js';
import { LoginRequest, SignupRequest, AuthResponse } from '../types.js';
import { z } from 'zod';


const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const profiles = await query('SELECT * FROM profiles WHERE user_id = ?', [email]);
    const profile = (profiles as any[])[0];
    if (!profile || !await verifyPassword(password, profile.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const roleResult = await query('SELECT role FROM user_roles WHERE user_id = ?', [email]);
    const role = (roleResult as any[])[0]?.role || 'warehouse_staff';

    const payload: UserPayload = {
      userId: email,
      email,
      role
    };

    const token = generateToken(payload);

    const response: AuthResponse = {
      userId: payload.userId,
      email: payload.email,
      full_name: profile.full_name,
      role: payload.role
    };

    res.json({ token, user: response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name } = signupSchema.parse(req.body);
    
    const hashedPassword = await hashPassword(password);
    const userId = email; // temp

    await query('INSERT INTO profiles (id, user_id, full_name, password_hash) VALUES (?, ?, ?, ?)', 
      [userId, userId, full_name, hashedPassword]);
    await query('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)', 
      [userId, userId, 'warehouse_staff']);

    const payload: UserPayload = { userId, email, role: 'warehouse_staff' };
    const token = generateToken(payload);

    const response: AuthResponse = {
      userId,
      email,
      full_name,
      role: 'warehouse_staff',
    };

    res.json({ token, user: response });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = verifyToken(token);
    const profiles = await query('SELECT * FROM profiles WHERE user_id = ?', [payload.userId]);
    const profile = (profiles as any[])[0];

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.json(profile);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

