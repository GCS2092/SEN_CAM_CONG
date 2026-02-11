import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenOrSupabase } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Gérer les params synchrones et asynchrones (Next.js 14+)
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = await verifyTokenOrSupabase(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Vérifier si le média existe et à quelle performance il appartient
    const media = await prisma.media.findUnique({
      where: { id: resolvedParams.id },
      include: {
        performance: true,
      },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      )
    }

    // Les ARTIST ne peuvent supprimer que les médias de leurs propres performances
    if (payload.role === 'ARTIST') {
      if (!media.performance || media.performance.userId !== payload.id) {
        return NextResponse.json(
          { error: 'Vous ne pouvez supprimer que les médias de vos propres performances' },
          { status: 403 }
        )
      }
    } else if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    await prisma.media.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: 'Media deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}

