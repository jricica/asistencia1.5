import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "teacher");
      if (!error) setTeachers(data || []);
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  return { teachers, loading, setTeachers };
}
