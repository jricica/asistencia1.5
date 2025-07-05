import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Obtener todos los usuarios
app.get('/api/users', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Registrar nuevo usuario
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
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );

    const user = { id: result.insertId, name, email, role };
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Error en /api/signup:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ✅ Login de usuario
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Error en /api/login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ✅ Obtener usuario por email
app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error en /api/user/:email:', err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
