'use client'

import { motion } from 'framer-motion'
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

  const backgroundImage = settings.hero_background_image?.value || '/uploads/IMG-20251117-WA0001.jpg'
  const title = settings.hero_title?.value || 'SEN CAM CONG'
  const subtitle = settings.hero_subtitle?.value || 'La fusion musicale du Sénégal, du Cameroun et du Congo'

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
