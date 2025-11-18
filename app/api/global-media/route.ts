import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyToken } from '@/lib/auth'

async function getGlobalMedia(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const active = searchParams.get('active')

    const where: any = {}
    if (category) where.category = category
    if (type) where.type = type.toUpperCase()
    if (active !== null) where.active = active === 'true'

    const media = await prisma.globalMedia.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ media }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des médias')
  }
}

export const GET = withRateLimit(getGlobalMedia)

async function createGlobalMedia(request: NextRequest) {
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

    const body = await request.json()
    const { type, url, thumbnailUrl, title, description, category, order = 0, active = true } = body

    if (!type || !url) {
      return NextResponse.json(
        { error: 'Le type et l\'URL sont requis' },
        { status: 400 }
      )
    }

    const media = await prisma.globalMedia.create({
      data: {
        type: type.toUpperCase(),
        url,
        thumbnailUrl,
        title,
        description,
        category,
        order,
        active,
      },
    })

    return NextResponse.json({ media }, { status: 201 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la création du média')
  }
}

export const POST = withRateLimit(createGlobalMedia, { windowMs: 60 * 1000, max: 10 })

