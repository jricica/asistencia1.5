// routes/students.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Obtener todos los estudiantes
router.get("/", async (req, res) => {
  try {
    const gradeId = req.query.gradeId;
    let query = supabase
      .from("students")
      .select("id,name,email,gradeId,grades(name)");
    if (gradeId) query = query.eq("gradeId", gradeId);
    const { data, error } = await query;
    if (error) throw error;
    const formatted = data.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      gradeId: s.gradeId,
      grade: s.grades?.name || null,
    }));
    res.json(formatted);
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
    const { data, error } = await supabase
      .from('students')
      .insert({ name, email: email || null, gradeId })
      .select('id, name, email, gradeId')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("Error al crear estudiante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;