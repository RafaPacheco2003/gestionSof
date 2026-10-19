// Sistema de base de datos en memoria (simulación)
// En producción, esto se reemplazaría con una base de datos real (PostgreSQL, MongoDB, etc.)

import bcrypt from 'bcryptjs'
import { ROL_ADMIN } from './types'
import type { Usuario, Solicitud, Ubicacion, EstadoSolicitud } from './types'

// Catálogo de ubicaciones/edificios (datos fijos)
const UBICACIONES: Ubicacion[] = [
  { id: 1, edificio: 'Edificio A' },
  { id: 2, edificio: 'Edificio B' },
  { id: 3, edificio: 'Cancha' },
  { id: 4, edificio: 'Biblioteca' },
  { id: 5, edificio: 'Laboratorio' },
]

// Almacenamiento en memoria
// Administrador hardcodeado (credenciales sobreescribibles por variables de entorno)
const crearAdmin = (): Usuario => ({
  id: 1,
  nombre: 'Administrador',
  telefono: '0000000000',
  correo: (process.env.ADMIN_EMAIL || 'admin@manteniplus.com').toLowerCase(),
  puesto: ROL_ADMIN,
  contrasena: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin12345', 10),
  createdAt: new Date(),
})

let usuarios: Usuario[] = [crearAdmin()]
let nextId = 2

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
    create: async (data: Omit<Solicitud, 'id' | 'fechaCreacion' | 'estado' | 'fechaSolucion'>): Promise<Solicitud> => {
      const nuevaSolicitud: Solicitud = {
        ...data,
        id: nextSolicitudId++,
        estado: 'PENDIENTE',
        fechaSolucion: null,
        fechaCreacion: new Date().toISOString().replace('Z', '').split('.')[0],
      }
      solicitudes.push(nuevaSolicitud)
      return nuevaSolicitud
    },

    // Obtener todas las solicitudes
    getAll: async (): Promise<Solicitud[]> => {
      return solicitudes
    },

    // Buscar solicitud por ID
    findById: async (id: number): Promise<Solicitud | undefined> => {
      return solicitudes.find(s => s.id === id)
    },

    // Cambiar estado; fechaSolucion solo se guarda al pasar a SOLUCIONADO
    updateEstado: async (id: number, estado: EstadoSolicitud): Promise<Solicitud | undefined> => {
      const solicitud = solicitudes.find(s => s.id === id)
      if (!solicitud) return undefined
      solicitud.estado = estado
      solicitud.fechaSolucion = estado === 'SOLUCIONADO'
        ? new Date().toISOString().replace('Z', '').split('.')[0]
        : null
      return solicitud
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
  usuarios = [crearAdmin()]
  nextId = 2
  solicitudes = []
  nextSolicitudId = 1
  activeSessions.clear()
}
