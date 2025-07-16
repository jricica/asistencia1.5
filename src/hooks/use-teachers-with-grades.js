import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachersWithGrades() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachersWithGrades = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("grades")
        .select("id, name, teacher:users(id, name, email)")
        .not("teacherId", "is", null); // Opcional: solo si teacherId no es null

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
  }, []);

  return { teachers, loading, error };
}
