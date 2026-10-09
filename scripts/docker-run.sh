#!/bin/bash

# Script para ejecutar el contenedor Docker
# Manteni+ Escolar

set -e

echo "🚀 Iniciando Manteni+ Escolar con Docker..."

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

IMAGE_NAME="manteni-plus"
CONTAINER_NAME="manteni-plus-app"
PORT=3000

# Verificar si el contenedor ya existe
if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
    echo "⚠️  Deteniendo contenedor existente..."
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# Ejecutar contenedor
echo -e "${BLUE}🐳 Iniciando contenedor en puerto ${PORT}...${NC}"

docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT}:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=${JWT_SECRET:-manteni-plus-secret-key-change-me} \
  --restart unless-stopped \
  ${IMAGE_NAME}:latest

echo -e "${GREEN}✅ Contenedor iniciado exitosamente!${NC}"
echo ""
echo "📋 Información:"
echo "   URL: http://localhost:${PORT}"
echo "   Container: ${CONTAINER_NAME}"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs:      docker logs -f ${CONTAINER_NAME}"
echo "   Detener:       docker stop ${CONTAINER_NAME}"
echo "   Reiniciar:     docker restart ${CONTAINER_NAME}"
echo "   Eliminar:      docker rm -f ${CONTAINER_NAME}"
