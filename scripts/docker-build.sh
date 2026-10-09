#!/bin/bash

# Script para construir la imagen Docker
# Manteni+ Escolar

set -e

echo "🐳 Construyendo imagen Docker para Manteni+ Escolar..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Nombre de la imagen
IMAGE_NAME="manteni-plus"
VERSION="1.0.0"

echo -e "${BLUE}📦 Imagen: ${IMAGE_NAME}:${VERSION}${NC}"

# Preguntar si quiere limpiar cache
read -p "¿Limpiar cache de Docker antes de build? (recomendado) [Y/n]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}🧹 Limpiando builder cache...${NC}"
    docker builder prune -f
fi

echo -e "${BLUE}🔨 Iniciando build...${NC}"

# Build de la imagen
docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

echo -e "${GREEN}✅ Imagen construida exitosamente!${NC}"
echo ""
echo "📋 Información de la imagen:"
docker images ${IMAGE_NAME}:latest
echo ""
echo "📋 Para ejecutar la imagen:"
echo "   docker run -p 3000:3000 -e JWT_SECRET=tu-clave ${IMAGE_NAME}:latest"
echo ""
echo "📋 O usar docker-compose:"
echo "   docker-compose up -d"
