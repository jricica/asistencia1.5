// routes/grades.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Obtener todas las secciones/grados
router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("grades")
      .select("id,name,levelId,teacherId,levels(name),users(name)");
    if (error) throw error;
    const formatted = data.map(g => ({
      id: g.id,
      name: g.name,
      levelId: g.levelId,
      teacherId: g.teacherId,
      levelName: g.levels?.name || null,
      teacherName: g.users?.name || null
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Error al obtener grados:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener grado por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("grades")
      .select("id,name,levelId,teacherId,levels(name),users(name)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return res.status(404).json({ error: "No encontrado" });
    const grade = {
      id: data.id,
      name: data.name,
      levelId: data.levelId,
      teacherId: data.teacherId,
      levelName: data.levels?.name || null,
      teacherName: data.users?.name || null,
    };
    res.json(grade);
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
    const { data, error } = await supabase
      .from('grades')
      .insert({ name, levelId, teacherId: teacherId || null })
      .select('id, name, levelId, teacherId')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("Error al crear grado:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
