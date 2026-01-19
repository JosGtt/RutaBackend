# 🚀 Sistema SEDEGES - Backend

Backend del Sistema de Gestión de Hojas de Ruta para SEDEGES La Paz.

## 📋 Tecnologías

- Node.js + Express + TypeScript
- PostgreSQL 16
- JWT Authentication
- Bcrypt para passwords
- Winston para logging

## 🔧 Variables de Entorno

Copia `.env.example` a `.env` y configura:

### DATABASE_URL (Recomendado)
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### JWT Secrets
Genera nuevos secretos:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Deploy en Render

### 1. Conectar GitHub
- Ve a [render.com](https://render.com)
- New Web Service
- Conecta este repositorio

### 2. Configuración
```
Name: sedeges-backend
Build Command: npm install && npm run build
Start Command: npm start
```

### 3. Variables de Entorno
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=tu_connection_string_de_neon
JWT_SECRET=genera_uno_nuevo
REFRESH_TOKEN_SECRET=genera_otro
CORS_ORIGINS=https://tu-frontend.vercel.app
```

## 📦 Desarrollo Local

```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

## 🔒 Seguridad

- SSL/TLS en producción
- Rate limiting
- CORS configurado
- Helmet.js headers
- Logs de seguridad
- Validación de inputs

## 📝 Estructura

```
backend/
├── src/
│   ├── config/       # Configuración DB
│   ├── controllers/  # Lógica de negocio
│   ├── routes/       # Rutas API
│   ├── utils/        # Utilidades
│   └── index.ts      # Entry point
├── dist/             # Compilado (git ignored)
└── logs/             # Logs (git ignored)
```

## 🌐 API Endpoints

- `POST /api/auth/login` - Autenticación
- `GET /api/hojas-ruta` - Listar hojas de ruta
- `POST /api/hojas-ruta` - Crear hoja de ruta
- `GET /api/locaciones` - Listar locaciones
- `GET /api/notificaciones` - Notificaciones

## 👥 Usuarios por Defecto

```
admin / admin123  - Administrador
jose / jose       - Desarrollador
user / 2026       - Usuario
```

**⚠️ CAMBIAR PASSWORDS EN PRODUCCIÓN**

## 📞 Soporte

Para problemas o dudas sobre el deploy.
