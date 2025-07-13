import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient.js';

import teacherRoutes from './routes/teachers.js';
import levelsRoutes from './routes/levels.js';
import gradesRoutes from './routes/grades.js';
import studentsRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

// ✅ CORS universal para GitHub Pages + Railway
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://jricica.github.io',
    'http://localhost:5173'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // ✅ Finaliza preflight correctamente
  }

  next();
});

app.use(express.json());

app.use('/api/teachers', teacherRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (_req, res) => {
  res.send('Backend activo desde Railway');
});

const recoveryTokens = new Map();
const TOKEN_EXPIRY_MS = 15 * 60 * 1000;

export const isAuthenticated = async (req, res, next) => {
  const userIdHeader = req.header('authorization');
  const userId = parseInt(userIdHeader, 10);

  if (!userIdHeader || Number.isNaN(userId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    if (error || !data) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();
    if (error || !data) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    res.json({ user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, recoveryWord, role } = req.body;
  if (!name || !email || !password || !role || !recoveryWord) {
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
    if (exists && exists.length) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ name, email, password, recoveryWord, role })
      .select()
      .single();
    if (error) throw error;

    const user = { id: data.id, name, email, role };
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/recover-password', async (req, res) => {
  const { email, recoveryWord } = req.body;
  if (!email || !recoveryWord) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .eq('recoveryWord', recoveryWord)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    const token = uuidv4();
    recoveryTokens.set(token, data.id);
    setTimeout(() => recoveryTokens.delete(token), TOKEN_EXPIRY_MS);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const userId = recoveryTokens.get(token);
  if (!userId) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ password })
      .eq('id', userId);
    if (error) throw error;
    recoveryTokens.delete(token);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/password-recovery', async (req, res) => {
  const { email, recoveryWord } = req.body;
  if (!email || !recoveryWord) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .eq('recoveryWord', recoveryWord)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/password-reset', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const { error, data } = await supabase
      .from('users')
      .update({ password })
      .eq('email', email)
      .select('id')
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/users', isAuthenticated, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/user/:email', isAuthenticated, async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

if (IS_DEV) {
  app.get('/api/debug/users', async (_req, res) => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en modo debug' });
    }
  });
}
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir rutas no-API al index.html de React
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
