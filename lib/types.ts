// Tipos principales para el sistema de usuarios

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
