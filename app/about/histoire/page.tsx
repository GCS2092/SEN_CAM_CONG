'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HistoirePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative py-12 md:py-16 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/about" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              Notre Histoire
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-primary-100 rounded-full blur-2xl opacity-30"></div>
            <div className="relative z-10 space-y-4">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                SenCamCong est né de la rencontre de talents venant du <span className="font-semibold text-primary-600">Sénégal</span>, du <span className="font-semibold text-primary-600">Cameroun</span> et du <span className="font-semibold text-primary-600">Congo</span>. 
                Chaque membre apporte sa propre identité culturelle, ses rythmes traditionnels et sa vision moderne.
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Du <span className="font-semibold text-gray-800">Sénégal</span>, nous puisons dans les richesses du mbalax et des traditions griotiques, 
                apportant une dimension narrative et rythmique unique. Du <span className="font-semibold text-gray-800">Cameroun</span>, nous intégrons 
                les énergies vibrantes du makossa et les influences jazz, créant une dynamique musicale puissante. 
                Du <span className="font-semibold text-gray-800">Congo</span>, nous empruntons la passion de la rumba et du soukous, ajoutant une dimension 
                festive et envoûtante à notre fusion.
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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
            className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-100 rounded-full blur-2xl opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent text-center">
                La Fusion des Cultures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <Link href="/members/senegal">
                  <motion.div 
                    className="group text-center p-4 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="w-16 h-11 md:w-20 md:h-14 mx-auto mb-3 rounded border-2 border-gray-200 group-hover:border-primary-500 transition-colors bg-gradient-to-b from-green-600 via-yellow-400 to-red-600 flex items-center justify-center shadow-md">
                      <span className="text-2xl md:text-3xl">🇸🇳</span>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">Sénégal</h3>
                    <p className="text-xs md:text-sm text-gray-600">Traditions griotiques et mbalax</p>
                  </motion.div>
                </Link>
                <Link href="/members/cameroon">
                  <motion.div 
                    className="group text-center p-4 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="w-16 h-11 md:w-20 md:h-14 mx-auto mb-3 rounded border-2 border-gray-200 group-hover:border-primary-500 transition-colors bg-gradient-to-b from-green-500 via-red-500 to-yellow-400 flex items-center justify-center shadow-md">
                      <span className="text-2xl md:text-3xl">🇨🇲</span>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">Cameroun</h3>
                    <p className="text-xs md:text-sm text-gray-600">Makossa et énergie vibrante</p>
                  </motion.div>
                </Link>
                <Link href="/members/congo">
                  <motion.div 
                    className="group text-center p-4 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="w-16 h-11 md:w-20 md:h-14 mx-auto mb-3 rounded border-2 border-gray-200 group-hover:border-primary-500 transition-colors bg-gradient-to-b from-blue-600 via-yellow-400 to-red-600 flex items-center justify-center shadow-md">
                      <span className="text-2xl md:text-3xl">🇨🇬</span>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">Congo</h3>
                    <p className="text-xs md:text-sm text-gray-600">Rumba et soukous passionnés</p>
                  </motion.div>
                </Link>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center">
                Trois nations, une seule voix. Une harmonie unique qui célèbre la richesse culturelle africaine.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
