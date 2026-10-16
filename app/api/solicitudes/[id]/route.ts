// Endpoint: GET /api/solicitudes/[id]
// Detalle de una solicitud con los datos de su autor (mantenimiento/admin; los demás solo las suyas)

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

    const { id: idParam } = await params
    const id = Number(idParam)
    const solicitud = Number.isInteger(id) && id > 0
      ? await db.solicitudes.findById(id)
      : undefined

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    const esPrivilegiado = ROLES_PRIVILEGIADOS.includes(sesion.puesto)

    // Docentes y alumnos solo ven las suyas; se responde 404 para no revelar su existencia
    if (!esPrivilegiado && solicitud.autorId !== sesion.userId) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    const usuario = await db.usuarios.findById(solicitud.autorId)

    return NextResponse.json(
      {
        ...solicitud,
        autor: usuario
          ? { id: usuario.id, nombre: usuario.nombre, puesto: usuario.puesto, telefono: usuario.telefono }
          : { id: solicitud.autorId, nombre: solicitud.autor, puesto: null, telefono: null },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en GET /api/solicitudes/[id]:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
