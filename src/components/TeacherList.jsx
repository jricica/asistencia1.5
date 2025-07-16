import useTeachersWithGrades from "@/hooks/use-teachers-with-grades";

export default function TeacherList() {
  const { data, loading, error } = useTeachersWithGrades();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.length === 0) return <p>No hay datos.</p>;

  return (
    <ul>
      {data.map((teacher) => (
        <li key={teacher.id} className="mb-4">
          <p className="font-semibold">{teacher.name}</p>
          <ul className="ml-4 list-disc">
            {teacher.grades.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

