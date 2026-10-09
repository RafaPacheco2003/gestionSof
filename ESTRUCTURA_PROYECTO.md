# 📁 Estructura del Proyecto - Manteni+ Escolar

## 🏗️ Arquitectura General

```
gestiondeSoftware/
├── app/                          # Aplicación Next.js (App Router)
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts     # POST /api/auth/login
│   │   │   └── logout/
│   │   │       └── route.ts     # POST /api/auth/logout
│   │   └── usuarios/
│   │       └── route.ts         # POST /api/usuarios
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal (Dashboard + Auth)
├── lib/                         # Lógica de negocio y utilidades
│   ├── auth.ts                  # Utilidades de autenticación (JWT, bcrypt)
│   ├── db.ts                    # Base de datos en memoria
│   ├── types.ts                 # Definiciones de tipos TypeScript
│   ├── utils.ts                 # Utilidades generales
│   └── validations.ts           # Schemas de validación con Zod
├── components/                  # Componentes reutilizables
│   └── ui/
│       └── button.tsx
├── public/                      # Archivos estáticos
├── API_DOCUMENTATION.md         # Documentación de la API
├── GUIA_PRUEBAS.md             # Guía de pruebas
├── ESTRUCTURA_PROYECTO.md       # Este archivo
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## 📂 Descripción de Directorios y Archivos

### `/app` - Aplicación Principal

#### `app/page.tsx`
- **Descripción:** Componente principal que contiene toda la lógica de la aplicación
- **Responsabilidades:**
  - Maneja el estado de autenticación
  - Renderiza la pantalla de login/registro
  - Renderiza el dashboard una vez autenticado
  - Gestiona navegación entre secciones
- **Componentes principales:**
  - `Page`: Componente principal
  - `AuthScreen`: Pantalla de autenticación
  - `RequestModal`: Modal para crear solicitudes
  - `Stat`: Tarjeta de estadística
  - `Quick`: Botón de acción rápida

#### `app/layout.tsx`
- **Descripción:** Layout raíz de la aplicación
- **Funcionalidades:**
  - Configuración de metadata
  - Configuración de viewport
  - Iconos y tema
  - Integración con Vercel Analytics

#### `app/globals.css`
- **Descripción:** Estilos globales de la aplicación
- **Incluye:** Variables CSS, estilos de componentes, tema claro/oscuro

### `/app/api` - Backend API Routes

#### `app/api/usuarios/route.ts`
- **Endpoint:** `POST /api/usuarios`
- **Historia de Usuario:** US-01 (Registro)
- **Responsabilidades:**
  - Validar datos de entrada con Zod
  - Verificar que el nombre no esté duplicado
  - Hashear contraseña con bcrypt
  - Crear usuario en la base de datos
  - Retornar datos del usuario (sin contraseña)

#### `app/api/auth/login/route.ts`
- **Endpoint:** `POST /api/auth/login`
- **Historia de Usuario:** US-02 (Login)
- **Responsabilidades:**
  - Validar credenciales de entrada
  - Buscar usuario por nombre
  - Verificar contraseña con bcrypt
  - Generar token JWT
  - Establecer cookie httpOnly
  - Retornar usuario y token

#### `app/api/auth/logout/route.ts`
- **Endpoint:** `POST /api/auth/logout`
- **Historia de Usuario:** US-02 (Logout)
- **Responsabilidades:**
  - Invalidar token de sesión
  - Eliminar cookie auth-token
  - Retornar confirmación

---

## 📚 Descripción de Módulos en `/lib`

### `lib/auth.ts`
**Funciones principales:**
- `hashPassword(password)`: Hashea una contraseña con bcrypt (10 rounds)
- `verifyPassword(password, hash)`: Verifica una contraseña contra su hash
- `generateToken(usuario)`: Genera un JWT válido por 7 días
- `verifyToken(token)`: Verifica y decodifica un JWT
- `toUsuarioResponse(usuario)`: Convierte Usuario a UsuarioResponse (sin contraseña)

**Tecnologías:**
- bcryptjs para hashing
- jose para JWT (algoritmo HS256)

### `lib/db.ts`
**Base de datos en memoria simulada**

**Métodos disponibles:**
```typescript
db.usuarios.create(data)         // Crear usuario
db.usuarios.findByNombre(nombre) // Buscar por nombre
db.usuarios.findByCorreo(correo) // Buscar por correo
db.usuarios.findById(id)         // Buscar por ID
db.usuarios.getAll()             // Obtener todos (debug)

db.sessions.add(token)           // Agregar sesión activa
db.sessions.isActive(token)      // Verificar si sesión existe
db.sessions.remove(token)        // Eliminar sesión
db.sessions.clear()              // Limpiar todas las sesiones
```

**⚠️ Importante:** Esta es una implementación temporal. En producción debe reemplazarse con una base de datos real (PostgreSQL, MongoDB, etc.)

### `lib/types.ts`
**Tipos TypeScript definidos:**

```typescript
// Usuario completo (con contraseña)
interface Usuario {
  id: number
  nombre: string
  telefono: string
  correo: string
  puesto: string
  contrasena: string
  createdAt: Date
}

// Usuario sin contraseña (para respuestas API)
interface UsuarioResponse {
  id: number
  nombre: string
  telefono: string
  correo: string
  puesto: string
}

// Request de login
interface LoginRequest {
  nombre: string
  contrasena: string
}

