// Sistema de base de datos en memoria (simulación)
// En producción, esto se reemplazaría con una base de datos real (PostgreSQL, MongoDB, etc.)

import type { Usuario } from './types'

// Almacenamiento en memoria
let usuarios: Usuario[] = []
let nextId = 1

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
  activeSessions.clear()
}
