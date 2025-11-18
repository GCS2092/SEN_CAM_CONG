'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useArtistAuth } from '@/hooks/useArtistAuth'

interface ArtistGuardProps {
  children: React.ReactNode
}

export default function ArtistGuard({ children }: ArtistGuardProps) {
  const { isAuthenticated, isArtist, loading } = useArtistAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isArtist)) {
      router.replace('/login?redirect=' + encodeURIComponent(window.location.pathname))
    }
  }, [loading, isAuthenticated, isArtist, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Vérification de l&apos;accès...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isArtist) {
    return null
  }

  return <>{children}</>
}

