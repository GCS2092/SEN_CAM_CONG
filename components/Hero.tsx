'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeroSettings {
  hero_background_image?: { value: string | null }
  hero_title?: { value: string | null }
  hero_subtitle?: { value: string | null }
}

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        // Charger les settings avec un délai pour éviter la surcharge
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
        // En cas d'erreur, utiliser les valeurs par défaut
        setSettings({})
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const backgroundImage = settings.hero_background_image?.value || '/uploads/IMG-20251117-WA0001.jpg'
  const title = settings.hero_title?.value || 'SEN CAM CONG'
  const subtitle = settings.hero_subtitle?.value || 'La fusion musicale du Sénégal, du Cameroun et du Congo'

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image avec overlay gradient fusion */}
      <div className="absolute inset-0 bg-gradient-to-br from-cameroon-red/90 via-senegal-green/85 to-congo-blue/90 z-10" />
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Effet de brillance animé */}
      <motion.div
        className="absolute inset-0 z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center text-white px-4 w-full max-w-5xl mx-auto"
      >
        {/* Glassmorphism card pour le contenu */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 text-gray-100 font-medium px-4 leading-relaxed"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
          >
            <Link 
              href="/events" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Voir les événements</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/performances" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
            >
              Nos performances
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

