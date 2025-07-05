// ⚠️ Archivo migrado a JS. No usar este `.ts`.
export type Schema = {
  users: { 
    id?: number, 
    name: string, 
    email: string, 
    password: string, 
    role: 'admin' | 'teacher' | 'student',
    createdAt?: string 
  };
  levels: { 
    id?: number, 
    name: string, 
    description?: string | null 
  };
  grades: { 
    id?: number, 
    name: string, 
    levelId: number,
    teacherId?: number | null
  };
  students: { 
    id?: number, 
    name: string, 
    email?: string | null, 
    gradeId: number,
    createdAt?: string 
  };
  attendance: { 
    id?: number, 
    studentId: number, 
    date: string, 
    status: 'present' | 'absent' | 'late',
    createdAt?: string 
  };
  uniformCompliance: { 
    id?: number, 
    studentId: number, 
    date: string, 
    item: 'shoes' | 'shirt' | 'pants' | 'sweater' | 'haircut' | 'other',
    compliant: boolean,
    createdAt?: string 
  };
  reports: { 
    id?: number, 
    studentId: number, 
    type: 'uniform' | 'general',
    message: string,
    sentAt?: string,
    teacherId: number
  };
  settings: { 
    id?: number, 
    key: string, 
    value: string 
  };
}