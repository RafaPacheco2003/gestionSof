// Utilidades de autenticación y JWT

import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import type { Usuario, UsuarioResponse } from './types'

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'manteni-plus-secret-key-2024'
)

// Configuración de JWT
const JWT_EXPIRATION = '7d' // Token válido por 7 días

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compara una contraseña con su hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Genera un token JWT para un usuario
 */
export async function generateToken(usuario: Usuario): Promise<string> {
  const token = await new SignJWT({
    userId: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    puesto: usuario.puesto,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(SECRET_KEY)

  return token
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return { success: true, payload: verified.payload }
  } catch (error) {
    return { success: false, error: 'Token inválido o expirado' }
  }
}

/**
 * Convierte un Usuario en UsuarioResponse (sin contraseña)
 */
export function toUsuarioResponse(usuario: Usuario): UsuarioResponse {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    telefono: usuario.telefono,
    correo: usuario.correo,
    puesto: usuario.puesto,
  }
}
