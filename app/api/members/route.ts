import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyToken } from '@/lib/auth'

async function getMembers(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const nationality = searchParams.get('nationality')
    const active = searchParams.get('active')

    const where: any = {}
    
    if (nationality) {
      where.nationality = nationality
    }
    
    if (active !== null) {
      where.active = active === 'true'
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ],
    })

    return NextResponse.json({ members }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des membres')
  }
}

export const GET = withRateLimit(getMembers)

async function createMember(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'ARTIST')) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, role, bio, imageUrl, nationality, instruments, order, active, userId } = body

    if (!name || !nationality) {
      return NextResponse.json(
        { error: 'Le nom et la nationalité sont requis' },
        { status: 400 }
      )
    }

    // Si c'est un artiste (pas admin), lier automatiquement à son compte User
    const memberUserId = payload.role === 'ARTIST' ? payload.id : (userId || null)

    const member = await prisma.member.create({
      data: {
        name,
        role: role || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        nationality,
        instruments: instruments || [],
        order: order || 0,
        active: active !== undefined ? active : true,
        updatedBy: payload.id,
        userId: memberUserId,
      },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la création du membre')
  }
}

export const POST = withRateLimit(createMember, { windowMs: 60 * 1000, max: 10 })

