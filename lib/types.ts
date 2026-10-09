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
  nombre: string
  contrasena: string
}

export interface LoginResponse {
  usuario: UsuarioResponse
  token: string
}
