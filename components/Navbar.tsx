'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface Event {
  id: string
  title: string
  date: string
  ticketPrice: number | null
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
          // Trier par date croissante pour avoir le prochain événement
          const sortedEvents = data.events.sort((a: Event, b: Event) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          setNextEvent(sortedEvents[0])
        } else {
          setNextEvent(null)
        }
      } catch (error) {
        console.error('Error loading next event:', error)
        setNextEvent(null)
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
    
    // Écouter aussi les événements personnalisés pour une mise à jour immédiate
    const handleAuthChange = () => {
      checkAuth()
    }
    window.addEventListener('auth-change', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  const handleLogout = async () => {
    const { clearAuth } = await import('@/lib/auth-persistence')
    clearAuth()
    setIsAuthenticated(false)
    setUserRole(null)
    // Déclencher un événement pour mettre à jour les autres composants
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  }

  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16 gap-3">
          {/* Heure et prochain événement */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="text-gray-500 text-[10px] md:text-xs mb-0.5">Heure</div>
              <div className="font-bold text-gray-900 text-sm md:text-base leading-tight">{currentTime}</div>
            </div>
            {nextEvent && (
              <Link 
                href={`/events/${nextEvent.id}`}
                className="flex-1 min-w-0 border-l border-gray-200 pl-3 md:pl-4 hover:bg-gray-50 rounded-r transition-colors"
              >
                <div className="text-gray-500 text-[10px] md:text-xs mb-0.5">Prochain événement</div>
                <div className="font-semibold text-gray-900 line-clamp-1 text-xs md:text-sm mb-1">{nextEvent.title}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] md:text-xs text-gray-600 font-medium whitespace-nowrap">
                    📅 {formatEventDateTime(nextEvent.date).date} à {formatEventDateTime(nextEvent.date).time}
                  </span>
                  {nextEvent.ticketPrice !== null && nextEvent.ticketPrice !== undefined && (
                    <span className="text-[10px] md:text-xs text-primary-600 font-semibold whitespace-nowrap">
                      💰 {new Intl.NumberFormat('fr-FR').format(nextEvent.ticketPrice)} FCFA
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>

          {/* Menu Desktop et Mobile - Admin/Artist et Connexion */}
          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {/* Menu selon le rôle - Desktop seulement */}
            <div className="hidden md:flex gap-4 items-center">
              {isAuthenticated && userRole === 'ADMIN' && (
                <>
                  <Link
                    href="/admin"
                    className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/artist/dashboard"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    Artiste
                  </Link>
                </>
              )}
              {isAuthenticated && userRole === 'ARTIST' && (
                <Link
                  href="/artist/dashboard"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  Artiste
                </Link>
              )}
              {isAuthenticated && userRole === 'USER' && (
                <Link
                  href="/user/dashboard"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Mon compte
                </Link>
              )}
            </div>
            
            {/* Bouton Connexion/Déconnexion - Visible sur tous les écrans */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap"
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
