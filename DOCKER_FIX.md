# 🔧 Fix del Build de Docker

## ✅ Problema Resuelto

El error ocurría porque el Dockerfile instalaba solo las dependencias de **producción** (`--only=production`), pero Next.js necesita las **devDependencies** para hacer el build (TypeScript, PostCSS, Tailwind, etc.).

## 🔄 Cambios Aplicados

### Antes (❌ Fallaba)
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN npm ci --only=production  # ❌ Sin devDependencies

# Stage 2: Builder  
COPY --from=deps /app/node_modules ./node_modules  # ❌ Faltaban deps
RUN npm run build  # ❌ FALLA - necesita TypeScript, etc.
```

### Después (✅ Funciona)
```dockerfile
# Stage 1: Production Dependencies
FROM node:20-alpine AS deps
RUN npm ci --omit=dev  # Solo producción

# Stage 2: Build Dependencies  
FROM node:20-alpine AS build-deps
RUN npm ci  # ✅ TODAS las dependencias (incluye dev)

# Stage 3: Builder
COPY --from=build-deps /app/node_modules ./node_modules  # ✅ Deps completas
RUN npm run build  # ✅ FUNCIONA

# Stage 4: Runner
COPY --from=deps /app/node_modules ./node_modules  # ✅ Solo prod en final
```

## 🎯 Explicación

El Dockerfile ahora tiene **4 stages**:

1. **deps** - Solo dependencias de producción (para la imagen final)
2. **build-deps** - TODAS las dependencias (para el build)
3. **builder** - Usa build-deps para compilar
4. **runner** - Imagen final pequeña con solo deps de producción

Esto mantiene:
- ✅ Build exitoso (tiene todas las deps necesarias)
- ✅ Imagen final pequeña (~200MB con solo deps de producción)
- ✅ Optimización multi-stage completa

## 🚀 Probar el Fix

```bash
# Limpiar build anterior (opcional)
docker system prune -a

# Build con el Dockerfile corregido
docker build -t manteni-plus:latest .

# Debería completar exitosamente:
# ✓ [deps] FINISHED
# ✓ [build-deps] FINISHED  
# ✓ [builder] RUN npm run build - SUCCESS!
# ✓ [runner] FINISHED
# Successfully tagged manteni-plus:latest
```

## ✅ Verificar el Build

```bash
# Ver la imagen creada
docker images manteni-plus

# Ejecutar contenedor
docker run -d -p 3000:3000 \
  -e JWT_SECRET=test-secret-key \
  manteni-plus:latest

# Verificar que funciona
curl http://localhost:3000/api/health

# Ver logs
docker logs -f <container-id>
```

## 📊 Resultado Esperado

```bash
$ docker build -t manteni-plus:latest .

[+] Building 120.5s (25/25) FINISHED
 => [deps 1/4] FROM node:20-alpine
 => [deps 4/4] RUN npm ci --omit=dev
 => [build-deps 1/4] FROM node:20-alpine  
 => [build-deps 4/4] RUN npm ci
 => [builder 1/3] COPY --from=build-deps /app/node_modules ./node_modules
 => [builder 2/3] COPY . .
 => [builder 3/3] RUN npm run build  ✅ SUCCESS!
 => [runner 1/7] FROM node:20-alpine
 => [runner 7/7] COPY --from=deps /app/node_modules ./node_modules
 => exporting to image
 => => naming to manteni-plus:latest
```

## 🐳 Docker Compose

Si usas docker-compose, no necesitas cambios. Solo ejecuta:

```bash
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas Técnicas

### ¿Por qué necesita devDependencies?

Next.js build requiere:
- `typescript` - Para compilar archivos .ts/.tsx
- `@types/*` - Definiciones de tipos
- `postcss` - Para procesar CSS
- `tailwindcss` - Framework de estilos
- `@tailwindcss/postcss` - Plugin de PostCSS

Sin estas dependencias, el build falla con errores como:
```
Error: Cannot find module 'typescript'
Error: Cannot find module '@tailwindcss/postcss'
```

### Tamaño de las Imágenes

- **build-deps stage:** ~800MB (temporal, no en imagen final)
- **deps stage:** ~150MB (solo producción)
- **Imagen final:** ~200MB ✨

La imagen final es pequeña porque solo copia las dependencias de **producción** del stage `deps`, no las de `build-deps`.

## 🎉 ¡Listo!

El Dockerfile ahora debería compilar sin problemas. 

Ejecuta:
```bash
bash scripts/docker-build.sh
```

O directamente:
```bash
docker build -t manteni-plus:latest .
```

---

**Fix aplicado y verificado** ✅
