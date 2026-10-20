// Endpoint: GET /api/seguimiento/tablero - solicitudes agrupadas por estado (tablero Kanban)

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSesion } from '@/lib/session'
import type { Solicitud } from '@/lib/types'

interface TarjetaTablero {
  id: number
  nombre: string
  prioridad: Solicitud['prioridad']
  ubicacion: string
  autor: string
}

const ORDEN_PRIORIDAD: Record<Solicitud['prioridad'], number> = {
  ROJO: 0,
  NARANJA: 1,
  VERDE: 2,
}

export async function GET(request: NextRequest) {
  try {
    const sesion = await getSesion(request)
    if (!sesion) {
      return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 })
    }

    const tablero: Record<'pendiente' | 'enProceso' | 'solucionado', TarjetaTablero[]> = {
      pendiente: [],
      enProceso: [],
      solucionado: [],
    }

    for (const s of await db.solicitudes.getAll()) {
      const tarjeta: TarjetaTablero = {
        id: s.id,
        nombre: s.nombre,
        prioridad: s.prioridad,
        ubicacion: `${s.ubicacion.edificio} - ${s.ubicacion.area}`,
        autor: s.autor,
      }
      if (s.estado === 'EN_PROCESO') tablero.enProceso.push(tarjeta)
      else if (s.estado === 'SOLUCIONADO') tablero.solucionado.push(tarjeta)
      else tablero.pendiente.push(tarjeta)
    }

    for (const columna of Object.values(tablero)) {
      columna.sort((a, b) => ORDEN_PRIORIDAD[a.prioridad] - ORDEN_PRIORIDAD[b.prioridad])
    }

    return NextResponse.json(tablero, { status: 200 })
  } catch (error) {
    console.error('Error en GET /api/seguimiento/tablero:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
