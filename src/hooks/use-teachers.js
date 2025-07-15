import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role") // selecciona solo campos necesarios
        .eq("role", "teacher");

      if (error) {
        console.error("Error fetching teacher data:", error);
        setTeachers([]); // asegúrate de limpiar si hay error
      } else {
        setTeachers(data || []);
      }

      setLoading(false);
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, setTeachers };
}
