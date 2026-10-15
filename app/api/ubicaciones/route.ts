// Endpoint: GET /api/ubicaciones
// Historia de Usuario: US-04 - Catálogo de edificios/zonas para selector de ubicación

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // 1. Obtener el catálogo completo de ubicaciones
    const ubicaciones = db.ubicaciones.getAll()

    // 2. Retornar la lista (200 OK)
    return NextResponse.json(ubicaciones, { status: 200 })

  } catch (error) {
    console.error('Error en GET /api/ubicaciones:', error)

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
