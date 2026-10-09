# 🐳 Guía de Deployment con Docker - Manteni+ Escolar

Guía completa para deployar la aplicación usando Docker y Docker Compose.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (versión 20.10+)
- **Docker Compose** (versión 2.0+)

### Verificar instalación:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Opción 1: Deployment Rápido con Scripts

### 1. Build y Deploy Completo
```bash
# Ejecutar deployment completo (build + compose + health check)
bash scripts/docker-deploy.sh
```

Este script:
- ✅ Construye la imagen Docker
- ✅ Verifica variables de entorno
- ✅ Inicia servicios con docker-compose
- ✅ Hace health check del servicio
- ✅ Muestra información del deployment

### 2. Solo Build de Imagen
```bash
# Construir imagen Docker
bash scripts/docker-build.sh
```

### 3. Solo Ejecutar Contenedor
```bash
# Ejecutar contenedor con configuración básica
bash scripts/docker-run.sh
```

---

## 🛠️ Opción 2: Deployment Manual Paso a Paso

### Paso 1: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.production

# Editar con tus valores
nano .env.production
```

**Importante:** Cambia estos valores:
```env
JWT_SECRET=tu-clave-muy-segura-aqui-64-caracteres-minimo
```

Generar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 2: Build de la Imagen

```bash
# Construir imagen Docker
docker build -t manteni-plus:latest .
```

Esto creará una imagen optimizada multi-stage que:
- Instala dependencias
- Compila la aplicación Next.js
- Genera imagen final mínima (~200MB)

### Paso 3: Ejecutar con Docker

#### Opción A: Docker Run
```bash
docker run -d \
  --name manteni-plus-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=tu-clave-secreta \
  --restart unless-stopped \
  manteni-plus:latest
```

#### Opción B: Docker Compose (Recomendado)
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Paso 4: Verificar el Deployment

```bash
# Verificar que el contenedor está corriendo
docker ps

# Ver logs
docker logs manteni-plus-app

# Health check
curl http://localhost:3000/
```

---

## 📦 Docker Compose - Configuración Completa

El archivo `docker-compose.yml` incluye:

### Servicio Principal (app)
- Aplicación Next.js
- Puerto 3000
- Health checks automáticos
- Restart policy

### Servicios Opcionales (Comentados)

#### PostgreSQL
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: manteni_user
    POSTGRES_PASSWORD: ${DB_PASSWORD}
    POSTGRES_DB: manteni_db
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

#### Nginx (Proxy Reverso)
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

---

## 🔧 Comandos Docker Útiles

### Gestión de Contenedores
```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Detener contenedor
docker stop manteni-plus-app

# Iniciar contenedor detenido
docker start manteni-plus-app

# Reiniciar contenedor
docker restart manteni-plus-app

# Eliminar contenedor
docker rm -f manteni-plus-app
```

### Logs y Debugging
```bash
# Ver logs en tiempo real
docker logs -f manteni-plus-app

# Ver últimas 100 líneas
docker logs --tail 100 manteni-plus-app

# Acceder al contenedor (shell)
docker exec -it manteni-plus-app sh

# Ver uso de recursos
docker stats manteni-plus-app
```

### Imágenes
```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi manteni-plus:latest

# Limpiar imágenes sin usar
docker image prune -a

# Ver espacio usado
docker system df
```

### Docker Compose
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Rebuild y reiniciar
docker-compose up -d --build

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Escalar servicio (múltiples instancias)
docker-compose up -d --scale app=3

# Ver estado de servicios
docker-compose ps

# Ejecutar comando en servicio
docker-compose exec app sh
```

---

## 🌐 Deployment en Servidores Cloud

### AWS EC2 / Google Cloud / DigitalOcean

1. **Conectar al servidor**
```bash
ssh usuario@tu-servidor.com
```

2. **Instalar Docker**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Clonar repositorio**
```bash
git clone https://github.com/tu-usuario/gestiondeSoftware.git
cd gestiondeSoftware
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env.production
nano .env.production
# Configurar JWT_SECRET y otras variables
```

5. **Iniciar aplicación**
```bash
bash scripts/docker-deploy.sh
```

