import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleValidationError, handleServerError } from '@/lib/api-helpers'

async function getSocialLinks(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const socialLinks = await prisma.socialLink.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ socialLinks }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération des liens sociaux')
  }
}

export const GET = withRateLimit(getSocialLinks)

async function createSocialLink(request: NextRequest) {
  try {
    const body = await request.json()
    const { socialLinkSchema } = await import('@/lib/validations')

    const validation = socialLinkSchema.safeParse(body)
    if (!validation.success) {
      return handleValidationError(validation.error)
    }

    const data = validation.data
    const socialLink = await prisma.socialLink.create({
      data: {
        name: data.name,
        url: data.url,
        icon: data.icon || data.name,
        description: data.description,
        order: data.order,
        active: data.active,
      },
    })

    return NextResponse.json({ socialLink }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un lien avec ce nom existe déjà' },
        { status: 400 }
      )
    }
    return handleServerError(error, 'Erreur lors de la création du lien social')
  }
}

export const POST = withRateLimit(createSocialLink, { windowMs: 60 * 1000, max: 10 })

