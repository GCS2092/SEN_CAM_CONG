import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function getEvent(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        performances: {
          include: {
            media: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération de l\'événement')
  }
}

export const GET = withRateLimit(getEvent)

async function updateEvent(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const body = await request.json()
    const { eventUpdateSchema } = await import('@/lib/validations')

    const validation = eventUpdateSchema.safeParse(body)
    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data
    const event = await prisma.event.update({
      where: { id: resolvedParams.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.location && { location: data.location }),
        ...(data.venue !== undefined && { venue: data.venue }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.externalUrl !== undefined && { externalUrl: data.externalUrl }),
        ...(data.ticketPrice !== undefined && { ticketPrice: data.ticketPrice }),
        ...(data.status && { status: data.status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour de l\'événement')
  }
}

export const PUT = withRateLimit(updateEvent, { windowMs: 60 * 1000, max: 10 })

async function deleteEvent(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    await prisma.event.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Event deleted' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression de l\'événement')
  }
}

export const DELETE = withRateLimit(deleteEvent, { windowMs: 60 * 1000, max: 5 })

