import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, hashPassword } from '@/lib/auth'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'
import { userUpdateSchema } from '@/lib/validations'

async function getUser(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération de l\'utilisateur')
  }
}

export const GET = withRateLimit(getUser)

async function updateUser(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    const body = await request.json()
    const validation = userUpdateSchema.safeParse(body)

    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {}
    if (data.email) updateData.email = data.email
    if (data.name !== undefined) updateData.name = data.name
    if (data.role) updateData.role = data.role
    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour de l\'utilisateur')
  }
}

export const PUT = withRateLimit(updateUser, { windowMs: 60 * 1000, max: 10 })

async function deleteUser(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Empêcher la suppression de son propre compte
    if (user.id === payload.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      )
    }

    // Supprimer l'utilisateur (les événements et performances seront supprimés en cascade)
    await prisma.user.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Utilisateur supprimé' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression de l\'utilisateur')
  }
}

export const DELETE = withRateLimit(deleteUser, { windowMs: 60 * 1000, max: 5 })

