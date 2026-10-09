# 🚀 Quick Start con Docker - Manteni+ Escolar

Guía rápida de 5 minutos para deployar con Docker.

---

## ⚡ TL;DR - Deploy en 3 Comandos

```bash
# 1. Configurar variables de entorno
cp .env.example .env.production

# 2. Iniciar con Docker Compose
docker-compose up -d

# 3. Abrir en navegador
open http://localhost:3000
```

---

## 📋 Prerrequisitos

### 1. Instalar Docker Desktop

#### macOS
```bash
# Descarga Docker Desktop desde:
# https://www.docker.com/products/docker-desktop

# O con Homebrew:
brew install --cask docker
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Windows
```
Descarga Docker Desktop desde:
https://www.docker.com/products/docker-desktop
```

### 2. Verificar Instalación

```bash
docker --version
# Docker version 24.0.0 o superior

docker-compose --version
# Docker Compose version 2.0.0 o superior
```

---

## 🚀 Deployment Paso a Paso

### Paso 1: Clonar/Navegar al Proyecto

```bash
cd gestiondeSoftware
```

### Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.production

# Generar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Editar .env.production con el JWT_SECRET generado
nano .env.production
```

**Contenido mínimo de `.env.production`:**
```env
NODE_ENV=production
JWT_SECRET=tu-clave-generada-aqui
PORT=3000
```

### Paso 3: Opción A - Docker Compose (Recomendado)

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

### Paso 3: Opción B - Docker Build + Run

```bash
# Build de la imagen
docker build -t manteni-plus:latest .

# Ejecutar contenedor
docker run -d \
  --name manteni-plus-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=tu-clave-secreta \
  manteni-plus:latest

# Ver logs
docker logs -f manteni-plus-app
```

### Paso 3: Opción C - Scripts Automatizados

```bash
# Deploy completo (build + run + health check)
bash scripts/docker-deploy.sh

# O paso por paso:
bash scripts/docker-build.sh    # Solo build
bash scripts/docker-run.sh      # Solo run
```

### Paso 4: Verificar

```bash
# Verificar que el contenedor está corriendo
docker ps

# Probar la aplicación
curl http://localhost:3000

# O abrir en navegador
open http://localhost:3000  # macOS
xdg-open http://localhost:3000  # Linux
start http://localhost:3000  # Windows
```

---

## ✅ Verificación Exitosa

Si todo está bien, deberías ver:

```bash
$ docker ps
CONTAINER ID   IMAGE              STATUS          PORTS                    NAMES
abc123def456   manteni-plus:latest   Up 2 minutes   0.0.0.0:3000->3000/tcp   manteni-plus-app
```

Y al abrir `http://localhost:3000` verás la pantalla de login de Manteni+.

---

## 🎯 Comandos Útiles

### Ver Logs
```bash
# Logs en tiempo real
docker-compose logs -f

# Últimas 100 líneas
docker logs --tail 100 manteni-plus-app
```

### Reiniciar
```bash
# Con docker-compose
docker-compose restart

# Contenedor individual
docker restart manteni-plus-app
```

### Detener
```bash
# Con docker-compose
docker-compose down

# Contenedor individual
docker stop manteni-plus-app
```

### Actualizar Aplicación
```bash
# 1. Pull cambios
git pull origin main

# 2. Rebuild y reiniciar
docker-compose up -d --build

# 3. Verificar
docker-compose logs -f
```

---

## 🐛 Solución Rápida de Problemas

### Error: "Port 3000 already in use"

```bash
# Opción 1: Detener proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Opción 2: Usar otro puerto
docker run -d -p 8080:3000 manteni-plus:latest
# Acceder en: http://localhost:8080
```

### Error: "Cannot connect to Docker daemon"

```bash
# Iniciar Docker Desktop (macOS/Windows)
open -a Docker

# Linux
sudo systemctl start docker
```

### Contenedor se detiene inmediatamente

```bash
# Ver logs de error
docker logs manteni-plus-app

# Verificar que la imagen se construyó correctamente
docker images | grep manteni-plus

# Rebuild sin cache
docker build --no-cache -t manteni-plus:latest .
```

### Error de permisos

```bash
# Linux - agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker ps
```

---

## 🌐 Deployment en Servidor

### 1. Copiar archivos al servidor

```bash
# Con rsync
rsync -avz --exclude 'node_modules' --exclude '.next' \
  . usuario@servidor:/ruta/manteni-plus/

# O con git
ssh usuario@servidor
git clone https://github.com/tu-usuario/manteni-plus.git
cd manteni-plus
```

### 2. Deploy en servidor

```bash
ssh usuario@servidor
cd manteni-plus

# Configurar variables de entorno
cp .env.example .env.production
nano .env.production

# Iniciar con docker-compose
docker-compose up -d

# Verificar
docker-compose ps
```

### 3. Configurar firewall

```bash
# Permitir puerto 3000
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 📊 Monitoreo Básico

```bash
# Ver uso de recursos
docker stats manteni-plus-app

# Health check manual
curl http://localhost:3000/

# Ver procesos dentro del contenedor
docker top manteni-plus-app

# Inspeccionar contenedor
docker inspect manteni-plus-app
```

---

## 🔒 Checklist de Seguridad

- [ ] JWT_SECRET configurado con valor seguro (64+ caracteres)
- [ ] No usar valores por defecto de .env.example
- [ ] .env.production no subido a Git
- [ ] Firewall configurado correctamente
- [ ] HTTPS configurado (producción)
- [ ] Contenedor corriendo con usuario no-root
- [ ] Límites de recursos configurados

---

## 📚 Más Información

- **Guía completa:** [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
- **Documentación API:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Pruebas:** [GUIA_PRUEBAS.md](./GUIA_PRUEBAS.md)

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs: `docker-compose logs -f`
2. Consulta [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
3. Verifica que Docker esté corriendo: `docker ps`
4. Prueba rebuild sin cache: `docker-compose build --no-cache`

---

## 🎉 ¡Listo!

Tu aplicación debería estar corriendo en:
**http://localhost:3000**

Para probar:
1. Abre el navegador en http://localhost:3000
2. Haz click en "Regístrate"
3. Completa el formulario
4. ¡Accede al dashboard!

---

**Manteni+ Escolar** - Deploy simple y eficiente 🚀
