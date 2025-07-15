
CREATE TABLE public.attendance (
  id integer NOT NULL DEFAULT nextval('attendance_id_seq'::regclass),
  studentId integer NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['present'::text, 'absent'::text, 'late'::text])),
  CONSTRAINT attendance_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_studentId_fkey FOREIGN KEY (studentId) REFERENCES public.students(id)
);
CREATE TABLE public.grades (
  id integer NOT NULL DEFAULT nextval('grades_id_seq'::regclass),
  name character varying NOT NULL,
  levelId integer NOT NULL,
  teacherId integer,
  CONSTRAINT grades_pkey PRIMARY KEY (id),
  CONSTRAINT grades_teacherId_fkey FOREIGN KEY (teacherId) REFERENCES public.users(id),
  CONSTRAINT grades_levelId_fkey FOREIGN KEY (levelId) REFERENCES public.levels(id)
);
CREATE TABLE public.levels (
  id integer NOT NULL DEFAULT nextval('levels_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  CONSTRAINT levels_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reports (
  id integer NOT NULL DEFAULT nextval('reports_id_seq'::regclass),
  studentId integer NOT NULL,
  date date NOT NULL,
  report text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['asistencia'::text, 'uniforme'::text, 'reconocimiento'::text])),
  sentBy text NOT NULL,
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_studentId_fkey FOREIGN KEY (studentId) REFERENCES public.students(id)
);
CREATE TABLE public.settings (
  id integer NOT NULL DEFAULT nextval('settings_id_seq'::regclass),
  key character varying NOT NULL UNIQUE,
  value text NOT NULL,
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.students (
  id integer NOT NULL DEFAULT nextval('students_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying,
  gradeId integer NOT NULL,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_gradeId_fkey FOREIGN KEY (gradeId) REFERENCES public.grades(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teachers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.teachers_created (
  id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teachers_created_pkey PRIMARY KEY (id)
);
CREATE TABLE public.uniformcompliance (
  id integer NOT NULL DEFAULT nextval('uniformcompliance_id_seq'::regclass),
  studentId integer NOT NULL,
  date date NOT NULL,
  shoes boolean,
  shirt boolean,
  pants boolean,
  sweater boolean,
  haircut boolean,
  CONSTRAINT uniformcompliance_pkey PRIMARY KEY (id),
  CONSTRAINT uniformcompliance_studentId_fkey FOREIGN KEY (studentId) REFERENCES public.students(id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  recoveryWord character varying NOT NULL,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['admin'::character varying, 'teacher'::character varying, 'student'::character varying]::text[])),
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);