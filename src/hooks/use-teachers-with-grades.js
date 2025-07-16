import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachersWithGrades(levelid) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachersWithGrades = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("grades")
        .select("id, name, levelid, teacher:users(id, name, email)")
        .not("teacherid", "is", null); // Only grades with teacher assigned

      if (levelid) {
        query = query.eq("levelid", levelid);
      }

      const { data, error } = await query;

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      // Agrupar por teacher
      const grouped = {};

      data.forEach((grade) => {
        const teacher = grade.teacher;
        if (!teacher) return;

        if (!grouped[teacher.id]) {
          grouped[teacher.id] = {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            grades: [],
          };
        }

        grouped[teacher.id].grades.push({
          id: grade.id,
          name: grade.name,
        });
      });

      setTeachers(Object.values(grouped));
      setLoading(false);
    };

    fetchTeachersWithGrades();
  }, [levelid]);

  return { teachers, loading, error };
}
