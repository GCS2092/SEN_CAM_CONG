'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté avec persistance améliorée
    async function checkAuth() {
      const { isAuthenticated, getUserRole } = await import('@/lib/auth-persistence')
      if (isAuthenticated()) {
        setIsAuthenticated(true)
        setUserRole(getUserRole())
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
    }
    checkAuth()
    
    // Écouter les changements de localStorage pour mettre à jour l'état
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = async () => {
    const { clearAuth } = await import('@/lib/auth-persistence')
    clearAuth()
    setIsAuthenticated(false)
    setUserRole(null)
    router.push('/')
  }

  // Les navItems principaux sont maintenant dans BottomNav
  // On garde seulement les liens admin/artist ici

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-1 justify-center md:justify-start">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-senegal-green via-cameroon-red to-congo-blue bg-clip-text text-transparent">
              SEN CAM CONG
            </span>
          </Link>

          {/* Desktop Menu - Seulement Admin/Artist et Connexion */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            {/* Menu selon le rôle - Chaque utilisateur voit uniquement son propre menu */}
            {isAuthenticated && userRole === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                  Admin
                </Link>
                <Link
                  href="/artist/dashboard"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  Artiste
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'ARTIST' && (
              <Link
                href="/artist/dashboard"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
              >
                Artiste
              </Link>
            )}
            {isAuthenticated && userRole === 'USER' && (
              <Link
                href="/user/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Mon compte
              </Link>
            )}
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Déconnexion
              </button>
            ) : (
                  <Link
                    href="/login"
                    className="btn-primary text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
                  >
                    Connexion
                  </Link>
            )}
              </div>
        </div>

      </div>
    </nav>
  )
}


