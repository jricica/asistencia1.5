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

// ✅ Marcar asistencia para múltiples estudiantes
router.post("/", async (req, res) => {
  const { gradeId, date, students } = req.body;

  if (!gradeId || !date || !Array.isArray(students)) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  try {
    const insertPromises = students.map((student) =>
    db.query(
        `INSERT INTO attendance (studentId, date, status) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [student.id, date, student.status]
    )
    );


    await Promise.all(insertPromises);

    res.status(201).json({ message: "Asistencia registrada con éxito" });
  } catch (err) {
    console.error("Error al registrar asistencia:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
