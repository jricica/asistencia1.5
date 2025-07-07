import { Router } from 'express';
import { db } from '../fine/db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE role = 'teacher'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
