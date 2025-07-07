// routes/grades.js
import express from "express";
import { db } from "../fine/db.js";

const router = express.Router();

// Obtener todas las secciones/grados
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT grades.id, grades.name, grades.levelId, grades.teacherId,
              levels.name AS levelName, users.name AS teacherName
       FROM grades
       JOIN levels ON grades.levelId = levels.id
       LEFT JOIN users ON grades.teacherId = users.id`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener grados:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener grado por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT grades.id, grades.name, grades.levelId, grades.teacherId,
              levels.name AS levelName, users.name AS teacherName
       FROM grades
       JOIN levels ON grades.levelId = levels.id
       LEFT JOIN users ON grades.teacherId = users.id
       WHERE grades.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener grado:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear nuevo grado
router.post("/", async (req, res) => {
  const { name, levelId, teacherId } = req.body;
  if (!name || !levelId) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO grades (name, levelId, teacherId) VALUES (?, ?, ?)",
      [name, levelId, teacherId || null]
    );
    res.status(201).json({ id: result.insertId, name, levelId, teacherId });
  } catch (err) {
    console.error("Error al crear grado:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
