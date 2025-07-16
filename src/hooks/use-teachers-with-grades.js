import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachersWithGrades() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/teachers-with-grades');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setError(null);
          return;
        }
      } catch (_) {
        // Ignored - fallback to Supabase
      }

      try {
        const { data: grades, error: supaErr } = await supabase
          .from('grades')
          .select('id, name, teacherId, levelId, teacher:users(id, name, email)');
        if (supaErr) throw supaErr;

        const grouped = {};
        for (const g of grades || []) {
          if (!g.teacher) continue;
          if (!grouped[g.teacher.id]) {
            grouped[g.teacher.id] = {
              id: g.teacher.id,
              name: g.teacher.name,
              email: g.teacher.email,
              grades: [],
            };
          }
          grouped[g.teacher.id].grades.push({ id: g.id, name: g.name, teacherId: g.teacherId, levelId: g.levelId });
        }
        setData(Object.values(grouped));
        setError(null);
      } catch (err) {
        setError(err.message || 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

