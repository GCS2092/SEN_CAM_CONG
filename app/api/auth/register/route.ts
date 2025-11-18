import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function register(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const { email, password, name } = validation.data

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER',
      },
    })

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
    }, { status: 201 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de l\'inscription')
  }
}

// Rate limit pour l'inscription : 3 tentatives par 15 minutes
export const POST = withRateLimit(register, { windowMs: 15 * 60 * 1000, max: 3 })

