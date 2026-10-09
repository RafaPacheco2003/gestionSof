# 🐳 Comandos Docker - Referencia Rápida

Comandos más usados para Manteni+ Escolar.

---

## 🚀 Inicio Rápido

```bash
# Deploy completo automático
bash scripts/docker-deploy.sh

# O manual:
docker-compose up -d
```

---

## 📦 Build

```bash
# Build con docker-compose
docker-compose build

# Build sin cache
docker-compose build --no-cache

# Build manual
docker build -t manteni-plus:latest .

# Build con script
bash scripts/docker-build.sh
```

---

## ▶️ Ejecutar

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs mientras inicia
docker-compose up

# Ejecutar contenedor individual
docker run -d -p 3000:3000 \
  -e JWT_SECRET=tu-clave \
  manteni-plus:latest

# Con script
bash scripts/docker-run.sh
```

---

## 📋 Estado y Monitoreo

```bash
# Ver contenedores corriendo
docker ps
docker-compose ps

# Ver todos los contenedores
docker ps -a

# Ver logs en tiempo real
docker-compose logs -f
docker-compose logs -f app

# Últimas 100 líneas
docker logs --tail 100 manteni-plus-app

# Uso de recursos
docker stats
docker stats manteni-plus-app
```

---

## 🔧 Control de Servicios

```bash
# Detener servicios
docker-compose down

# Detener sin eliminar
docker-compose stop

# Iniciar servicios detenidos
docker-compose start

# Reiniciar
docker-compose restart
docker-compose restart app

# Reiniciar contenedor individual
docker restart manteni-plus-app
```

---

## 🔍 Debugging

```bash
# Acceder al contenedor (shell)
docker-compose exec app sh
docker exec -it manteni-plus-app sh

# Ver variables de entorno
docker exec manteni-plus-app env

# Inspeccionar contenedor
docker inspect manteni-plus-app

# Ver procesos
docker top manteni-plus-app

# Health check manual
curl http://localhost:3000/api/health
docker inspect --format='{{.State.Health.Status}}' manteni-plus-app
```

---

## 🗑️ Limpieza

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar incluyendo volúmenes
docker-compose down -v

# Eliminar contenedor específico
docker rm -f manteni-plus-app

# Eliminar imagen
docker rmi manteni-plus:latest

# Limpiar todo (⚠️ cuidado)
docker system prune -a
docker volume prune
docker network prune
```

---

## 📊 Imágenes

```bash
# Listar imágenes
docker images

# Ver tamaño de imágenes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Eliminar imagen
docker rmi manteni-plus:latest

# Limpiar imágenes sin usar
docker image prune -a
```

---

## 🔄 Actualización

```bash
# Método 1: Con git
git pull origin main
docker-compose up -d --build

# Método 2: Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Método 3: Con script
bash scripts/docker-deploy.sh
```

---

## 🌐 Docker Hub

```bash
# Login
docker login

# Tag imagen
docker tag manteni-plus:latest tu-usuario/manteni-plus:1.0.0

# Push
docker push tu-usuario/manteni-plus:1.0.0

# Pull
docker pull tu-usuario/manteni-plus:1.0.0

# Logout
docker logout
```

---

## 🔧 Variables de Entorno

```bash
# Ejecutar con variables
docker run -d \
  -e NODE_ENV=production \
  -e JWT_SECRET=mi-clave-secreta \
  -e PORT=3000 \
  manteni-plus:latest

# Con archivo .env
docker run --env-file .env.production \
  manteni-plus:latest

# Ver variables de un contenedor
docker exec manteni-plus-app env
```

---

## 🏥 Health Checks

```bash
# Ver estado de salud
docker inspect --format='{{.State.Health.Status}}' manteni-plus-app

# Ver historial de health checks
docker inspect --format='{{json .State.Health}}' manteni-plus-app | jq

# Health check manual
curl http://localhost:3000/api/health
```

---

## 🔀 Networking

```bash
# Listar networks
docker network ls

# Inspeccionar network
docker network inspect manteni-network

# Ver IPs de contenedores
docker network inspect manteni-network | grep IPv4Address

# Conectar contenedor a network
docker network connect manteni-network otro-contenedor
```

---

## 💾 Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect postgres_data

# Eliminar volumen
docker volume rm postgres_data

# Limpiar volúmenes sin usar
docker volume prune
```

---

## 📊 Comandos de Producción

```bash
# Ver uso de disco
docker system df

# Ver uso de recursos en tiempo real
docker stats --no-stream

# Exportar logs
docker logs manteni-plus-app > app.log

# Backup de contenedor
docker commit manteni-plus-app manteni-plus-backup:$(date +%Y%m%d)

# Guardar imagen a archivo
docker save manteni-plus:latest | gzip > manteni-plus.tar.gz

# Cargar imagen desde archivo
docker load < manteni-plus.tar.gz
```

---

## 🔐 Seguridad

```bash
# Ver vulnerabilidades (requiere Docker Scout)
docker scout cves manteni-plus:latest

# Scan de seguridad (requiere Trivy)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image manteni-plus:latest

# Ver permisos de usuario
docker exec manteni-plus-app whoami
docker exec manteni-plus-app id
```

---

## 🚨 Troubleshooting

```bash
# Contenedor no inicia
docker logs manteni-plus-app
docker-compose logs app

# Puerto en uso
lsof -ti:3000 | xargs kill -9

# Problemas de build
docker build --no-cache -t manteni-plus:latest .
docker builder prune -a

# Contenedor se reinicia
docker inspect manteni-plus-app | grep -A 10 State
docker logs --tail 50 manteni-plus-app

# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📝 One-liners Útiles

```bash
# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar todos los contenedores
docker rm $(docker ps -aq)

# Eliminar todas las imágenes
docker rmi $(docker images -q)

# Ver IPs de todos los contenedores
docker ps -q | xargs docker inspect --format='{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

# Logs de últimos 5 minutos
docker logs --since 5m manteni-plus-app

# Ejecutar comando en contenedor corriendo
docker exec manteni-plus-app ls -la /app

# Copiar archivo del contenedor
docker cp manteni-plus-app:/app/.next ./backup-next

# Copiar archivo al contenedor
docker cp archivo.txt manteni-plus-app:/app/
```

---

## 🎯 Workflows Comunes

### Deploy Inicial
```bash
cp .env.example .env.production
# Editar .env.production
docker-compose up -d
docker-compose logs -f
```

### Actualizar Código
```bash
git pull origin main
docker-compose up -d --build
docker-compose logs -f app
```

### Ver Problema
```bash
docker-compose ps
docker-compose logs -f app
docker exec -it manteni-plus-app sh
```

### Reinicio Limpio
```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Backup y Restore
```bash
# Backup
docker commit manteni-plus-app manteni-plus-backup
docker save manteni-plus-backup > backup.tar

# Restore
docker load < backup.tar
docker run -d --name manteni-plus-app manteni-plus-backup
```

---

## 📚 Más Información

Ver documentación completa:
- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
- [QUICK_START_DOCKER.md](./QUICK_START_DOCKER.md)

---

¡Guarda este archivo como referencia rápida! 📖