6. **Configurar firewall**
```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

### Docker Hub (Registry)

1. **Login en Docker Hub**
```bash
docker login
```

2. **Tag de la imagen**
```bash
docker tag manteni-plus:latest tu-usuario/manteni-plus:1.0.0
docker tag manteni-plus:latest tu-usuario/manteni-plus:latest
```

3. **Push a Docker Hub**
```bash
docker push tu-usuario/manteni-plus:1.0.0
docker push tu-usuario/manteni-plus:latest
```

4. **Pull desde otro servidor**
```bash
docker pull tu-usuario/manteni-plus:latest
docker run -d -p 3000:3000 tu-usuario/manteni-plus:latest
```

---

## 🔒 Configuración de Producción

### 1. Variables de Entorno Seguras

**NO uses valores por defecto en producción:**

```bash
# Generar JWT_SECRET seguro
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "JWT_SECRET=$JWT_SECRET" >> .env.production
```

### 2. HTTPS con Nginx

Crear `nginx.conf`:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Descomentar servicio nginx en `docker-compose.yml`.

### 3. SSL con Let's Encrypt

```bash
# Instalar certbot
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot certonly --standalone \
  -d tu-dominio.com
```

### 4. Límites de Recursos

Modificar `docker-compose.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 📊 Monitoreo y Logs

### Logs Centralizados

```bash
# Configurar logging driver
docker-compose.yml:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

### Health Checks

El Dockerfile ya incluye health checks:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

Verificar salud:
```bash
docker inspect --format='{{.State.Health.Status}}' manteni-plus-app
```

---

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs de error
docker logs manteni-plus-app

# Verificar configuración
docker inspect manteni-plus-app

# Probar sin -d para ver output
docker-compose up
```

### Puerto 3000 ya en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # Usar puerto 8080 en el host
```

### Problemas de build

```bash
# Limpiar cache de Docker
docker builder prune -a

# Rebuild sin cache
docker build --no-cache -t manteni-plus:latest .
```

### Contenedor se reinicia constantemente

```bash
# Ver logs
docker logs --tail 50 manteni-plus-app

# Verificar variables de entorno
docker exec manteni-plus-app env

# Verificar health check
docker inspect manteni-plus-app | grep Health -A 10
```

---

## 🔄 Actualización de la Aplicación

### Proceso de Actualización

```bash
# 1. Pull últimos cambios
git pull origin main

# 2. Rebuild imagen
docker-compose build --no-cache

# 3. Reiniciar servicios
docker-compose up -d

# 4. Verificar
docker-compose ps
docker-compose logs -f app
```

### Zero-downtime Deployment

```bash
# 1. Iniciar nueva versión en puerto diferente
docker run -d --name manteni-plus-app-new -p 3001:3000 manteni-plus:latest

# 2. Health check
curl http://localhost:3001/

# 3. Cambiar proxy/load balancer a nuevo puerto

# 4. Detener versión anterior
docker stop manteni-plus-app
docker rm manteni-plus-app

# 5. Renombrar nueva versión
docker rename manteni-plus-app-new manteni-plus-app
```

---

## 📈 Optimizaciones de Producción

### 1. Multi-stage Build
El Dockerfile ya usa multi-stage para minimizar tamaño:
- Base dependencies: ~500MB
- Builder: ~800MB
- Final image: ~200MB

### 2. Build Cache
```bash
# Aprovechar cache de Docker
docker build --cache-from manteni-plus:latest -t manteni-plus:latest .
```

### 3. Recursos
```yaml
deploy:
  replicas: 2
  resources:
    limits:
      cpus: '0.50'
      memory: 512M
```

---

## ✅ Checklist de Deployment

- [ ] Variables de entorno configuradas (JWT_SECRET)
- [ ] Docker y Docker Compose instalados
- [ ] Imagen construida exitosamente
- [ ] Contenedor corriendo (`docker ps`)
- [ ] Aplicación responde en puerto 3000
- [ ] Health check pasando
- [ ] Logs sin errores
- [ ] Firewall configurado
- [ ] HTTPS configurado (producción)
- [ ] Backup y estrategia de actualización definida
- [ ] Monitoreo configurado

---

## 🎯 Próximos Pasos

1. Migrar base de datos en memoria a PostgreSQL
2. Configurar Nginx como proxy reverso
3. Implementar SSL con Let's Encrypt
4. Configurar CI/CD (GitHub Actions / GitLab CI)
5. Implementar logging centralizado
6. Configurar backups automáticos

---

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Next.js Docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

---

¡Listo para deployar! 🚀
