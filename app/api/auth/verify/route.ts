import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserOrSupabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = body.token ?? request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false, error: 'Token manquant' },
        { status: 401 }
      )
    }

    const user = await getCurrentUserOrSupabase(token)
    if (!user) {
      console.error('[verify] User not found for token')
      return NextResponse.json(
        { authenticated: false, isAdmin: false, error: 'Token invalide ou utilisateur non trouvé' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      isAdmin: user.role === 'ADMIN',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('[verify] Error verifying token:', error)
    return NextResponse.json(
      { authenticated: false, isAdmin: false, error: `Erreur de vérification: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
