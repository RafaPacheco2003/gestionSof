// Endpoint: POST /api/usuarios
// Historia de Usuario: US-01 - Registro de usuarios

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, toUsuarioResponse } from '@/lib/auth'
import { validateData, registroUsuarioSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener el body de la petición
    const body = await request.json()

    // 2. Validar los datos con Zod
    const validation = validateData(registroUsuarioSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { nombre, telefono, correo, puesto, contrasena } = validation.data

    // 3. Verificar si el nombre ya está registrado
    const usuarioExistente = await db.usuarios.findByNombre(nombre)
    
    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este nombre ya está registrado' },
        { status: 409 }
      )
    }

    // 4. Hashear la contraseña
    const contrasenaHasheada = await hashPassword(contrasena)

    // 5. Crear el usuario
    const nuevoUsuario = await db.usuarios.create({
      nombre,
      telefono,
      correo,
      puesto,
      contrasena: contrasenaHasheada,
    })

    // 6. Retornar el usuario creado (sin la contraseña)
    const usuarioResponse = toUsuarioResponse(nuevoUsuario)

    return NextResponse.json(usuarioResponse, { status: 201 })

  } catch (error) {
    console.error('Error en POST /api/usuarios:', error)
    
    // Si el error es de parseo JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'El cuerpo de la petición no es un JSON válido' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