// Response de login
interface LoginResponse {
  usuario: UsuarioResponse
  token: string
}
```

### `lib/validations.ts`
**Schemas de validación con Zod:**

```typescript
// Schema para registro
registroUsuarioSchema = {
  nombre: string, min 1, obligatorio
  telefono: string, regex /^\d{10}$/, obligatorio
  correo: string, email válido, obligatorio
  puesto: string, min 1, obligatorio
  contrasena: string, min 8, obligatorio
}

// Schema para login
loginSchema = {
  nombre: string, min 1, obligatorio
  contrasena: string, min 1, obligatorio
}
```

**Función auxiliar:**
- `validateData(schema, data)`: Valida datos contra un schema y retorna resultado

---

## 🔐 Flujo de Autenticación

### Registro de Usuario
```
1. Usuario completa formulario
2. Frontend valida contraseñas coincidentes
3. POST /api/usuarios con datos
4. Backend valida con Zod
5. Backend verifica nombre único
6. Backend hashea contraseña (bcrypt)
7. Backend crea usuario en DB
8. Backend retorna usuario sin contraseña
9. Frontend hace login automático
10. Usuario accede al dashboard
```

### Inicio de Sesión
```
1. Usuario ingresa credenciales
2. POST /api/auth/login
3. Backend valida datos con Zod
4. Backend busca usuario por nombre
5. Backend verifica contraseña (bcrypt.compare)
6. Backend genera JWT (válido 7 días)
7. Backend establece cookie httpOnly
8. Backend retorna usuario + token
9. Frontend guarda datos del usuario
10. Frontend muestra dashboard personalizado
```

### Cerrar Sesión
```
1. Usuario hace click en "Cerrar sesión"
2. POST /api/auth/logout
3. Backend invalida token
4. Backend elimina cookie
5. Frontend limpia estado
6. Frontend muestra pantalla de login
```

---

## 🛠️ Tecnologías y Librerías

### Frontend
- **Next.js 16** - Framework de React con SSR
- **React 19** - Librería de UI
- **TypeScript 5.7** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Lucide React** - Iconos

### Backend
- **Next.js API Routes** - Backend integrado
- **bcryptjs** - Hash de contraseñas
- **jose** - JWT (JSON Web Tokens)
- **zod** - Validación de schemas

### Desarrollo
- **@types/node** - Tipos para Node.js
- **@types/react** - Tipos para React
- **@types/bcryptjs** - Tipos para bcryptjs

---

## 🔄 Flujo de Datos

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │ (POST /api/usuarios)
       ▼
┌─────────────────────────────┐
│   API Route Handler         │
│   app/api/usuarios/route.ts │
├─────────────────────────────┤
│ 1. Validar con Zod          │
│    (lib/validations.ts)     │
│ 2. Hashear contraseña       │
│    (lib/auth.ts)            │
│ 3. Guardar en DB            │
│    (lib/db.ts)              │
└──────┬──────────────────────┘
       │
       │ Response JSON
       ▼
┌─────────────┐
│   Browser   │
│  (Frontend) │
└─────────────┘
```

---

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes React: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- API Routes: `route.ts`
- Tipos: `types.ts`

### Nombres de Variables
- Componentes: `PascalCase`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE` (opcional)
- Interfaces/Tipos: `PascalCase`

### Estructura de Funciones
```typescript
// API Route
export async function POST(request: NextRequest) {
  try {
    // 1. Obtener datos
    // 2. Validar datos
    // 3. Procesar lógica
    // 4. Retornar respuesta
  } catch (error) {
    // Manejo de errores
  }
}
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Otros
npm install          # Instalar dependencias
npm audit            # Revisar vulnerabilidades
```

---

## 📊 Estado Actual del Proyecto

### ✅ Implementado
- [x] Sistema de registro de usuarios (US-01)
- [x] Sistema de inicio de sesión (US-02)
- [x] Cierre de sesión
- [x] Validaciones exhaustivas
- [x] Seguridad con bcrypt + JWT
- [x] Cookies httpOnly
- [x] Dashboard personalizado
- [x] Interfaz responsive

### 🚧 Pendiente
- [ ] Persistencia en base de datos real
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Roles de usuario
- [ ] Middleware de autenticación
- [ ] Gestión de solicitudes (US-03+)
- [ ] Sistema de seguimiento
- [ ] Reportes

---

## 🔒 Consideraciones de Seguridad

### Implementado ✅
- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con algoritmo HS256
- Cookies httpOnly (no accesibles desde JavaScript)
- Validación exhaustiva de entrada
- Mensajes de error genéricos para login
- CORS configurado automáticamente

### Recomendado para Producción 🔐
- Usar variables de entorno para JWT_SECRET
- Implementar rate limiting
- Agregar CSRF protection
- Usar HTTPS en producción
- Implementar refresh tokens
- Agregar logs de auditoría
- Implementar 2FA (opcional)

---

## 📖 Recursos Adicionales

- **Documentación de la API:** `API_DOCUMENTATION.md`
- **Guía de Pruebas:** `GUIA_PRUEBAS.md`
- **Next.js Docs:** https://nextjs.org/docs
- **Zod Docs:** https://zod.dev
- **bcrypt Docs:** https://github.com/kelektiv/node.bcrypt.js

---

¡Listo para desarrollar! 🎉
