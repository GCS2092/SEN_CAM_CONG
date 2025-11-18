import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function login(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const { email, password } = validation.data

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Générer le token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la connexion')
  }
}

// Rate limit strict pour la connexion : 5 tentatives par 15 minutes
export const POST = withRateLimit(login, { windowMs: 15 * 60 * 1000, max: 5 })

