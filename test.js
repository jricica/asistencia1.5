import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Función principal
async function seedData() {
  try {
    // 1. Crear profesores
    const { data: teachers, error: teacherError } = await supabase
      .from('users')
      .insert([
        {
          name: 'Beatriz Salazar',
          email: 'beatriz@school.edu',
          password: '123456',
          recoveryWord: 'rosa',
          role: 'teacher',
        },
        {
          name: 'José Cabrera',
          email: 'jose@school.edu',
          password: '123456',
          recoveryWord: 'estrella',
          role: 'teacher',
        },
      ])
      .select();
    if (teacherError) throw teacherError;

    // 2. Crear niveles
    const { data: levels, error: levelError } = await supabase
      .from('levels')
      .insert([
        { name: 'Básico', description: 'Nivel básico general' },
        { name: 'Diversificado', description: 'Nivel medio superior' },
      ])
      .select();
    if (levelError) throw levelError;

    // 3. Crear grados
    const { data: grades, error: gradeError } = await supabase
      .from('grades')
      .insert([
        {
          name: 'Segundo Básico',
          levelId: levels[0].id,
          teacherId: teachers[0].id,
        },
        {
          name: 'Cuarto Diversificado',
          levelId: levels[1].id,
          teacherId: teachers[1].id,
        },
      ])
      .select();
    if (gradeError) throw gradeError;

    // 4. Crear estudiantes
    const studentsData = [
      { name: 'Valeria Gómez', email: 'valeria@student.com', gradeId: grades[0].id },
      { name: 'David Ramírez', email: 'david@student.com', gradeId: grades[0].id },
      { name: 'Isabel Cano', email: 'isabel@student.com', gradeId: grades[0].id },
      { name: 'Diego Castro', email: 'diego@student.com', gradeId: grades[1].id },
      { name: 'Lucía Hernández', email: 'lucia@student.com', gradeId: grades[1].id },
      { name: 'Tomás Morales', email: 'tomas@student.com', gradeId: grades[1].id },
    ];

    const { data: students, error: studentError } = await supabase
      .from('students')
      .insert(studentsData)
      .select();
    if (studentError) throw studentError;

    // 5. Crear registros de asistencia, uniforme y reportes
    const today = new Date();
    const dates = [0, 1, 2].map((d) => {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      return date.toISOString().split('T')[0];
    });

    const attendance = [];
    const uniform = [];
    const reports = [];

    for (const student of students) {
      for (const date of dates) {
        // Asistencia
        attendance.push({
          studentId: student.id,
          date,
          status: ['present', 'absent', 'late'][Math.floor(Math.random() * 3)],
        });

        // Uniforme
        uniform.push({
          studentId: student.id,
          date,
          shoes: Math.random() > 0.3,
          shirt: Math.random() > 0.2,
          pants: Math.random() > 0.1,
          sweater: Math.random() > 0.7,
          haircut: Math.random() > 0.5,
        });

        // Reporte
        reports.push({
          studentId: student.id,
          date,
          report: `El alumno ${student.name} presentó ${['falta de uniforme', 'llegada tarde', 'comportamiento excelente'][Math.floor(Math.random() * 3)]}.`,
          type: ['uniforme', 'asistencia', 'reconocimiento'][Math.floor(Math.random() * 3)],
          sentBy: 'admin@school.edu',
        });
      }
    }

    const { error: aError } = await supabase.from('attendance').insert(attendance);
    if (aError) throw aError;

    const { error: uError } = await supabase.from('uniformcompliance').insert(uniform);
    if (uError) throw uError;

    const { error: rError } = await supabase.from('reports').insert(reports);
    if (rError) throw rError;

    console.log('✅ Todos los datos se insertaron correctamente.');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedData();
