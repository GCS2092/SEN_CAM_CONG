'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useAdminAuth()
  const router = useRouter()

  // Afficher un loader pendant la vérification
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

  // Si pas authentifié ou pas admin, ne rien afficher (la redirection est gérée dans le hook)
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Afficher le contenu protégé
  return <>{children}</>
}

