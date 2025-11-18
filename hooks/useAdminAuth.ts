'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  user: {
    id: string
    email: string
    name: string | null
    role: string
  } | null
}

export function useAdminAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    user: null,
  })

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        // Pas de token, redirection immédiate
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin'
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      try {
        // Vérifier le token côté serveur
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok || !data.authenticated) {
          // Token invalide, supprimer et rediriger
          localStorage.removeItem('token')
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin'
          router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
          return
        }

        if (!data.isAdmin) {
          // Utilisateur non admin, redirection vers l'accueil
          router.replace('/')
          return
        }

        // Authentifié et admin
        setAuthState({
          isAuthenticated: true,
          isAdmin: true,
          loading: false,
          user: data.user,
        })
      } catch (error) {
        console.error('Error verifying auth:', error)
        localStorage.removeItem('token')
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin'
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
      }
    }

    verifyAuth()
  }, [router])

  return authState
}

