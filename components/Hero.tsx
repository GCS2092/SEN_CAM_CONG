'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeroSettings {
  hero_background_image?: { value: string | null }
  hero_title?: { value: string | null }
  hero_subtitle?: { value: string | null }
}

interface Event {
  id: string
  title: string
  date: string
}

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings>({})
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  // Charger les paramètres du hero
  useEffect(() => {
    async function loadSettings() {
      try {
        const [bgRes, titleRes, subtitleRes] = await Promise.all([
          fetch('/api/site-settings?key=hero_background_image').catch(() => ({ json: async () => ({ setting: null }) })),
          fetch('/api/site-settings?key=hero_title').catch(() => ({ json: async () => ({ setting: null }) })),
          fetch('/api/site-settings?key=hero_subtitle').catch(() => ({ json: async () => ({ setting: null }) })),
        ])

        const bgData = await bgRes.json().catch(() => ({ setting: null }))
        const titleData = await titleRes.json().catch(() => ({ setting: null }))
        const subtitleData = await subtitleRes.json().catch(() => ({ setting: null }))

        setSettings({
          hero_background_image: bgData.setting,
          hero_title: titleData.setting,
          hero_subtitle: subtitleData.setting,
        })
      } catch (error) {
        console.error('Error loading hero settings:', error)
        setSettings({})
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
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

  // Vérifier l'authentification
  useEffect(() => {
    async function checkAuth() {
      const { isAuthenticated } = await import('@/lib/auth-persistence')
      setIsAuthenticated(isAuthenticated())
    }
    checkAuth()
    const handleStorageChange = () => checkAuth()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = async () => {
    const { clearAuth } = await import('@/lib/auth-persistence')
    clearAuth()
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  const backgroundImage = settings.hero_background_image?.value || '/uploads/IMG-20251117-WA0001.jpg'
  const title = settings.hero_title?.value || 'SEN CAM CONG'
  const subtitle = settings.hero_subtitle?.value || 'La fusion musicale du Sénégal, du Cameroun et du Congo'

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image avec overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />
      
      {/* Informations en haut à droite */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-3">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="text-sm text-gray-300">Heure actuelle</div>
          <div className="text-xl font-bold">{currentTime}</div>
        </div>
        {nextEvent && (
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white max-w-xs">
            <div className="text-sm text-gray-300 mb-1">Prochain événement</div>
            <div className="text-sm font-semibold mb-1">{nextEvent.title}</div>
            <div className="text-xs text-gray-400">{formatEventDate(nextEvent.date)}</div>
          </div>
        )}
        {/* Boutons Connexion/Déconnexion */}
        <div className="flex gap-2">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center text-white px-4 w-full max-w-5xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  )
}
