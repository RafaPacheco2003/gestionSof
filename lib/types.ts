// Tipos principales para el sistema de usuarios

export const ROLES_REGISTRO = ['Encargado de mantenimiento', 'Docente', 'Alumno'] as const
export const ROL_ADMIN = 'Administrador'
export const ROLES_PRIVILEGIADOS: string[] = ['Encargado de mantenimiento', ROL_ADMIN]

export interface Usuario {
  id: number
  nombre: string
  telefono: string
  correo: string
  puesto: string
  contrasena: string
  createdAt: Date
}

export interface UsuarioResponse {
  id: number
  nombre: string
  telefono: string
  correo: string
  puesto: string
}

export interface LoginRequest {
  correo: string
  contrasena: string
}

export interface LoginResponse {
  usuario: UsuarioResponse
  token: string
}

// Tipos para el sistema de solicitudes de mantenimiento
export type PrioridadSolicitud = 'ROJO' | 'NARANJA' | 'VERDE'

export interface UbicacionSolicitud {
  edificio: string
  area: string
}

export interface Solicitud {
  id: number
  nombre: string
  descripcion: string
  prioridad: PrioridadSolicitud
  estado: 'PENDIENTE'
  ubicacion: UbicacionSolicitud
  autor: string
  autorId: number
  fechaCreacion: string
}

export interface SolicitudRequest {
  nombre: string
  descripcion: string
  prioridad: PrioridadSolicitud
  ubicacion: UbicacionSolicitud
}

// Catálogo de ubicaciones (edificios/zonas)
export interface Ubicacion {
  id: number
  edificio: string
}

// Respuesta de datos del autor (solo para roles autorizados)
export interface AutorResponse {
  id?: number
  nombre: string
  telefono: string
  puesto: string
}
