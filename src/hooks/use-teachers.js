import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data: userTeachers, error: userErr } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("role", "teacher");

      const { data: teacherExtra, error: teacherErr } = await supabase
        .from("teachers")
        .select("id, levelid");

      if (userErr || teacherErr) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching teacher data:", userErr || teacherErr);
        }
        setTeachers([]);
        setLoading(false);
        return;
      }

      const extraMap = Object.fromEntries(
        (teacherExtra || []).map((t) => [t.id, t.levelid])
      );

      const merged = (userTeachers || []).map((u) => ({
        ...u,
        levelid: extraMap[u.id] ?? null,
      }));

      setTeachers(merged);
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, setTeachers };
}
