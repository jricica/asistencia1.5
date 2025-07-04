-- Create Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  recoveryWord VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Levels table
CREATE TABLE levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Create Grades table
CREATE TABLE grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  levelId INT NOT NULL,
  teacherId INT,
  FOREIGN KEY (levelId) REFERENCES levels(id),
  FOREIGN KEY (teacherId) REFERENCES users(id)
);

-- Create Students table
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  gradeId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gradeId) REFERENCES grades(id)
);

-- Create Attendance table
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);

-- Create UniformCompliance table
CREATE TABLE uniformCompliance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  date DATE NOT NULL,
  item ENUM('shoes', 'shirt', 'pants', 'sweater', 'haircut', 'other') NOT NULL,
  compliant BOOLEAN NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);

-- Create Reports table
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  type ENUM('uniform', 'general') NOT NULL,
  message TEXT NOT NULL,
  sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  teacherId INT NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (teacherId) REFERENCES users(id)
);

-- Create Settings table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  `value` TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (`key`, `value`) VALUES ('attendanceStartTime', '08:00');
INSERT INTO settings (`key`, `value`) VALUES ('attendanceEndTime', '09:00');

-- Insert default admin user
INSERT INTO users (name, email, password, recoveryWord, role)
VALUES ('Admin', 'admin@school.com', 'admin123', 'default', 'admin');
