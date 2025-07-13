// routes/attendance.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Obtener asistencia por fecha
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const day = date || new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("attendance")
      .select("id,date,status,students(name)")
      .eq("date", day);
    if (error) throw error;
    const rows = data.map(a => ({
      id: a.id,
      student: a.students?.name || null,
      date: a.date,
      status: a.status,
    }));
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
    const rows = students.map((student) => ({
      studentId: student.id,
      date,
      status: student.status,
      gradeId,
    }));
    const { error } = await supabase.from("attendance").upsert(rows);
    if (error) throw error;

    await Promise.resolve();

    res.status(201).json({ message: "Asistencia registrada con éxito" });
  } catch (err) {
    console.error("Error al registrar asistencia:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
