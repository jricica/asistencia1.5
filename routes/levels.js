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

// Crear nuevo nivel
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO levels (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) {
    console.error('Error al crear nivel:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
