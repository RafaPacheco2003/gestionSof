// Endpoint: POST /api/solicitudes
// Historia de Usuario: US-03 - Registrar problema detectado en la escuela

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { validateData, solicitudSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar sesión: leer token de cookie o header Authorization
    const cookieToken = request.cookies.get('auth-token')?.value
    const authHeader = request.headers.get('Authorization')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined

    const rawToken = cookieToken ?? bearerToken

    if (!rawToken) {
      return NextResponse.json(
        { error: 'Sesión no válida' },
        { status: 401 }
      )
    }

    // 2. Validar que el token JWT sea correcto y la sesión esté activa
    const tokenResult = await verifyToken(rawToken)

    if (!tokenResult.success || !db.sessions.isActive(rawToken)) {
      return NextResponse.json(
        { error: 'Sesión no válida' },
        { status: 401 }
      )
    }

    // 3. Obtener nombre del autor desde el payload del token
    const autor = (tokenResult.payload as { nombre?: string }).nombre ?? 'Desconocido'

    // 4. Parsear y validar el body de la petición
    const body = await request.json()

    const validation = validateData(solicitudSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { nombre, descripcion, prioridad, ubicacion } = validation.data

    // 5. Crear la solicitud en la base de datos
    const nuevaSolicitud = await db.solicitudes.create({
      nombre,
      descripcion,
      prioridad,
      ubicacion,
      autor,
    })

    // 6. Retornar la solicitud creada (201 Created)
    return NextResponse.json(nuevaSolicitud, { status: 201 })

  } catch (error) {
    console.error('Error en POST /api/solicitudes:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'El cuerpo de la petición no es un JSON válido' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
