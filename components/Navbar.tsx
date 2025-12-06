'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

interface Event {
  id: string
  title: string
  date: string
}

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Mettre à jour l'heure chaque seconde
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Charger le prochain événement
  useEffect(() => {
    async function loadNextEvent() {
      try {
        const res = await fetch('/api/events?status=UPCOMING&limit=1')
        const data = await res.json()
        if (data.events && data.events.length > 0) {
          setNextEvent(data.events[0])
        }
      } catch (error) {
        console.error('Error loading next event:', error)
      }
    }
    loadNextEvent()
    // Recharger toutes les 5 minutes pour mettre à jour
    const interval = setInterval(loadNextEvent, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Heure et prochain événement */}
          <div className="flex items-center gap-4 flex-1">
            <div className="text-sm md:text-base">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Heure</div>
              <div className="font-bold text-gray-900 dark:text-white">{currentTime}</div>
            </div>
            {nextEvent && (
              <div className="hidden sm:block text-sm">
                <div className="text-gray-500 dark:text-gray-400 text-xs">Prochain événement</div>
                <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">{nextEvent.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{formatEventDate(nextEvent.date)}</div>
              </div>
            )}
          </div>

          {/* Desktop Menu - Seulement Admin/Artist et Connexion */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            {/* Menu selon le rôle - Chaque utilisateur voit uniquement son propre menu */}
            {isAuthenticated && userRole === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm"
                >
                  Admin
                </Link>
                <Link
                  href="/artist/dashboard"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm"
                >
                  Artiste
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'ARTIST' && (
              <Link
                href="/artist/dashboard"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm"
              >
                Artiste
              </Link>
            )}
            {isAuthenticated && userRole === 'USER' && (
              <Link
                href="/user/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm"
              >
                Mon compte
              </Link>
            )}
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm"
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
