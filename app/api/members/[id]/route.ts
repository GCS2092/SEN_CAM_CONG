import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, handleServerError } from '@/lib/api-helpers'
import { verifyToken } from '@/lib/auth'

async function getMember(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const member = await prisma.member.findUnique({
      where: { id: resolvedParams.id },
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
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ member }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la récupération du membre')
  }
}

export const GET = withRateLimit(getMember)

async function updateMember(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
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

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    
    // Vérifier si l'artiste essaie de modifier son propre profil ou si c'est un admin
    const existingMember = await prisma.member.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    // Si c'est un artiste, il ne peut modifier que son propre profil
    if (payload.role === 'ARTIST' && existingMember.userId !== payload.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que votre propre profil' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, role, bio, imageUrl, nationality, instruments, order, active, userId } = body

    const member = await prisma.member.update({
      where: { id: resolvedParams.id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(bio !== undefined && { bio }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(nationality !== undefined && { nationality }),
        ...(instruments !== undefined && { instruments }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
        ...(userId !== undefined && payload.role === 'ADMIN' && { userId }), // Seul l'admin peut changer le userId
        updatedBy: payload.id,
      },
    })

    return NextResponse.json({ member }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la mise à jour du membre')
  }
}

export const PUT = withRateLimit(updateMember, { windowMs: 60 * 1000, max: 10 })

async function deleteMember(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
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

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    await prisma.member.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Membre supprimé' }, { status: 200 })
  } catch (error) {
    return handleServerError(error, 'Erreur lors de la suppression du membre')
  }
}

export const DELETE = withRateLimit(deleteMember, { windowMs: 60 * 1000, max: 10 })

