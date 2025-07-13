import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Obtener todos los profesores
router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'teacher');
    if (error) throw error;
    res.json(data);
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
    const { data: exists, error: existsErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);
    if (existsErr) throw existsErr;
    if (exists && exists.length > 0) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ name, email, password, recoveryWord, role: 'teacher' })
      .select('id, name, email, role')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error al crear maestro:', err);
    res.status(500).json({ error: 'Error al crear maestro' });
  }
});

export default router;
