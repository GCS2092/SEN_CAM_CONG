'use client'

import { useEffect, useState, useCallback } from 'react'

interface AuthState {
  isAuthenticated: boolean
  loading: boolean
  user: {
    id: string
    email: string
    name: string | null
    role: string
  } | null
}

async function verifyAuth(): Promise<AuthState> {
  const token = localStorage.getItem('token')
  if (!token) {
    return { isAuthenticated: false, loading: false, user: null }
  }

  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()

    if (!res.ok || !data.authenticated) {
      localStorage.removeItem('token')
      return { isAuthenticated: false, loading: false, user: null }
    }

    return {
      isAuthenticated: true,
      loading: false,
      user: data.user,
    }
  } catch (error) {
    console.error('Error verifying auth:', error)
    localStorage.removeItem('token')
    return { isAuthenticated: false, loading: false, user: null }
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
  })

  const refresh = useCallback(() => {
    setAuthState((s) => ({ ...s, loading: true }))
    verifyAuth().then(setAuthState)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handleAuthChange = () => refresh()
    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [refresh])

  return authState
}

