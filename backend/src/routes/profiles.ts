import express from 'express';
import { verifyToken } from '../auth.js';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = verifyToken(token);
    const profiles = await query('SELECT * FROM profiles WHERE user_id = ?', [payload.userId]);
    const roles = await query('SELECT role FROM user_roles WHERE user_id = ?', [payload.userId]);

    res.json({ profile: (profiles as any[])[0], role: (roles as any[])[0]?.role });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.put('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = verifyToken(token);
    const { full_name, default_warehouse } = req.body;

    await query(
      'UPDATE profiles SET full_name = ?, default_warehouse = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [full_name, default_warehouse, payload.userId]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;

