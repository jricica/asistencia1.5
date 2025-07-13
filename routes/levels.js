// routes/levels.js
import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('levels').select('*');
    if (error) throw error;
    res.json(data);
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
    const { data, error } = await supabase
      .from('levels')
      .insert({ name, description: description || null })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id, name, description });
  } catch (err) {
    console.error('Error al crear nivel:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
