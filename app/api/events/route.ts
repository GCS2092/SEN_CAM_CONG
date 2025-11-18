import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'

async function getEvents(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || limit || '10')
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (status) {
      where.status = status.toUpperCase()
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des événements')
  }
}

export const GET = withRateLimit(getEvents)

async function createEvent(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventSchema } = await import('@/lib/validations')
    const { handleValidationError, handleServerError } = await import('@/lib/api-helpers')

    const validation = eventSchema.safeParse(body)
    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
        venue: data.venue,
        imageUrl: data.imageUrl,
        externalUrl: data.externalUrl,
        ticketPrice: data.ticketPrice,
        userId: data.userId,
        status: new Date(data.date) > new Date() ? 'UPCOMING' : 'PAST',
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

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la création de l\'événement')
  }
}

export const POST = withRateLimit(createEvent, { windowMs: 60 * 1000, max: 10 }) // 10 créations par minute

