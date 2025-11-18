import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyToken } from '@/lib/auth'

async function getGlobalMedia(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const media = await prisma.globalMedia.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ media }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération du média')
  }
}

export const GET = withRateLimit(getGlobalMedia)

async function updateGlobalMedia(
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

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const body = await request.json()
    const { type, url, thumbnailUrl, title, description, category, order, active } = body

    const media = await prisma.globalMedia.update({
      where: { id: resolvedParams.id },
      data: {
        ...(type && { type: type.toUpperCase() }),
        ...(url && { url }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json({ media }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour du média')
  }
}

export const PUT = withRateLimit(updateGlobalMedia, { windowMs: 60 * 1000, max: 10 })

async function deleteGlobalMedia(
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

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    await prisma.globalMedia.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Média supprimé' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression du média')
  }
}

export const DELETE = withRateLimit(deleteGlobalMedia, { windowMs: 60 * 1000, max: 5 })

