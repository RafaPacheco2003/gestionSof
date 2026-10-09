# Dockerfile multi-stage optimizado para Next.js 16
# Manteni+ Escolar - Sistema de Gestión de Mantenimiento

# ============================================
# Stage 1: Dependencies (Producción)
# ============================================
FROM node:20-alpine AS deps

# Añadir libc6-compat para compatibilidad
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de configuración de paquetes
COPY package.json package-lock.json* ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# ============================================
# Stage 2: Build Dependencies (Todas las deps)
# ============================================
FROM node:20-alpine AS build-deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# ============================================
# Stage 3: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar TODAS las dependencias (incluyendo devDependencies para el build)
COPY --from=build-deps /app/node_modules ./node_modules

# Copiar todos los archivos del proyecto
COPY . .

# Configurar variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación Next.js
RUN npm run build

# ============================================
# Stage 4: Runner (Imagen final)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Configurar entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar archivos estáticos del build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar dependencias de producción solamente
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Cambiar al usuario no-root
USER nextjs

# Exponer el puerto
EXPOSE 3000

# Variables de entorno para la aplicación
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
