import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'

// Récupérer la liste des utilisateurs qui ont liké un événement (admin uniquement)
async function getLikesUsers(
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

    const likes = await prisma.like.findMany({
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

    return NextResponse.json({ likes, count: likes.length }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des likes')
  }
}

export const GET = withRateLimit(getLikesUsers)

