import useTeachersWithGrades from "@/hooks/use-teachers-with-grades";

export default function TeachersGrades({ levelid }) {
  const { teachers, loading, error } = useTeachersWithGrades(levelid);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {teachers.map((teacher) => (
        <div key={teacher.id} className="mb-4">
          <h2 className="font-bold">{teacher.name}</h2>
          <ul className="pl-4 list-disc">
            {teacher.grades.map((grade) => (
              <li key={grade.id}>{grade.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
