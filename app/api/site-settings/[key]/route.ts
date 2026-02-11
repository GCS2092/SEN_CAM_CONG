import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyTokenOrSupabase } from '@/lib/auth'

async function getSetting(
  request: NextRequest,
  context: { params: Promise<{ key: string }> | { key: string } }
) {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const setting = await prisma.siteSettings.findUnique({
      where: { key: resolvedParams.key },
    })

    if (!setting) {
      return NextResponse.json({ setting: null }, { status: 200 })
    }

    return NextResponse.json({ setting }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération du paramètre')
  }
}

export const GET = withRateLimit(getSetting)

async function updateSetting(
  request: NextRequest,
  context: { params: Promise<{ key: string }> | { key: string } }
) {
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

    const payload = await verifyTokenOrSupabase(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const body = await request.json()
    const { value, type, description } = body

    const setting = await prisma.siteSettings.upsert({
      where: { key: resolvedParams.key },
      update: {
        value,
        type: type || 'text',
        description,
        updatedBy: payload.id,
      },
      create: {
        key: resolvedParams.key,
        value,
        type: type || 'text',
        description,
        updatedBy: payload.id,
      },
    })

    return NextResponse.json({ setting }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour du paramètre')
  }
}

export const PUT = withRateLimit(updateSetting, { windowMs: 60 * 1000, max: 10 })

async function deleteSetting(
  request: NextRequest,
  context: { params: Promise<{ key: string }> | { key: string } }
) {
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

    const payload = await verifyTokenOrSupabase(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    await prisma.siteSettings.delete({
      where: { key: resolvedParams.key },
    })

    return NextResponse.json({ message: 'Paramètre supprimé' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression du paramètre')
  }
}

export const DELETE = withRateLimit(deleteSetting, { windowMs: 60 * 1000, max: 5 })

