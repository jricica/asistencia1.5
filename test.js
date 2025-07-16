import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.test' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function seedData() {
  try {
    // 1. Crear niveles
    const { data: levels, error: levelError } = await supabase
      .from('levels')
      .insert([
        { name: 'Primaria', description: 'Nivel Primaria' },
        { name: 'Secundaria', description: 'Nivel Secundaria' },
        { name: 'Diversificado', description: 'Nivel Diversificado' },
        { name: 'Bachillerato', description: 'Nivel Bachillerato' },
      ])
      .select();
    if (levelError) throw levelError;

    // 2. Crear maestros
    const { data: teachers, error: teacherError } = await supabase
      .from('users')
      .insert([
        { name: 'Carlos Reyes', email: 'carlos@school.com', password: '123456', recoveryWord: 'fuego', role: 'teacher' },
        { name: 'Ana López', email: 'ana@school.com', password: '123456', recoveryWord: 'agua', role: 'teacher' },
        { name: 'Luis Torres', email: 'luis@school.com', password: '123456', recoveryWord: 'tierra', role: 'teacher' },
        { name: 'María Díaz', email: 'maria@school.com', password: '123456', recoveryWord: 'viento', role: 'teacher' },
        { name: 'Esteban Vega', email: 'esteban@school.com', password: '123456', recoveryWord: 'nube', role: 'teacher' },
      ])
      .select();
    if (teacherError) throw teacherError;

    // 3. Crear grados
    const { data: grades, error: gradeError } = await supabase
      .from('grades')
      .insert([
        { name: 'Primero Secundaria', levelid: levels[1].id, teacherid: teachers[0].id },
        { name: 'Segundo Secundaria', levelid: levels[1].id, teacherid: teachers[1].id },
        { name: 'Tercero Secundaria', levelid: levels[1].id, teacherid: teachers[2].id },
        { name: 'Primero Bachillerato', levelid: levels[3].id, teacherid: teachers[3].id },
        { name: 'Segundo Bachillerato', levelid: levels[3].id, teacherid: teachers[4].id },
        { name: 'Tercero Bachillerato', levelid: levels[3].id, teacherid: teachers[0].id },
      ])
      .select();
    if (gradeError) throw gradeError;

    // 4. Crear estudiantes
    let studentsData = [];
    grades.forEach((grade) => {
      for (let i = 1; i <= 10; i++) {
        studentsData.push({
          name: `Estudiante ${i} - ${grade.name}`,
          email: `est${i}${grade.id}@school.com`,
          gradeid: grade.id,
        });
      }
    });

    const { data: students, error: studentError } = await supabase
      .from('students')
      .insert(studentsData)
      .select();
    if (studentError) throw studentError;

    // 5. Insertar asistencia, uniformes, reportes
    const today = new Date();
    const days = [0, 1, 2];
    const attendance = [], uniform = [], reports = [];

    for (const student of students) {
      for (const offset of days) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const iso = date.toISOString().split('T')[0];

        attendance.push({
          studentid: student.id,
          date: iso,
          status: ['present', 'absent', 'late'][Math.floor(Math.random() * 3)],
        });

        uniform.push({
          studentid: student.id,
          date: iso,
          shoes: Math.random() > 0.3,
          shirt: Math.random() > 0.3,
          pants: Math.random() > 0.3,
          sweater: Math.random() > 0.3,
          haircut: Math.random() > 0.3,
        });

        reports.push({
          studentid: student.id,
          date: iso,
          report: `Observación para ${student.name}`,
          type: ['uniforme', 'asistencia', 'reconocimiento'][Math.floor(Math.random() * 3)],
          sentby: teachers[Math.floor(Math.random() * teachers.length)].email,
        });
      }
    }

    const { error: aError } = await supabase.from('attendance').insert(attendance);
    if (aError) throw aError;

    const { error: uError } = await supabase.from('uniformcompliance').insert(uniform);
    if (uError) throw uError;

    const { error: rError } = await supabase.from('reports').insert(reports);
    if (rError) throw rError;

    // 6. Insertar configuración
    const { error: sError } = await supabase.from('settings').insert([
      { key: 'school_year', value: '2025' },
      { key: 'max_absences', value: '5' },
    ]);
    if (sError) throw sError;

    console.log('✅ Datos insertados correctamente');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

seedData();
