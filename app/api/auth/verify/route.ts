import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromSupabaseToken, getCurrentUserOrSupabase } from '@/lib/auth'

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

    // Diagnostic : on utilise d'abord Supabase pour avoir un message d'erreur précis
    const supabaseResult = await getCurrentUserFromSupabaseToken(token)
    if (supabaseResult.user) {
      const user = supabaseResult.user
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
    }
    if (supabaseResult.error) {
      // Tenter quand même le JWT legacy (anciens tokens)
      const legacyUser = await getCurrentUserOrSupabase(token)
      if (legacyUser) {
        return NextResponse.json({
          authenticated: true,
          isAdmin: legacyUser.role === 'ADMIN',
          user: {
            id: legacyUser.id,
            email: legacyUser.email,
            name: legacyUser.name,
            role: legacyUser.role,
            avatar: legacyUser.avatar,
          },
        }, { status: 200 })
      }
      console.error('[verify] Supabase/DB error:', supabaseResult.error)
      return NextResponse.json(
        {
          authenticated: false,
          isAdmin: false,
          error: supabaseResult.error,
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: false, isAdmin: false, error: 'Token invalide ou utilisateur non trouvé' },
      { status: 401 }
    )
  } catch (error) {
    console.error('[verify] Error verifying token:', error)
    return NextResponse.json(
      { authenticated: false, isAdmin: false, error: `Erreur de vérification: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
