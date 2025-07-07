// routes/attendance.js
import express from "express";
import { db } from "../fine/db.js";

const router = express.Router();

// Obtener asistencia por fecha
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT a.id, s.name AS student, a.date, a.status
       FROM attendance a
       JOIN students s ON a.studentId = s.id
       WHERE a.date = ?`,
      [date || new Date().toISOString().split("T")[0]]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener asistencia:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Marcar asistencia
router.post("/", async (req, res) => {
  const { studentId, date, status } = req.body;
  if (!studentId || !date || !status) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO attendance (studentId, date, status) VALUES (?, ?, ?)",
      [studentId, date, status]
    );
    res.status(201).json({ id: result.insertId, studentId, date, status });
  } catch (err) {
    console.error("Error al registrar asistencia:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;