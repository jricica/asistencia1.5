-- Create Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  recoveryword VARCHAR(255) NOT NULL,
  role VARCHAR(10) CHECK (role IN ('admin', 'teacher', 'student')) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Teachers table (for teachers added manually)
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Levels table
CREATE TABLE levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Create Grades table
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  levelid INT NOT NULL,
  teacherid INT,
  FOREIGN KEY (levelid) REFERENCES levels(id),
  FOREIGN KEY (teacherid) REFERENCES users(id)
);

-- Create Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  gradeid INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gradeid) REFERENCES grades(id)
);

-- Create Attendance table
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  studentid INT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentid) REFERENCES students(id)
);

-- Create UniformCompliance table
CREATE TABLE uniformCompliance (
  id SERIAL PRIMARY KEY,
  studentid INT NOT NULL,
  date DATE NOT NULL,
  item VARCHAR(20) CHECK (item IN ('shoes', 'shirt', 'pants', 'sweater', 'haircut', 'other')) NOT NULL,
  compliant BOOLEAN NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentid) REFERENCES students(id)
);

-- Create Reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  studentid INT NOT NULL,
  type VARCHAR(10) CHECK (type IN ('uniform', 'general')) NOT NULL,
  message TEXT NOT NULL,
  sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  teacherid INT NOT NULL,
  FOREIGN KEY (studentid) REFERENCES students(id),
  FOREIGN KEY (teacherid) REFERENCES users(id)
);

-- Create Settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES ('attendanceStartTime', '08:00');
INSERT INTO settings (key, value) VALUES ('attendanceEndTime', '09:00');

-- Insert default admin user
INSERT INTO users (name, email, password, recoveryword, role)
VALUES ('Admin', 'admin@school.com', 'admin123', 'default', 'admin');
