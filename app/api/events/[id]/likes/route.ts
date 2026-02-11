import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenOrSupabase } from '@/lib/auth'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'

// Toggle like sur un événement (nécessite authentification)
async function toggleLike(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Vérifier l'authentification (requis pour liker)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour aimer un événement' },
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

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId: payload.id,
          eventId: resolvedParams.id,
        },
      },
    })

    if (existingLike) {
      // Retirer le like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return NextResponse.json({ liked: false, message: 'Like retiré' }, { status: 200 })
    } else {
      // Ajouter le like
      await prisma.like.create({
        data: {
          userId: payload.id,
          eventId: resolvedParams.id,
        },
      })

      return NextResponse.json({ liked: true, message: 'Événement aimé' }, { status: 200 })
    }
  } catch (error) {
    return handleServerError(error, 'Erreur lors de l\'ajout du like')
  }
}

export const POST = withRateLimit(toggleLike, { windowMs: 60 * 1000, max: 30 })

// Vérifier si l'utilisateur a liké (nécessite authentification)
async function checkLike(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json({ liked: false }, { status: 200 })
    }

    const payload = await verifyTokenOrSupabase(token)
    if (!payload) {
      return NextResponse.json({ liked: false }, { status: 200 })
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params

    const like = await prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId: payload.id,
          eventId: resolvedParams.id,
        },
      },
    })

    return NextResponse.json({ liked: !!like }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ liked: false }, { status: 200 })
  }
}

export const GET = withRateLimit(checkLike)

