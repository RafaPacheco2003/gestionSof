# 🧪 Guía de Pruebas - Manteni+ Escolar

Esta guía te ayudará a probar las funcionalidades de registro e inicio de sesión.

---

## 🚀 Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📱 Pruebas desde la Interfaz Web

### 1. Probar Registro de Usuario

1. Abre `http://localhost:3000` en tu navegador
2. Haz click en "Regístrate" (si estás en la pantalla de login)
3. Completa el formulario con datos válidos:
   - **Nombre completo:** Juan Pérez
   - **Teléfono:** 9991234567 (exactamente 10 dígitos)
   - **Correo:** juan@escuela.com
   - **Puesto:** Docente
   - **Contraseña:** Clave1234 (mínimo 8 caracteres)
   - **Confirmar contraseña:** Clave1234
4. Haz click en "Crear cuenta"
5. ✅ Deberías ser redirigido automáticamente al dashboard

### 2. Probar Validaciones de Registro

Intenta registrarte con datos inválidos para ver los mensajes de error:

#### Teléfono inválido:
- **Teléfono:** 123 → Error: "El teléfono debe tener 10 dígitos"
- **Teléfono:** abc1234567 → Error: "El teléfono debe tener 10 dígitos"

#### Correo inválido:
- **Correo:** juanescuela.com → Error: "El correo no tiene un formato válido"

#### Contraseña corta:
- **Contraseña:** Clave1 → Error: "La contraseña debe tener mínimo 8 caracteres"

#### Contraseñas no coinciden:
- **Contraseña:** Clave1234
- **Confirmar contraseña:** Clave4321
- → Error: "Las contraseñas no coinciden"

#### Correo duplicado:
1. Registra un usuario con correo: "juan@escuela.com"
2. Intenta registrar otro usuario con el mismo correo
3. → Error: "El correo electrónico ya se encuentra registrado. Por favor, utiliza otro correo o inicia sesión."

#### Teléfono duplicado:
1. Registra un usuario con teléfono: "9991234567"
2. Intenta registrar otro usuario con el mismo teléfono
3. → Error: "El número de teléfono ya se encuentra registrado. Por favor, verifica el número ingresado."

#### Nombre duplicado:
1. Registra un usuario: "Juan Pérez"
2. Intenta registrar otro usuario con el mismo nombre
3. → Error: "Este nombre ya está registrado"

### 3. Probar Inicio de Sesión

1. En la pantalla de login, ingresa:
   - **Correo electrónico:** juan@escuela.com
   - **Contraseña:** Clave1234
2. Haz click en "Iniciar sesión"
3. ✅ Deberías acceder al dashboard

### 4. Probar Credenciales Incorrectas

#### Correo inexistente:
- **Correo:** noexiste@escuela.com
- **Contraseña:** cualquiera
- → Error: "Correo o contraseña incorrectos"

#### Contraseña incorrecta:
- **Correo:** juan@escuela.com
- **Contraseña:** ClaveIncorrecta
- → Error: "Correo o contraseña incorrectos"

### 5. Probar Cerrar Sesión

1. Una vez dentro del dashboard
2. Haz click en "Cerrar sesión" en el menú lateral
3. ✅ Deberías volver a la pantalla de login

### 6. Verificar Datos del Usuario

Una vez autenticado, verifica que:
- ✅ Tus iniciales aparecen en los avatares
- ✅ Tu nombre completo aparece en el perfil
- ✅ Tu puesto aparece debajo de tu nombre
- ✅ El saludo personalizado muestra tu primer nombre

---

## 🔧 Pruebas con cURL (Terminal)

### Registrar un usuario

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

**Respuesta esperada (201):**
```json
{
  "id": 2,
  "nombre": "María García",
  "telefono": "5551234567",
  "correo": "maria@escuela.com",
  "puesto": "Administradora"
}
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "correo": "maria@escuela.com",
    "contrasena": "MiClave123"
  }'
```

