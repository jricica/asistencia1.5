# 🏫 Asistencia Escolar 1.5

Aplicación web para la gestión de asistencia escolar con diferentes roles de usuario. Incluye recuperación de contraseña mediante una palabra secreta y paneles separados para administradores, maestros y estudiantes.

## ✨ Características
- Registro e inicio de sesión de usuarios.
- Roles de **admin**, **teacher** y **student** con rutas protegidas.
- Control de asistencia y verificación de uniforme.
- Gestión de niveles, grados y estudiantes.
- Recuperación y restablecimiento de contraseña por palabra secreta.
- API REST construida con Express y MySQL.
- Interfaz en React + TypeScript con Tailwind.

## 🚀 Tecnologías utilizadas
- **Frontend:** React, JSX (JavaScript) y Tailwind
- **Backend:** Node.js y Express
- **Base de datos:** MySQL
- **Autenticación:** headers personalizados

## 🧰 Estructura del proyecto
```
asistencia1.5/
├── fine/
│   ├── db.js                   # Credenciales de la base de datos
│   └── migrations/            # Scripts SQL para crear las tablas
├── public/
├── src/
│   ├── components/            # Componentes reutilizables
│   ├── context/               # Contexto global de React
│   ├── hooks/                 # Hooks personalizados
│   ├── pages/                 # Páginas del frontend
│   └── lib/                   # Utilidades varias
├── server.js                  # Servidor Express
├── package.json               # Scripts y dependencias
└── README.md
```

## ⚙️ Instalación
1. Clona este repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura tus credenciales de MySQL en `fine/db.js`.
4. Crea la base de datos ejecutando el script `fine/migrations/20250701164618_create_school_schema.sql`.
5. Inicia el backend con `node server.js`.
6. En otra terminal, levanta el frontend con `npm run dev`.
7. Accede a `http://localhost:5173` para usar la aplicación.

El script de migración crea un usuario administrador por defecto (`admin@school.com` / `admin123`).

## 📜 Scripts disponibles
- `npm run dev` &mdash; inicia el servidor de desarrollo de Vite.
- `npm run build` &mdash; genera la versión de producción del frontend.
- `npm run preview` &mdash; sirve la aplicación construida.
- `npm run lint` &mdash; ejecuta ESLint sobre el código.

## 📂 Producción
Para un despliegue en producción ejecuta `npm run dev` y sirve los archivos resultantes del directorio `dist`. El servidor Express puede correr de manera independiente ejecutando `node server.js`.

