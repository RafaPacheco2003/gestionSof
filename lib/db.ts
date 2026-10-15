// Sistema de base de datos en memoria (simulación)
// En producción, esto se reemplazaría con una base de datos real (PostgreSQL, MongoDB, etc.)

import type { Usuario, Solicitud, Ubicacion } from './types'

// Catálogo de ubicaciones/edificios (datos fijos)
const UBICACIONES: Ubicacion[] = [
  { id: 1, edificio: 'Edificio A' },
  { id: 2, edificio: 'Edificio B' },
  { id: 3, edificio: 'Cancha' },
  { id: 4, edificio: 'Biblioteca' },
  { id: 5, edificio: 'Laboratorio' },
]

// Almacenamiento en memoria
let usuarios: Usuario[] = []
let nextId = 1

// Almacenamiento de solicitudes en memoria
let solicitudes: Solicitud[] = []
let nextSolicitudId = 1

// Tokens de sesión activos
const activeSessions = new Set<string>()

export const db = {
  usuarios: {
    // Crear un nuevo usuario
    create: async (data: Omit<Usuario, 'id' | 'createdAt'>): Promise<Usuario> => {
      const nuevoUsuario: Usuario = {
        ...data,
        id: nextId++,
        createdAt: new Date(),
      }
      usuarios.push(nuevoUsuario)
      return nuevoUsuario
    },

    // Buscar usuario por nombre
    findByNombre: async (nombre: string): Promise<Usuario | undefined> => {
      return usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase())
    },

    // Buscar usuario por correo
    findByCorreo: async (correo: string): Promise<Usuario | undefined> => {
      return usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase())
    },

    // Buscar usuario por teléfono
    findByTelefono: async (telefono: string): Promise<Usuario | undefined> => {
      return usuarios.find(u => u.telefono.trim() === telefono.trim())
    },

    // Buscar usuario por ID
    findById: async (id: number): Promise<Usuario | undefined> => {
      return usuarios.find(u => u.id === id)
    },

    // Obtener todos los usuarios (para debugging)
    getAll: async (): Promise<Usuario[]> => {
      return usuarios
    },
  },

  solicitudes: {
    // Crear una nueva solicitud
    create: async (data: Omit<Solicitud, 'id' | 'fechaCreacion' | 'estado'>): Promise<Solicitud> => {
      const nuevaSolicitud: Solicitud = {
        ...data,
        id: nextSolicitudId++,
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString().replace('Z', '').split('.')[0],
      }
      solicitudes.push(nuevaSolicitud)
      return nuevaSolicitud
    },

    // Obtener todas las solicitudes
    getAll: async (): Promise<Solicitud[]> => {
      return solicitudes
    },
  },

  ubicaciones: {
    // Obtener el catálogo completo de ubicaciones
    getAll: (): Ubicacion[] => {
      return UBICACIONES
    },
  },

  sessions: {
    // Agregar una sesión activa
    add: (token: string): void => {
      activeSessions.add(token)
    },

    // Verificar si una sesión está activa
    isActive: (token: string): boolean => {
      return activeSessions.has(token)
    },

    // Eliminar una sesión
    remove: (token: string): void => {
      activeSessions.delete(token)
    },

    // Limpiar todas las sesiones (para debugging)
    clear: (): void => {
      activeSessions.clear()
    },
  },
}

// Función para resetear la base de datos (útil para desarrollo/testing)
export const resetDB = () => {
  usuarios = []
  nextId = 1
  solicitudes = []
  nextSolicitudId = 1
  activeSessions.clear()
}
