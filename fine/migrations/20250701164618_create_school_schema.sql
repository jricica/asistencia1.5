-- Create Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Levels table
CREATE TABLE levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Create Grades table
CREATE TABLE grades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  levelId INTEGER NOT NULL,
  teacherId INTEGER,
  FOREIGN KEY (levelId) REFERENCES levels(id),
  FOREIGN KEY (teacherId) REFERENCES users(id)
);

-- Create Students table
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  gradeId INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gradeId) REFERENCES grades(id)
);

-- Create Attendance table
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);

-- Create UniformCompliance table
CREATE TABLE uniformCompliance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  date DATE NOT NULL,
  item TEXT NOT NULL CHECK (item IN ('shoes', 'shirt', 'pants', 'sweater', 'haircut', 'other')),
  compliant BOOLEAN NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);

-- Create Reports table
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('uniform', 'general')),
  message TEXT NOT NULL,
  sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  teacherId INTEGER NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (teacherId) REFERENCES users(id)
);

-- Create Settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES ('attendanceStartTime', '08:00');
INSERT INTO settings (key, value) VALUES ('attendanceEndTime', '09:00');

-- Insert default admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@school.com', 'admin123', 'admin');