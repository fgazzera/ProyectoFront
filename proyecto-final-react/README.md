# Proyecto final · Taller Web

Aplicación completa (frontend + backend) para la gestión de usuarios, desarrollada como trabajo final siguiendo las consignas del PDF **Prácticos Taller Web**. Incluye login, rutas públicas/privadas, formularios con validaciones, consumo de API propia y estilos con Material UI.

## Requisitos cubiertos
- Autenticación con mantenimiento del estado en `localStorage`.
- Rutas públicas `/login` y privadas `/usuarios`, `/usuarios/:id` protegidas por contexto.
- Uso extensivo de componentes, hooks, context, `react-hook-form`, Material UI y React Router.
- Llamadas HTTP GET/POST/PUT/DELETE contra un backend real.
- Backend en Python (FastAPI) con base PostgreSQL persistida en Docker Compose.
- Interceptores de Axios para logging y manejo de errores.

## Arquitectura
```
proyecto-final-react/
├─ src/               # Frontend Vite + React + MUI
├─ backend/           # FastAPI + SQLAlchemy + Postgres models
├─ docker-compose.yml # Orquesta API + Base de datos
└─ .env.example       # URL utilizada por el frontend
```

### Backend (carpeta `backend/`)
- FastAPI + SQLAlchemy + Pydantic.
- Modelo `User` con columnas `id`, `name`, `email`, `phone`, `website`, `created_at`.
- Endpoints REST:
  - `GET /api/users` y `GET /api/users/{id}`
  - `POST /api/users`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`
  - `GET /api/health`
- CORS configurado para `http://localhost:5173`.

### Frontend (carpeta `src/`)
- `AuthContext` mantiene sesión y protege rutas (ver `routes/ProtectedRoute.jsx`).
- Página principal `/usuarios` lista los usuarios, permite eliminar y abre el formulario de alta bajo demanda.
- `/usuarios/:id` permite editar y eliminar un usuario existente.
- Login con validaciones y feedback visual usando React Hook Form + MUI.

## Puesta en marcha

### 1. Variables de entorno
Copiá el archivo de ejemplo y ajustá si es necesario.
```bash
cp .env.example .env
# (Opcional) backend/.env para ejecuciones fuera de Docker
```

### 2. Backend + base de datos
```bash
docker compose up --build
```
- Postgres queda disponible en `localhost:5432`.
- FastAPI escucha en `http://localhost:8000` (health: `/api/health`).

### 3. Frontend
```bash
npm install
npm run dev
```
Abrí `http://localhost:5173`. El frontend usa `VITE_API_URL` para hablar con el backend levantado en Docker.

## Scripts útiles
- `npm run dev` · entorno de desarrollo React.
- `npm run build` · build de producción del frontend.
- `docker compose up --build` · levanta API + Postgres con hot reload básico.

## Próximos pasos sugeridos
1. Agregar tests (unitarios o e2e) tanto en el backend como en el frontend.
2. Construir imágenes separadas para desplegar frontend + backend en un mismo Compose.
3. Implementar autenticación real en el backend y proteger los endpoints.

---
**Autores:** Facundo Gazzera y Tomás Garbellotto · Taller Web 2025.
