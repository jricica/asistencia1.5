import express from 'express';
import { db } from '../fine/db.js';

const router = express.Router();

// Obtener todos los profesores
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM users WHERE role = 'teacher'");
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener maestros:', err);
    res.status(500).json({ error: 'Error al obtener maestros' });
  }
});

// Agregar un nuevo profesor
router.post('/', async (req, res) => {
  const { name, email, password, recoveryWord } = req.body;

  if (!name || !email || !password || !recoveryWord) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, recoveryWord, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, recoveryWord, 'teacher']
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role: 'teacher'
    });
  } catch (err) {
    console.error('Error al crear maestro:', err);
    res.status(500).json({ error: 'Error al crear maestro' });
  }
});

export default router;
