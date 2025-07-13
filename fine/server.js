import express from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints

// Obtener todos los usuarios
app.get('/api/users', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error en /api/users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Registrar nuevo usuario
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const allowedRoles = ['teacher', 'student', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
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
      .insert({ name, email, password, role })
      .select('id, name, email, role')
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, user: data });
  } catch (err) {
    console.error('Error en /api/signup:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('POST /api/login recibido con:', { email, password: password ? '******' : undefined });

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    console.warn('Datos faltantes o inválidos en login');
    return res.status(400).json({ error: 'Faltan campos o son inválidos' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      console.log('Credenciales incorrectas para usuario:', email);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    console.log('Login exitoso para usuario:', email);
    res.json({ success: true, user: data });
  } catch (err) {
    console.error('Error en /api/login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener usuario por email
app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error en /api/user/:email:', err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Servir archivos estáticos del frontend en /asistencia1.5
app.use('/asistencia1.5', express.static(path.join(__dirname, 'dist')));

// Redirigir rutas no API bajo /asistencia1.5 a index.html (SPA)
app.get(/^\/asistencia1\.5\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
