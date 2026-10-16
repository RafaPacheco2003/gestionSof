// Obtiene el usuario de la sesión activa a partir de la cookie o el header Authorization

import type { NextRequest } from 'next/server'
import { db } from './db'
import { verifyToken } from './auth'

export interface SesionActual {
  userId: number
  puesto: string
}

export async function getSesion(request: NextRequest): Promise<SesionActual | null> {
  const authHeader = request.headers.get('Authorization')
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  const token = request.cookies.get('auth-token')?.value ?? bearer

  if (!token) return null

  const result = await verifyToken(token)
  if (!result.success || !db.sessions.isActive(token)) return null

  const payload = result.payload as { userId?: number }
  if (typeof payload.userId !== 'number') return null

  // El rol se toma de la BD, no del token
  const usuario = await db.usuarios.findById(payload.userId)
  if (!usuario) return null

  return { userId: usuario.id, puesto: usuario.puesto }
}
