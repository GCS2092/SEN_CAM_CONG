'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HistoirePage() {
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
              Notre Histoire
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
                SenCamCong est né de la rencontre de talents venant du <strong>Sénégal</strong>, du <strong>Cameroun</strong> et du <strong>Congo</strong>. 
                Chaque membre apporte sa propre identité culturelle, ses rythmes traditionnels et sa vision moderne.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
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
            className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 overflow-hidden"
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
        </div>
      </div>
    </div>
  )
}

