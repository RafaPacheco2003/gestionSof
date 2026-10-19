// Endpoint: PATCH /api/solicitudes/[id]/estado - mover tarjeta entre columnas del tablero

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSesion } from '@/lib/session'
import { ESTADOS_SOLICITUD, ROLES_PRIVILEGIADOS } from '@/lib/types'
import type { EstadoSolicitud } from '@/lib/types'

export async function PATCH(
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
        { error: 'No tienes permisos para cambiar el estado' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => null)
    const estado = body?.estado
    if (typeof estado !== 'string' || !ESTADOS_SOLICITUD.includes(estado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
    }

    const { id: idParam } = await params
    const id = Number(idParam)
    const actualizada = Number.isInteger(id) && id > 0
      ? await db.solicitudes.updateEstado(id, estado as EstadoSolicitud)
      : undefined

    if (!actualizada) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    return NextResponse.json(
      { id: actualizada.id, estado: actualizada.estado, fechaSolucion: actualizada.fechaSolucion },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en PATCH /api/solicitudes/[id]/estado:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
