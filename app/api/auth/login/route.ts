// Endpoint: POST /api/auth/login
// Historia de Usuario: US-02 - Inicio de sesión

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateToken, toUsuarioResponse } from '@/lib/auth'
import { validateData, loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener el body de la petición
    const body = await request.json()

    // 2. Validar los datos con Zod
    const validation = validateData(loginSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { correo, contrasena } = validation.data

    // 3. Buscar el usuario por correo
    const usuario = await db.usuarios.findByCorreo(correo)
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // 4. Verificar la contraseña
    const contrasenaValida = await verifyPassword(contrasena, usuario.contrasena)
    
    if (!contrasenaValida) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // 5. Generar token JWT
    const token = await generateToken(usuario)
    
    // 6. Guardar la sesión como activa
    db.sessions.add(token)

    // 7. Retornar el usuario y el token
    const usuarioResponse = toUsuarioResponse(usuario)

    // 8. Crear la respuesta con el token en una cookie httpOnly
    const response = NextResponse.json(
      { 
        usuario: usuarioResponse,
        token 
      },
      { status: 200 }
    )

    // Configurar cookie con el token (httpOnly para seguridad)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Error en POST /api/auth/login:', error)
    
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
