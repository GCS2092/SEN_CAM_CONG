import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenOrSupabase } from '@/lib/auth'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'
import { commentSchema } from '@/lib/validations'

// Créer un commentaire (nécessite authentification)
async function createComment(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification (requis pour commenter)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour commenter' },
        { status: 401 }
      )
    }

    const payload = await verifyTokenOrSupabase(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    const body = await request.json()
    const validation = commentSchema.safeParse({
      ...body,
      eventId: resolvedParams.id,
      userId: payload.id,
    })

    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        userId: payload.id,
        eventId: resolvedParams.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la création du commentaire')
  }
}

export const POST = withRateLimit(createComment, { windowMs: 60 * 1000, max: 10 })

// Récupérer les commentaires d'un événement (accessible à tous)
async function getComments(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    const comments = await prisma.comment.findMany({
      where: {
        eventId: resolvedParams.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des commentaires')
  }
}

export const GET = withRateLimit(getComments)

