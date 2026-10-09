#!/bin/bash

# Script completo de deployment
# Manteni+ Escolar

set -e

echo "🚀 Deployment completo de Manteni+ Escolar"
echo "=========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Build
echo -e "${BLUE}📦 Paso 1: Construyendo imagen Docker...${NC}"
bash scripts/docker-build.sh

# 2. Verificar .env
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  Advertencia: .env.production no existe${NC}"
    echo "   Creando desde .env.example..."
    cp .env.example .env.production
    echo -e "${YELLOW}   ⚠️  IMPORTANTE: Edita .env.production con valores reales${NC}"
fi

# 3. Docker Compose
echo -e "${BLUE}🐳 Paso 2: Iniciando servicios con Docker Compose...${NC}"
docker-compose down
docker-compose up -d

# 4. Esperar que el servicio esté listo
echo -e "${BLUE}⏳ Esperando que el servicio inicie...${NC}"
sleep 5

# 5. Health check
echo -e "${BLUE}🏥 Paso 3: Verificando salud del servicio...${NC}"
RETRIES=10
for i in $(seq 1 $RETRIES); do
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Servicio respondiendo correctamente!${NC}"
        break
    fi
    if [ $i -eq $RETRIES ]; then
        echo "❌ El servicio no responde después de ${RETRIES} intentos"
        exit 1
    fi
    echo "   Intento $i/$RETRIES..."
    sleep 2
done

# 6. Mostrar información
echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment completado exitosamente!"
echo "==========================================${NC}"
echo ""
echo "📋 Información del servicio:"
echo "   URL: http://localhost:3000"
echo "   Estado: docker-compose ps"
echo "   Logs: docker-compose logs -f app"
echo ""
echo "🔧 Comandos útiles:"
echo "   Detener:    docker-compose down"
echo "   Reiniciar:  docker-compose restart"
echo "   Rebuild:    docker-compose up -d --build"
echo ""
