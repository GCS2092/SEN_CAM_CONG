import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function getPerformance(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const performance = await prisma.performance.findUnique({
      where: { id: resolvedParams.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
        media: true,
        _count: {
          select: {
            media: true,
          },
        },
      },
    })

    if (!performance) {
      return NextResponse.json(
        { error: 'Performance not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ performance }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération de la performance')
  }
}

export const GET = withRateLimit(getPerformance)

async function updatePerformance(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Vérifier l'authentification (ADMIN ou ARTIST)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    const { verifyToken } = await import('@/lib/auth')
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params

    // Vérifier si la performance existe et qui en est le propriétaire
    const existingPerformance = await prisma.performance.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPerformance) {
      return NextResponse.json(
        { error: 'Performance non trouvée' },
        { status: 404 }
      )
    }

    // Les ARTIST ne peuvent modifier que leurs propres performances
    if (payload.role === 'ARTIST' && existingPerformance.userId !== payload.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos propres performances' },
        { status: 403 }
      )
    }

    // Seuls ADMIN et ARTIST peuvent modifier
    if (payload.role !== 'ADMIN' && payload.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { performanceUpdateSchema } = await import('@/lib/validations')

    const validation = performanceUpdateSchema.safeParse(body)
    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data
    const performance = await prisma.performance.update({
      where: { id: resolvedParams.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.eventId !== undefined && { eventId: data.eventId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ performance }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour de la performance')
  }
}

export const PUT = withRateLimit(updatePerformance, { windowMs: 60 * 1000, max: 10 })

async function deletePerformance(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Vérifier l'authentification (ADMIN ou ARTIST)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    const { verifyToken } = await import('@/lib/auth')
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params

    // Vérifier si la performance existe et qui en est le propriétaire
    const existingPerformance = await prisma.performance.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPerformance) {
      return NextResponse.json(
        { error: 'Performance non trouvée' },
        { status: 404 }
      )
    }

    // Les ARTIST ne peuvent supprimer que leurs propres performances
    if (payload.role === 'ARTIST' && existingPerformance.userId !== payload.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez supprimer que vos propres performances' },
        { status: 403 }
      )
    }

    // Seuls ADMIN et ARTIST peuvent supprimer
    if (payload.role !== 'ADMIN' && payload.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    await prisma.performance.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Performance deleted' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression de la performance')
  }
}

export const DELETE = withRateLimit(deletePerformance, { windowMs: 60 * 1000, max: 5 })

