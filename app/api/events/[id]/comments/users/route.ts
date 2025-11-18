import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'

// Récupérer la liste des utilisateurs qui ont commenté un événement (admin uniquement)
async function getCommentsUsers(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification admin
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
        { error: 'Accès refusé. Admin uniquement.' },
        { status: 403 }
      )
    }

    // Gérer les params synchrones et asynchrones (Next.js 14+)
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
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Grouper par utilisateur pour éviter les doublons
    const uniqueUsers = new Map()
    comments.forEach(comment => {
      if (!uniqueUsers.has(comment.user.id)) {
        uniqueUsers.set(comment.user.id, {
          ...comment.user,
          commentsCount: 0,
          firstCommentDate: comment.createdAt,
        })
      }
      uniqueUsers.get(comment.user.id).commentsCount++
    })

    const users = Array.from(uniqueUsers.values())

    return NextResponse.json({ 
      users, 
      count: users.length,
      totalComments: comments.length 
    }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des commentaires')
  }
}

export const GET = withRateLimit(getCommentsUsers)

