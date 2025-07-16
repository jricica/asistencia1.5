import { useEffect, useState } from "react";
import useTeachersWithGrades from "@/hooks/use-teachers-with-grades";
import { supabase } from "../../supabaseClient";

export default function TeachersGrades() {
  const { data, loading, error } = useTeachersWithGrades();
  const [levels, setLevels] = useState([]);
  const [selected, setSelected] = useState("all");

  useEffect(() => {
    const fetchLevels = async () => {
      const { data: lvls } = await supabase
        .from("levels")
        .select("id, name");
      setLevels(lvls || []);
    };
    fetchLevels();
  }, []);

  const filtered =
    selected === "all"
      ? data
      : (data || []).filter((t) =>
          t.grades.some((g) => String(g.levelId) === String(selected))
        );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!filtered || filtered.length === 0) return <p>No hay datos.</p>;

  return (
    <div>
      {levels.length > 0 && (
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mb-4 border px-2 py-1"
        >
          <option value="all">Todos los niveles</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      )}
      <ul>
        {filtered.map((teacher) => (
          <li key={teacher.id} className="mb-4">
            <p className="font-semibold">
              {teacher.name} ({teacher.email})
            </p>
            <ul className="ml-4 list-disc">
              {teacher.grades.map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
