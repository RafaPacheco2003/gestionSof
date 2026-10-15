// Validaciones para el sistema según las especificaciones de US-01

import { z } from 'zod'

// Schema de validación para el registro de usuarios
export const registroUsuarioSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre es obligatorio')
    .trim(),
  
  telefono: z
    .string({ required_error: 'El teléfono es obligatorio' })
    .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
  
  correo: z
    .string({ required_error: 'El correo es obligatorio' })
    .email('El correo no tiene un formato válido')
    .toLowerCase()
    .trim(),
  
  puesto: z
    .string({ required_error: 'El puesto es obligatorio' })
    .min(1, 'El puesto es obligatorio')
    .trim(),
  
  contrasena: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener mínimo 8 caracteres'),
})

export type RegistroUsuarioInput = z.infer<typeof registroUsuarioSchema>

// Schema de validación para el login
export const loginSchema = z.object({
  correo: z
    .string({ required_error: 'El correo es obligatorio' })
    .email('El correo no tiene un formato válido')
    .toLowerCase()
    .trim(),
  
  contrasena: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schema de validación para crear una solicitud (US-03)
export const solicitudSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  descripcion: z
    .string({ required_error: 'La descripcion es obligatoria' })
    .min(1, 'La descripcion es obligatoria')
    .trim(),

  prioridad: z.enum(['ROJO', 'NARANJA', 'VERDE'], {
    required_error: 'La prioridad es obligatoria',
    error: 'Prioridad no válida',
  }),

  ubicacion: z.object({
    edificio: z
      .string({ required_error: 'El edificio es obligatorio' })
      .min(1, 'El edificio es obligatorio')
      .trim(),
    area: z
      .string({ required_error: 'El area es obligatoria' })
      .min(1, 'El area es obligatoria')
      .trim(),
  }, { required_error: 'La ubicacion es obligatoria' }),
})

export type SolicitudInput = z.infer<typeof solicitudSchema>

// Función auxiliar para validar datos
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    return { success: true as const, data: schema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { 
        success: false as const, 
        error: firstError.message 
      }
    }
    return { 
      success: false as const, 
      error: 'Error de validación desconocido' 
    }
  }
}
