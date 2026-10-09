// Endpoint: GET /api/health
// Health check endpoint para Docker y monitoreo

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificaciones básicas de salud del sistema
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
