import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function getSocialLink(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const socialLink = await prisma.socialLink.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!socialLink) {
      return NextResponse.json({ error: 'Lien non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ socialLink }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération du lien social')
  }
}

export const GET = withRateLimit(getSocialLink)

async function updateSocialLink(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const body = await request.json()
    const { socialLinkUpdateSchema } = await import('@/lib/validations')

    const validation = socialLinkUpdateSchema.safeParse(body)
    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data
    const socialLink = await prisma.socialLink.update({
      where: { id: resolvedParams.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.url && { url: data.url }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      },
    })

    return NextResponse.json({ socialLink }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un lien avec ce nom existe déjà' },
        { status: 400 }
      )
    }
    return handleServerError(error, 'Erreur lors de la mise à jour du lien social')
  }
}

export const PUT = withRateLimit(updateSocialLink, { windowMs: 60 * 1000, max: 10 })

async function deleteSocialLink(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { params } = context
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    await prisma.socialLink.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Lien supprimé' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression du lien social')
  }
}

export const DELETE = withRateLimit(deleteSocialLink, { windowMs: 60 * 1000, max: 5 })

