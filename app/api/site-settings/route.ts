import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyToken } from '@/lib/auth'

async function getSiteSettings(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    if (key) {
      const setting = await prisma.siteSettings.findUnique({
        where: { key },
      })
      return NextResponse.json({ setting }, { status: 200 })
    }

    const settings = await prisma.siteSettings.findMany({
      orderBy: { key: 'asc' },
    })

    return NextResponse.json({ settings }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des paramètres')
  }
}

export const GET = withRateLimit(getSiteSettings)

async function createOrUpdateSetting(request: NextRequest) {
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
    const { key, value, type = 'text', description } = body

    if (!key) {
      return NextResponse.json(
        { error: 'La clé est requise' },
        { status: 400 }
      )
    }

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: {
        value,
        type,
        description,
        updatedBy: payload.id,
      },
      create: {
        key,
        value,
        type,
        description,
        updatedBy: payload.id,
      },
    })

    return NextResponse.json({ setting }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la sauvegarde du paramètre')
  }
}

export const POST = withRateLimit(createOrUpdateSetting, { windowMs: 60 * 1000, max: 10 })

