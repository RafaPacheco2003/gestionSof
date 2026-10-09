# 🚀 Manteni+ Escolar - Sistema de Gestión de Mantenimiento

Sistema web para la gestión de mantenimiento en instituciones educativas.

---

## ✨ Historias de Usuario Implementadas

### ✅ US-01: Registro de Usuarios
Como **usuario nuevo**, quiero **registrarme en la plataforma**, para **poder crear solicitudes de mantenimiento**.

**Características:**
- Formulario completo de registro
- Validación exhaustiva de datos
- Contraseñas cifradas con bcrypt
- Login automático después del registro

### ✅ US-02: Inicio de Sesión
Como **usuario registrado**, quiero **iniciar sesión con mi nombre y contraseña**, para **acceder a la plataforma**.

**Características:**
- Autenticación segura con JWT
- Cookies httpOnly
- Dashboard personalizado
- Función de cerrar sesión

---

## 🎯 Funcionalidades Principales

### 🔐 Autenticación y Seguridad
- ✅ Registro de usuarios con validaciones completas
- ✅ Login con verificación de credenciales
- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT para manejo de sesiones (válido 7 días)
- ✅ Cookies httpOnly para seguridad
- ✅ Logout con invalidación de tokens
- ✅ Mensajes de error genéricos (previene enumeración)

### 📊 Dashboard
- ✅ Vista personalizada con nombre del usuario
- ✅ Estadísticas de mantenimiento
- ✅ Gráficos de solicitudes por estado
- ✅ Acciones rápidas
- ✅ Lista de solicitudes recientes
- ✅ Interfaz responsive

### ✅ Validaciones Implementadas
- Todos los campos obligatorios
- Nombre único (no duplicados)
- Teléfono: exactamente 10 dígitos numéricos
- Correo: formato válido de email
- Contraseña: mínimo 8 caracteres
- Contraseñas coincidentes en registro

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework de React con App Router
- **React 19** - Librería de UI
- **TypeScript 5.7** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Lucide React** - Iconos modernos

### Backend
- **Next.js API Routes** - Backend integrado
- **bcryptjs** - Hash seguro de contraseñas
- **jose** - Generación y verificación de JWT
- **zod** - Validación de schemas y datos

---

## 📦 Instalación

### Opción 1: Desarrollo Local

#### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

#### Pasos de Instalación

```bash
# 1. Clonar o navegar al proyecto
cd gestiondeSoftware

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Opción 2: Docker (Producción) 🐳

#### Prerrequisitos
- Docker 20.10+
- Docker Compose 2.0+

#### Deployment Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env.production

# 2. Iniciar con Docker Compose
docker-compose up -d

# 3. Verificar
docker-compose ps

# Acceder: http://localhost:3000
```

**Guías detalladas:**
- 🚀 [Quick Start con Docker](./QUICK_START_DOCKER.md) - Deploy en 5 minutos
- 📘 [Guía Completa de Docker](./DOCKER_DEPLOYMENT.md) - Configuración avanzada

---

## 🚀 Uso Rápido

### 1. Registro
1. Abre http://localhost:3000
2. Haz click en "Regístrate"
3. Completa el formulario:
   - Nombre: Juan Pérez
   - Teléfono: 9991234567
   - Correo: juan@escuela.com
   - Puesto: Docente
   - Contraseña: Clave1234
4. Haz click en "Crear cuenta"
5. Serás redirigido automáticamente al dashboard

### 2. Inicio de Sesión
1. Ingresa tu nombre: Juan Pérez
2. Ingresa tu contraseña: Clave1234
3. Haz click en "Iniciar sesión"
4. Accederás al dashboard

### 3. Cerrar Sesión
1. Haz click en "Cerrar sesión" en el menú lateral
2. Volverás a la pantalla de login

---

## 📚 Documentación

- **[API Documentation](./API_DOCUMENTATION.md)** - Documentación completa de la API
- **[Guía de Pruebas](./GUIA_PRUEBAS.md)** - Guía para probar todas las funcionalidades
- **[Estructura del Proyecto](./ESTRUCTURA_PROYECTO.md)** - Arquitectura y organización del código

---

## 🔌 API Endpoints

### Registro
```http
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "telefono": "9991234567",
  "correo": "juan@escuela.com",
  "puesto": "Docente",
  "contrasena": "Clave1234"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "contrasena": "Clave1234"
}
```

### Logout
```http
POST /api/auth/logout
Cookie: auth-token=<token>
```

---

## 📂 Estructura del Proyecto

```
gestiondeSoftware/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Endpoint de login
│   │   │   └── logout/route.ts     # Endpoint de logout
│   │   └── usuarios/route.ts       # Endpoint de registro
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                    # Dashboard + Auth
├── lib/
│   ├── auth.ts                     # Utilidades de autenticación
│   ├── db.ts                       # Base de datos en memoria
│   ├── types.ts                    # Tipos TypeScript
│   └── validations.ts              # Schemas de validación
├── components/                     # Componentes reutilizables
├── public/                         # Archivos estáticos
└── [documentación]                 # Archivos .md
```

---

## ✅ Criterios de Aceptación Cumplidos

