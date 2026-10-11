# Documentación de API - Manteni+ Escolar

## 📋 Historias de Usuario Implementadas

### US-01: Registro de Usuarios
### US-02: Inicio de Sesión

---

## 🔐 Endpoints de Autenticación

### 1. Registro de Usuario

**Endpoint:** `POST /api/usuarios`

**Descripción:** Registra un nuevo usuario en la plataforma.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "telefono": "9991234567",
  "correo": "juan@escuela.com",
  "puesto": "Docente",
  "contrasena": "Clave1234"
}
```

**Validaciones:**
- ✅ Todos los campos obligatorios
- ✅ Nombre único (no puede estar duplicado)
- ✅ Teléfono: solo números, 10 dígitos exactos
- ✅ Correo: formato válido de email
- ✅ Contraseña: mínimo 8 caracteres, se guarda cifrada con bcrypt

**Responses:**

#### ✅ 201 Created - Usuario creado exitosamente
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "telefono": "9991234567",
  "correo": "juan@escuela.com",
  "puesto": "Docente"
}
```
> Nota: La contraseña NO se devuelve en la respuesta por seguridad.

#### ❌ 400 Bad Request - Error de validación
```json
{
  "error": "El teléfono debe tener 10 dígitos"
}
```

Posibles mensajes de error:
- `"El nombre es obligatorio"`
- `"El teléfono es obligatorio"`
- `"El teléfono debe tener 10 dígitos"`
- `"El correo es obligatorio"`
- `"El correo no tiene un formato válido"`
- `"El puesto es obligatorio"`
- `"La contraseña es obligatoria"`
- `"La contraseña debe tener mínimo 8 caracteres"`

#### ❌ 409 Conflict - Datos duplicados
```json
{
  "error": "El correo electrónico ya se encuentra registrado. Por favor, utiliza otro correo o inicia sesión."
}
```
o
```json
{
  "error": "El número de teléfono ya se encuentra registrado. Por favor, verifica el número ingresado."
}
```
o
```json
{
  "error": "Este nombre ya está registrado"
}
```

#### ❌ 500 Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

---

### 2. Inicio de Sesión

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autentica a un usuario mediante su correo electrónico y contraseña, y genera una sesión.

**Request Body:**
```json
{
  "correo": "juan@escuela.com",
  "contrasena": "Clave1234"
}
```

**Responses:**

#### ✅ 200 OK - Login exitoso
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "telefono": "9991234567",
    "correo": "juan@escuela.com",
    "puesto": "Docente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies:** Se establece automáticamente una cookie `auth-token` con las siguientes propiedades:
- `httpOnly: true` (no accesible desde JavaScript)
- `secure: true` (solo HTTPS en producción)
- `sameSite: 'lax'`
- `maxAge: 7 días`

#### ❌ 400 Bad Request - Error de validación
```json
{
  "error": "El correo es obligatorio"
}
```

#### ❌ 401 Unauthorized - Credenciales incorrectas
```json
{
  "error": "Correo o contraseña incorrectos"
}
```
> Nota: Este mismo mensaje se devuelve tanto si el correo no existe como si la contraseña es incorrecta, por seguridad.

#### ❌ 500 Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

---

### 3. Cerrar Sesión

**Endpoint:** `POST /api/auth/logout`

**Descripción:** Cierra la sesión del usuario actual.

**Headers:** Se requiere la cookie `auth-token` (se envía automáticamente)

**Responses:**

#### ✅ 200 OK - Sesión cerrada
```json
{
  "message": "Sesión cerrada correctamente"
}
```

**Efecto:** La cookie `auth-token` se elimina y el token se invalida en el servidor.

#### ❌ 500 Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

---

## 🔧 Tecnologías Utilizadas

- **Next.js 16** - Framework de React con API Routes
- **TypeScript** - Tipado estático
- **bcryptjs** - Hash de contraseñas (10 rounds)
- **jose** - Generación y verificación de JWT
- **zod** - Validación de esquemas y datos

---

## 🗄️ Almacenamiento

Actualmente el sistema utiliza una **base de datos en memoria** (`lib/db.ts`) para fines de desarrollo y demostración.

En producción, esto debe reemplazarse con:
- PostgreSQL + Prisma
- MongoDB + Mongoose
- MySQL + TypeORM
- O cualquier otra base de datos persistente

---

## 🔐 Seguridad Implementada

✅ **Contraseñas hasheadas** con bcrypt (salt rounds: 10)  
✅ **JWT** para autenticación stateless  
✅ **Cookies httpOnly** para prevenir XSS  
✅ **Validación exhaustiva** con Zod  
✅ **Mensajes de error genéricos** para credenciales (previene enumeración de usuarios)  
✅ **CORS configurado** automáticamente por Next.js  

---

## 📝 Notas Adicionales

### Flujo de Registro + Login
1. Usuario se registra → `POST /api/usuarios`
2. Sistema crea usuario con contraseña hasheada
3. Frontend hace automáticamente login → `POST /api/auth/login`
4. Usuario recibe token y accede al dashboard

### Flujo de Login
1. Usuario ingresa credenciales → `POST /api/auth/login`
2. Sistema verifica contraseña con bcrypt
3. Si es correcto, genera JWT válido por 7 días
4. Token se guarda en cookie httpOnly
5. Usuario accede al dashboard

### Flujo de Logout
1. Usuario hace click en "Cerrar sesión"
2. Frontend llama → `POST /api/auth/logout`
3. Sistema invalida el token y elimina cookie
4. Usuario regresa a pantalla de login

---

## 🧪 Ejemplos de Prueba

### Registrar un usuario válido
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "telefono": "5551234567",
    "correo": "maria@escuela.com",
    "puesto": "Administradora",
    "contrasena": "MiClave123"
  }'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "maria@escuela.com",
    "contrasena": "MiClave123"
  }'
```

### Cerrar sesión
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: auth-token=TU_TOKEN_AQUI"
```

---

## 🎯 Criterios de Aceptación Cumplidos

### US-01: Registro
- ✅ Todos los campos son obligatorios
- ✅ Nombre único validado
- ✅ Correo electrónico único validado
- ✅ Teléfono único validado: solo números, 10 dígitos
- ✅ Correo con formato válido
- ✅ Contraseña: mínimo 8 caracteres, guardada cifrada
- ✅ Respuesta 201 no incluye la contraseña
- ✅ Códigos de error: 400, 409, 500 según corresponda con mensajes claros

### US-02: Inicio de Sesión
- ✅ Autenticación por correo y contraseña
- ✅ Mensaje genérico para credenciales incorrectas
- ✅ Acceso al dashboard tras login exitoso
- ✅ Función de cerrar sesión implementada
- ✅ Redirección a login tras cerrar sesión