**Respuesta esperada (200):**
```json
{
  "usuario": {
    "id": 2,
    "nombre": "María García",
    "telefono": "5551234567",
    "correo": "maria@escuela.com",
    "puesto": "Administradora"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Cerrar sesión

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Respuesta esperada (200):**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

---

## 🧪 Escenarios de Prueba Completos

### ✅ Escenario 1: Registro exitoso
1. Usuario completa el formulario con datos válidos
2. Sistema valida los datos
3. Sistema hashea la contraseña
4. Sistema crea el usuario en la base de datos
5. Sistema hace login automático
6. Usuario accede al dashboard
7. **Resultado esperado:** Usuario registrado y autenticado

### ✅ Escenario 2: Registro con validaciones
1. Usuario intenta registrarse con teléfono de 9 dígitos
2. Sistema rechaza con error 400
3. Usuario corrige a 10 dígitos
4. Usuario ingresa contraseña de 6 caracteres
5. Sistema rechaza con error 400
6. Usuario corrige a 8 caracteres
7. Usuario completa el registro
8. **Resultado esperado:** Validaciones funcionando correctamente

### ✅ Escenario 3: Login exitoso
1. Usuario ya registrado ingresa credenciales correctas
2. Sistema verifica la contraseña
3. Sistema genera token JWT
4. Sistema establece cookie httpOnly
5. Usuario accede al dashboard
6. **Resultado esperado:** Usuario autenticado correctamente

### ✅ Escenario 4: Login con credenciales incorrectas
1. Usuario ingresa nombre correcto pero contraseña incorrecta
2. Sistema retorna error 401 genérico
3. Usuario ingresa nombre inexistente
4. Sistema retorna error 401 genérico (mismo mensaje)
5. **Resultado esperado:** No se revela si el usuario existe o no

### ✅ Escenario 5: Cerrar sesión
1. Usuario autenticado hace click en "Cerrar sesión"
2. Sistema invalida el token
3. Sistema elimina la cookie
4. Usuario vuelve a la pantalla de login
5. Usuario intenta acceder al dashboard sin estar autenticado
6. **Resultado esperado:** Sesión cerrada correctamente

### ✅ Escenario 6: Nombre duplicado
1. Usuario registra cuenta con nombre "Pedro López"
2. Otro usuario intenta registrarse con el mismo nombre
3. Sistema retorna error 409
4. **Resultado esperado:** No se permiten nombres duplicados

---

## 🎯 Checklist de Validaciones

### Campos Obligatorios
- [ ] Nombre vacío → Error
- [ ] Teléfono vacío → Error
- [ ] Correo vacío → Error
- [ ] Puesto vacío → Error
- [ ] Contraseña vacía → Error

### Validación de Teléfono
- [ ] 9 dígitos → Error
- [ ] 11 dígitos → Error
- [ ] Con letras → Error
- [ ] Con espacios → Error
- [ ] 10 dígitos numéricos → ✅ Válido

### Validación de Correo
- [ ] Sin @ → Error
- [ ] Sin dominio → Error
- [ ] Formato válido → ✅ Válido

### Validación de Contraseña
- [ ] 7 caracteres → Error
- [ ] 8 o más caracteres → ✅ Válido
- [ ] Se guarda cifrada (no en texto plano) → ✅ Verificado

### Validación de Login
- [ ] Usuario inexistente → Error 401
- [ ] Contraseña incorrecta → Error 401
- [ ] Credenciales correctas → ✅ Login exitoso

---

## 📊 Códigos HTTP Esperados

| Endpoint | Método | Escenario | Código |
|----------|--------|-----------|--------|
| `/api/usuarios` | POST | Usuario creado | 201 |
| `/api/usuarios` | POST | Datos inválidos | 400 |
| `/api/usuarios` | POST | Nombre duplicado | 409 |
| `/api/auth/login` | POST | Login exitoso | 200 |
| `/api/auth/login` | POST | Credenciales incorrectas | 401 |
| `/api/auth/logout` | POST | Logout exitoso | 200 |

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verifica que las dependencias estén instaladas
npm install

# Inicia el servidor
npm run dev
```

### Error de conexión en el frontend
- Verifica que el servidor esté corriendo en `http://localhost:3000`
- Abre las DevTools del navegador (F12) y revisa la consola

### No puedo iniciar sesión después de registrarme
- Asegúrate de usar el mismo nombre exacto (respeta mayúsculas/minúsculas)
- Verifica que la contraseña tenga mínimo 8 caracteres

### Base de datos se reinicia al recargar
- Esto es normal, la base de datos está en memoria
- Los usuarios se perderán al reiniciar el servidor
- En producción se debe usar una base de datos persistente

---

## ✨ Próximos Pasos

Una vez que hayas probado el registro e inicio de sesión, puedes:

1. Implementar persistencia con una base de datos real
2. Agregar validación de email (enviar correo de confirmación)
3. Implementar "Olvidé mi contraseña"
4. Agregar roles de usuario (Admin, Docente, Mantenimiento)
5. Implementar las siguientes historias de usuario (US-03, US-04, etc.)

---

¡Listo para probar! 🎉
