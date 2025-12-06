'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const DEFAULT_PRESENTATION_TEXT = `SenCamCong – L'Afrique en symphonie

Quand le Sénégal, le Cameroun et le Congo s'unissent, la musique devient un langage universel. SenCamCong, c'est la rencontre exceptionnelle de trois artistes musiciens talentueux, chacun porteur de son héritage culturel et de son expérience artistique.

Du Sénégal, nous puisons dans les richesses du mbalax et des traditions griotiques, apportant une dimension narrative et rythmique unique. Du Cameroun, nous intégrons les énergies vibrantes du makossa et les influences jazz, créant une dynamique musicale puissante. Du Congo, nous empruntons la passion de la rumba et du soukous, ajoutant une dimension festive et envoûtante à notre fusion.

En fusionnant leurs voix, leurs rythmes et leurs instruments, ils créent une alchimie musicale inédite : un voyage sonore où se croisent chants traditionnels, proverbes, récits vivants et danses envoûtantes.

Plus qu'un simple projet musical, SenCamCong est une célébration des similitudes rythmiques et des influences partagées entre ces trois nations. Dans un monde marqué par la globalisation, ce trio démontre que la force de la musique réside dans la mixité, le dialogue et la collaboration.

Avec des arrangements à couper le souffle et une énergie scénique communicative, SenCamCong incarne l'Afrique qui se réinvente, qui se raconte et qui s'exporte.

Un rendez-vous musical à ne pas manquer.`

export default function AboutPage() {
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
    <div>
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              À propos
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 px-4 font-medium">
              La fusion musicale du Sénégal, du Cameroun et du Congo
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Section Présentation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-4 right-4 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                SenCamCong – L&apos;Afrique en symphonie
              </h2>
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

          {/* Section Notre Histoire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Notre Histoire
              </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
              SenCamCong est né de la rencontre de talents venant du <strong>Sénégal</strong>, du <strong>Cameroun</strong> et du <strong>Congo</strong>. 
              Chaque membre apporte sa propre identité culturelle, ses rythmes traditionnels et sa vision moderne.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
              Du <strong>Sénégal</strong>, nous puisons dans les richesses du mbalax et des traditions griotiques, 
              apportant une dimension narrative et rythmique unique. Du <strong>Cameroun</strong>, nous intégrons 
              les énergies vibrantes du makossa et les influences jazz, créant une dynamique musicale puissante. 
              Du <strong>Congo</strong>, nous empruntons la passion de la rumba et du soukous, ajoutant une dimension 
              festive et envoûtante à notre fusion.
            </p>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              Ensemble, nous créons des expériences musicales mémorables qui célèbrent la diversité et 
              l&apos;unité de l&apos;Afrique.
            </p>
            </div>
          </motion.div>

          {/* Section Fusion des Cultures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent text-center">
                La Fusion des Cultures
              </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              <motion.div 
                className="group text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-6xl md:text-7xl mb-4 transform group-hover:scale-110 transition-transform">🇸🇳</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">Sénégal</h3>
                <p className="text-sm md:text-base text-gray-600">Traditions griotiques et mbalax</p>
              </motion.div>
              <motion.div 
                className="group text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-6xl md:text-7xl mb-4 transform group-hover:scale-110 transition-transform">🇨🇲</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">Cameroun</h3>
                <p className="text-sm md:text-base text-gray-600">Makossa et énergie vibrante</p>
              </motion.div>
              <motion.div 
                className="group text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-6xl md:text-7xl mb-4 transform group-hover:scale-110 transition-transform">🇨🇬</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">Congo</h3>
                <p className="text-sm md:text-base text-gray-600">Rumba et soukous passionnés</p>
              </motion.div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-center">
              Trois nations, une seule voix. Une harmonie unique qui célèbre la richesse culturelle africaine.
            </p>
            </div>
          </motion.div>

          {/* Section Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-4 left-4 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Contact
              </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
              Pour toute demande de collaboration, booking ou information, n&apos;hésitez pas à nous contacter.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📧</span>
                <span className="text-gray-700">contact@seccamcong.com</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📱</span>
                <span className="text-gray-700">Suivez-nous sur nos réseaux sociaux</span>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

