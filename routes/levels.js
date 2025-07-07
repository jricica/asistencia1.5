// routes/levels.js
import express from 'express';
import { db } from '../fine/db.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM levels');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener niveles:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
