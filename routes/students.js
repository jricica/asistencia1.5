// routes/students.js
import express from "express";
import { db } from "../fine/db.js";

const router = express.Router();

// Obtener todos los estudiantes
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT students.id, students.name, students.email, grades.name AS grade
       FROM students
       JOIN grades ON students.gradeId = grades.id`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener estudiantes:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear nuevo estudiante
router.post("/", async (req, res) => {
  const { name, email, gradeId } = req.body;
  if (!name || !gradeId) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO students (name, email, gradeId) VALUES (?, ?, ?)",
      [name, email || null, gradeId]
    );
    res.status(201).json({ id: result.insertId, name, email, gradeId });
  } catch (err) {
    console.error("Error al crear estudiante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;