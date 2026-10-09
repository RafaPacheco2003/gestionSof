/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Modo standalone para Docker - genera un servidor mínimo
  output: 'standalone',
  // Comprimir páginas estáticas
  compress: true,
  // Optimizaciones de producción
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
