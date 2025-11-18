'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  isArtist: boolean
  loading: boolean
  user: {
    id: string
    email: string
    name: string | null
    role: string
  } | null
}

export function useArtistAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isArtist: false,
    loading: true,
    user: null,
  })

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isArtist: false,
          loading: false,
          user: null,
        })
        return
      }

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok || !data.authenticated) {
          localStorage.removeItem('token')
          setAuthState({
            isAuthenticated: false,
            isArtist: false,
            loading: false,
            user: null,
          })
          return
        }

        const isArtist = data.user?.role === 'ARTIST' || data.user?.role === 'ADMIN'

        setAuthState({
          isAuthenticated: true,
          isArtist,
          loading: false,
          user: data.user,
        })
      } catch (error) {
        console.error('Error verifying auth:', error)
        localStorage.removeItem('token')
        setAuthState({
          isAuthenticated: false,
          isArtist: false,
          loading: false,
          user: null,
        })
      }
    }

    verifyAuth()
  }, [router])

  return authState
}

