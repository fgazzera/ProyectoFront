# Proyecto Final - Taller Web (React)

## 📋 Descripción
Aplicación web desarrollada en **React** como proyecto final de la materia **Taller Web**. 
El sistema simula una **Gestión de Usuarios**, cumpliendo con todos los requisitos del trabajo final:
- Rutas públicas y privadas.
- Login completo con usuario y contraseña.
- Mantenimiento del estado de sesión.
- Llamadas HTTP (GET, POST, PUT) a un backend.
- Múltiples componentes y servicios.
- Formulario con validaciones.
- Estilos con Material UI.

---

## 🚀 Tecnologías utilizadas
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Material UI](https://mui.com/)

---

## 🧱 Estructura del proyecto
```
proyecto-final-react/
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ routes/
│  │  ├─ Router.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Users.jsx
│  │  └─ UserDetail.jsx
│  ├─ components/
│  │  └─ Navbar.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx
│  └─ services/
│     └─ api.js
```

---

## 🧩 Funcionalidades principales
### 🔐 Autenticación
- Login con validación de email y contraseña.
- Persistencia del usuario en `localStorage`.
- Cierre de sesión con limpieza de estado.

### 🌐 Rutas
- `/login` → ruta pública.
- `/usuarios` → lista de usuarios (privada).
- `/usuarios/:id` → detalle y edición de usuario (privada).

### 💾 API
- Conexión con [JSONPlaceholder](https://jsonplaceholder.typicode.com/users).
- Métodos utilizados:
  - `GET /users` → obtener lista de usuarios.
  - `POST /users` → crear un nuevo usuario (simulado).
  - `PUT /users/:id` → editar usuario (simulado).

### 🧠 Contexto global
- `AuthContext` maneja el estado de sesión (login/logout) y lo comparte entre componentes.

### 🎨 Estilo
- Interfaz basada en **Material UI**, con diseño limpio, responsivo y moderno.

---

## ⚙️ Instalación y ejecución
### 1️⃣ Clonar el proyecto
```bash
git clone https://github.com/usuario/proyecto-final-react.git
cd proyecto-final-react
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Ejecutar en entorno de desarrollo
```bash
npm run dev
```
Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Validaciones
Todos los formularios (login, creación y edición de usuario) implementan validaciones con `react-hook-form`:
- Campos requeridos.
- Formato de email válido.
- Contraseña mínima de 4 caracteres.

---

## 🔧 Interceptores de Axios
Cada request HTTP pasa por un **interceptor** que:
- Registra en consola la solicitud (método y URL).
- Maneja errores de respuesta.

---

## 🧑‍💻 Autores
**Facundo Gazzera y Tomas Garbellotto** – Proyecto final de Taller Web (React) – 2025.
