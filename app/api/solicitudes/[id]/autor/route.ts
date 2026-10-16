// Endpoint: GET /api/solicitudes/[id]/autor
// Datos de contacto del autor. Solo "Encargado de mantenimiento" o "Administrador"

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSesion } from '@/lib/session'
import { ROLES_PRIVILEGIADOS } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sesion = await getSesion(request)
    if (!sesion) {
      return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 })
    }

    if (!ROLES_PRIVILEGIADOS.includes(sesion.puesto)) {
      return NextResponse.json(
        { error: 'No tienes permisos para consultar esta información' },
        { status: 403 }
      )
    }

    const { id: idParam } = await params
    const id = Number(idParam)
    const solicitud = Number.isInteger(id) && id > 0
      ? await db.solicitudes.findById(id)
      : undefined

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    const usuario = await db.usuarios.findById(solicitud.autorId)
    if (!usuario) {
      return NextResponse.json(
        { error: 'No se encontraron datos del autor de esta solicitud' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { nombre: usuario.nombre, telefono: usuario.telefono, puesto: usuario.puesto },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en GET /api/solicitudes/[id]/autor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
