import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false, error: 'Token manquant' },
        { status: 401 }
      )
    }

    // Vérifier le token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false, error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur existe toujours en base
    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false, error: 'Utilisateur non trouvé' },
        { status: 401 }
      )
    }

    // Vérifier le rôle admin
    const isAdmin = user.role === 'ADMIN'

    return NextResponse.json({
      authenticated: true,
      isAdmin,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { authenticated: false, isAdmin: false, error: 'Erreur de vérification' },
      { status: 500 }
    )
  }
}

