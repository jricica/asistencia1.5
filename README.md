# 🏫 Asistencia Escolar 1.5

Sistema web educativo con control de asistencia, roles por usuario (`admin`, `teacher`, `student`) y recuperación de contraseña mediante palabra clave secreta.

---

## 🚀 Tecnologías utilizadas

- 🟦 **Frontend:** React + TypeScript + JSX
- 🌐 **Backend:** Node.js + Express 
- 🐬 **Base de datos:** MySQL
- 🧠 **Autenticación:** Custom basada en headers
- 🔐 **Recuperación:** Palabra secreta

---

## 🧰 Estructura del proyecto

asistencia1.5/
├── fine/
│ └── db.js # Conexión a la base de datos
├── public/
├── src/
│ ├── pages/
│ │ ├── login.tsx
│ │ ├── signup.tsx
│ │ ├── dashboard.jsx
│ │ ├── recover-password.tsx
│ │ └── reset-password.tsx
│ └── components/
│ └── ui/ # Botones, inputs, cards...
├── server.js # Servidor Express
└── README.md # Este archivo