### US-01: Registro
- ✅ Todos los campos son obligatorios
- ✅ Nombre único validado
- ✅ Teléfono: solo números, 10 dígitos
- ✅ Correo con formato válido
- ✅ Contraseña: mínimo 8 caracteres
- ✅ Contraseña guardada cifrada
- ✅ Respuesta no incluye contraseña
- ✅ Códigos HTTP correctos (201, 400, 409, 500)

### US-02: Inicio de Sesión
- ✅ Validación de credenciales
- ✅ Mensaje genérico para errores de login
- ✅ Acceso al dashboard tras login exitoso
- ✅ Función de cerrar sesión
- ✅ Redirección a login tras logout
- ✅ Dashboard personalizado con datos del usuario

---

## 🧪 Pruebas

### Ejecutar en desarrollo
```bash
npm run dev
```

### Compilar para producción
```bash
npm run build
```

### Ejecutar en producción
```bash
npm start
```

---

## 🔒 Seguridad

### Implementado ✅
- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con algoritmo HS256
- Cookies httpOnly (no accesibles desde JavaScript)
- Validación exhaustiva de entrada con Zod
- Mensajes de error genéricos (previene enumeración de usuarios)
- Secure cookies en producción

### Recomendaciones para Producción
- Usar variables de entorno para `JWT_SECRET`
- Implementar rate limiting
- Agregar HTTPS
- Base de datos persistente (PostgreSQL, MongoDB)
- Implementar refresh tokens
- Logs de auditoría

---

## 📊 Estado del Proyecto

### ✅ Completado
- Sistema de autenticación completo
- Validaciones exhaustivas
- Dashboard funcional
- Interfaz responsive
- Documentación completa

### 🚧 Por Implementar
- Persistencia en base de datos real
- Recuperación de contraseña
- Verificación de email
- Roles de usuario
- Gestión de solicitudes de mantenimiento (US-03+)
- Sistema de seguimiento
- Reportes

---

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Las próximas historias de usuario incluirán:
- US-03: Creación de solicitudes de mantenimiento
- US-04: Asignación de solicitudes
- US-05: Seguimiento de estado
- US-06: Generación de reportes

---

## 📝 Notas Importantes

### Base de Datos
⚠️ Actualmente el sistema usa una **base de datos en memoria** (archivo `lib/db.ts`). 

Los datos se perderán al reiniciar el servidor. Esto es solo para desarrollo y demostración.

**Para producción**, debes reemplazarlo con una base de datos persistente:
- PostgreSQL + Prisma
- MongoDB + Mongoose
- MySQL + TypeORM

### Variables de Entorno
Crea un archivo `.env.local` para configuraciones:

```env
JWT_SECRET=tu-clave-secreta-muy-segura-aqui
NODE_ENV=production
```

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisa la [Guía de Pruebas](./GUIA_PRUEBAS.md)
2. Consulta la [Documentación de la API](./API_DOCUMENTATION.md)
3. Revisa la [Estructura del Proyecto](./ESTRUCTURA_PROYECTO.md)

---

## 🎉 ¡Listo para Deployar!

Tu aplicación **Manteni+ Escolar** está completamente dockerizada y lista para producción.

### 📦 Archivos Docker Incluidos

```
📁 gestiondeSoftware/
├── 🐳 Dockerfile                  # Build multi-stage optimizado
├── 🐳 docker-compose.yml          # Orquestación de servicios
├── 🐳 .dockerignore               # Optimización de build
├── 📝 .env.example                # Template de variables
├── 📂 scripts/
│   ├── docker-build.sh            # Build de imagen
│   ├── docker-run.sh              # Ejecutar contenedor
│   └── docker-deploy.sh           # Deploy completo automatizado
├── 📂 .github/workflows/
│   ├── ci.yml                     # Tests automáticos
│   ├── docker-build.yml           # Build y push a registry
│   └── deploy.yml                 # Deploy a producción
└── 📚 Documentación/
    ├── QUICK_START_DOCKER.md      # ⚡ Deploy en 5 minutos
    ├── DOCKER_DEPLOYMENT.md       # 📘 Guía completa
    ├── DEPLOYMENT_SUMMARY.md      # 📊 Resumen ejecutivo
    └── COMANDOS_DOCKER.md         # 🔧 Referencia rápida
```

### 🚀 Deploy en 3 Comandos

```bash
cp .env.example .env.production
docker-compose up -d
curl http://localhost:3000
```

### 📚 Guías Disponibles

| Guía | Descripción | Tiempo |
|------|-------------|--------|
| [Quick Start Docker](./QUICK_START_DOCKER.md) | Deploy rápido y simple | 5 min |
| [Docker Deployment](./DOCKER_DEPLOYMENT.md) | Configuración avanzada | 30 min |
| [Comandos Docker](./COMANDOS_DOCKER.md) | Referencia de comandos | - |
| [Deployment Summary](./DEPLOYMENT_SUMMARY.md) | Resumen ejecutivo | 10 min |

---

## 📄 Licencia

Este proyecto es parte del sistema de gestión de mantenimiento escolar.

---

## 🎉 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Abrir navegador
open http://localhost:3000

# ¡Listo para usar! 🚀
```

---

**Manteni+ Escolar** - Gestión simple y eficiente de mantenimiento institucional.
# gestionSof
