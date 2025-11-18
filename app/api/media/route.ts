import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')
    const performanceId = searchParams.get('performanceId')

    const where: any = {}
    if (type) {
      where.type = type.toUpperCase()
    }
    if (performanceId) {
      where.performanceId = performanceId
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ media }, { status: 200 })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Seuls ADMIN et ARTIST peuvent créer des médias
    if (payload.role !== 'ADMIN' && payload.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Accès refusé. Admin ou Artiste uniquement.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, url, thumbnailUrl, title, description, performanceId } = body

    if (!type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Si performanceId est fourni, vérifier que l'artiste en est propriétaire
    if (performanceId && payload.role === 'ARTIST') {
      const performance = await prisma.performance.findUnique({
        where: { id: performanceId },
      })

      if (!performance) {
        return NextResponse.json(
          { error: 'Performance non trouvée' },
          { status: 404 }
        )
      }

      if (performance.userId !== payload.id) {
        return NextResponse.json(
          { error: 'Vous ne pouvez ajouter des médias qu\'à vos propres performances' },
          { status: 403 }
        )
      }
    }

    const media = await prisma.media.create({
      data: {
        type: type.toUpperCase(),
        url,
        thumbnailUrl,
        title,
        description,
        performanceId: performanceId || null,
      },
    })

    return NextResponse.json({ media }, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}

