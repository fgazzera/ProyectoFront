# Proyecto final · Taller Web

Aplicación completa (frontend + backend) para la gestión de usuarios, desarrollada como trabajo final siguiendo las consignas del PDF **Prácticos Taller Web**. Incluye login, rutas públicas/privadas, formularios con validaciones avanzadas, consumo de API propia y estilos con Material UI.

## Requisitos cubiertos
- Autenticación con mantenimiento del estado en `localStorage`.
- Rutas públicas (`/login`) y privadas (`/usuarios`, `/usuarios/:id`) protegidas por contexto.
- Uso extensivo de componentes, hooks, context, `react-hook-form`, Material UI y React Router.
- Llamadas HTTP GET/POST/PUT/DELETE contra un backend real (FastAPI + PostgreSQL).
- Formulario principal con campos condicionales (género “Otro” despliega texto libre) y `TextField` tipo fecha.
- Validaciones de negocio: nombre con capitalización automática, teléfonos de 10 dígitos sin 0 inicial, emails restringidos a dominios conocidos (`gmail.com`, `hotmail.com`, `outlook.com`, `yahoo.com`, `live.com`).
- Listado principal con tarjetas, sección de usuarios administradores (API externa) y formulario ocultable.

## Arquitectura
```
proyecto-final-react/
├─ src/                 # Frontend Vite + React + MUI
│  ├─ pages/Users.jsx   # ABM + validaciones + secciones
│  ├─ pages/UserDetail  # Edición con redirección post-guardado
│  ├─ context/          # AuthProvider + hook
│  └─ constants/        # Reglas compartidas (género, regex, formatos)
├─ backend/             # FastAPI + SQLAlchemy + Pydantic
│  ├─ app/models.py     # User con género, género personalizado y nacimiento
│  ├─ app/schemas.py    # Validaciones (regex, fechas, capitalización)
│  └─ Dockerfile        # Imagen de la API
├─ docker-compose.yml   # Orquesta API + Postgres
└─ .env.example         # URL del backend para el frontend
```

### Backend (carpeta `backend/`)
- FastAPI + SQLAlchemy + Pydantic v2.
- Modelo `User` con columnas: `id`, `name`, `email`, `phone`, `website`, `gender`, `gender_other`, `birthdate`, `created_at`.
- Validaciones aplicadas en `schemas.py` (regex, dominios permitidos, fechas históricas, obligatoriedad de género personalizado).
- Endpoints REST:
  - `GET /api/users` y `GET /api/users/{id}`
  - `POST /api/users`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`
  - `GET /api/health`
- CORS configurado para `http://localhost:5173`.

> **Migración de base ya creada:** si ya tenías la tabla `users`, agregá las nuevas columnas o recrea la tabla. Ejemplo rápido:
> ```sql
> ALTER TABLE users ADD COLUMN gender VARCHAR(20) NOT NULL DEFAULT 'femenino';
> ALTER TABLE users ADD COLUMN gender_other VARCHAR(120);
> ALTER TABLE users ADD COLUMN birthdate DATE NOT NULL DEFAULT '2000-01-01';
> ```
> Luego ajusta los valores reales y quita los defaults si no los necesitás.

### Frontend (carpeta `src/`)
- `Users.jsx`: muestra usuarios internos, administradores externos y un formulario plegable con select de género, campo condicional “Describe el género” y fecha de nacimiento.
- `UserDetail.jsx`: edición con las mismas reglas, eliminación y redirección automática a `/usuarios` al guardar.
- `constants/userFields.js`: opciones de género, regex de email/teléfono y helpers para formatear género/birthdate.
- `AuthContext` mantiene sesión y `ProtectedRoute` asegura las rutas privadas.

## Puesta en marcha

### 1. Variables de entorno
```bash
cp .env.example .env
# (Opcional) backend/.env para correr FastAPI sin Docker
```

### 2. Backend + base de datos
```bash
docker compose up --build
```
- Postgres: `localhost:5432`
- API FastAPI: `http://localhost:8000` (health: `/api/health`)

### 3. Frontend
```bash
npm install
npm run dev
```
Abrí [http://localhost:5173](http://localhost:5173). El frontend usa `VITE_API_URL` para apuntar al backend.

## Scripts útiles
- `npm run dev` · entorno de desarrollo React.
- `npm run build` · build de producción del frontend.
- `docker compose up --build` · levanta API + Postgres con las últimas dependencias.

## Próximos pasos sugeridos
1. Agregar tests (unitarios y/o e2e) para validar las reglas nuevas.
2. Construir imágenes separadas y servir el frontend estático desde Nginx en el mismo Compose.
3. Implementar autenticación real (tokens) y proteger los endpoints del backend.

---
**Autores:** Facundo Gazzera y Tomás Garbellotto · Taller Web 2025.
