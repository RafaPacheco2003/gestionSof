// Endpoint: POST /api/auth/logout
// Funcionalidad: Cerrar sesión

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener el token de la cookie
    const token = request.cookies.get('auth-token')?.value

    // 2. Si hay token, eliminarlo de las sesiones activas
    if (token) {
      db.sessions.remove(token)
    }

    // 3. Crear respuesta
    const response = NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 }
    )

    // 4. Eliminar la cookie
    response.cookies.delete('auth-token')

    return response

  } catch (error) {
    console.error('Error en POST /api/auth/logout:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
