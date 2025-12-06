'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const DEFAULT_PRESENTATION_TEXT = `SenCamCong – L'Afrique en symphonie

Quand le Sénégal, le Cameroun et le Congo s'unissent, la musique devient un langage universel. SenCamCong, c'est la rencontre exceptionnelle de trois artistes musiciens talentueux, chacun porteur de son héritage culturel et de son expérience artistique.

Du Sénégal, nous puisons dans les richesses du mbalax et des traditions griotiques, apportant une dimension narrative et rythmique unique. Du Cameroun, nous intégrons les énergies vibrantes du makossa et les influences jazz, créant une dynamique musicale puissante. Du Congo, nous empruntons la passion de la rumba et du soukous, ajoutant une dimension festive et envoûtante à notre fusion.

En fusionnant leurs voix, leurs rythmes et leurs instruments, ils créent une alchimie musicale inédite : un voyage sonore où se croisent chants traditionnels, proverbes, récits vivants et danses envoûtantes.

Plus qu'un simple projet musical, SenCamCong est une célébration des similitudes rythmiques et des influences partagées entre ces trois nations. Dans un monde marqué par la globalisation, ce trio démontre que la force de la musique réside dans la mixité, le dialogue et la collaboration.

Avec des arrangements à couper le souffle et une énergie scénique communicative, SenCamCong incarne l'Afrique qui se réinvente, qui se raconte et qui s'exporte.

Un rendez-vous musical à ne pas manquer.`

export default function SymphoniePage() {
  const [presentationText, setPresentationText] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPresentation() {
      try {
        const res = await fetch('/api/site-settings?key=about_presentation')
        const data = await res.json()
        if (data.setting?.value) {
          setPresentationText(data.setting.value)
        }
      } catch (error) {
        console.error('Error loading presentation:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPresentation()
  }, [])

  const displayText = presentationText || DEFAULT_PRESENTATION_TEXT

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/about" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à À propos
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              L&apos;Afrique en symphonie
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-4 right-4 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="text-gray-700 leading-relaxed text-lg md:text-xl whitespace-pre-line space-y-4">
                  {displayText}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

