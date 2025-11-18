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
  const subtitle = settings.hero_subtitle?.value || 'La fusion musicale du Cameroun, du Sénégal et du Congo'

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image avec overlay gradient fusion */}
      <div className="absolute inset-0 bg-gradient-to-br from-cameroon-red/80 via-senegal-green/80 to-congo-blue/80 z-10" />
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center text-white px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl px-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-100 font-medium px-4"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
        >
          <Link href="/events" className="btn-primary inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
            Voir les événements
          </Link>
          <Link href="/performances" className="btn-secondary inline-block bg-white/10 text-white hover:bg-white/20 text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
            Nos performances
          </Link>
        </motion.div>
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

