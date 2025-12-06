'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FusionSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">Une Fusion Unique</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Trois nations, une seule voix. Découvrez comment le Sénégal, le Cameroun et le Congo se réunissent pour créer une musique exceptionnelle.
          </p>
        </motion.div>

        {/* Hexagone fusionné unique */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8 sm:mb-10 md:mb-12"
        >
          <Link href="/about" className="group cursor-pointer">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem]">
              {/* Hexagone avec gradient fusionné */}
              <svg
                className="w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 200 200"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="fusion-hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CE1126" stopOpacity="0.2" /> {/* Cameroun Rouge */}
                    <stop offset="20%" stopColor="#FCD116" stopOpacity="0.25" /> {/* Jaune */}
                    <stop offset="40%" stopColor="#007A5E" stopOpacity="0.2" /> {/* Cameroun Vert */}
                    <stop offset="50%" stopColor="#00853F" stopOpacity="0.25" /> {/* Sénégal Vert */}
                    <stop offset="60%" stopColor="#FCD116" stopOpacity="0.25" /> {/* Jaune */}
                    <stop offset="80%" stopColor="#009739" stopOpacity="0.2" /> {/* Congo Vert */}
                    <stop offset="100%" stopColor="#DC143C" stopOpacity="0.2" /> {/* Congo Rouge */}
                  </linearGradient>
                </defs>
                <polygon
                  points="100,10 190,60 190,150 100,190 10,150 10,60"
                  fill="url(#fusion-hex-gradient)"
                  stroke="url(#fusion-hex-gradient)"
                  strokeWidth="3"
                  className="transition-all duration-300 group-hover:stroke-[4px]"
                />
              </svg>

              {/* Contenu au centre */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center z-10">
                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  <Link href="/members/senegal" className="hover:scale-125 transition-transform duration-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <span>🇸🇳</span>
                  </Link>
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-400">+</span>
                  <Link href="/members/cameroon" className="hover:scale-125 transition-transform duration-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <span>🇨🇲</span>
                  </Link>
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-400">+</span>
                  <Link href="/members/congo" className="hover:scale-125 transition-transform duration-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <span>🇨🇬</span>
                  </Link>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">
                  SN+CM+CG
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-800">
                  Fusion Musicale
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xs px-2">
                  Trois nations, une seule harmonie
                </p>

                {/* Barres de couleurs fusionnées */}
                <div className="flex gap-0.5 sm:gap-1 mt-3 sm:mt-4 md:mt-6 flex-wrap justify-center max-w-full px-2">
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-senegal-green"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-senegal-yellow"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-senegal-red"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-cameroon-red"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-cameroon-yellow"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-cameroon-green"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-congo-blue"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-congo-yellow"></div>
                  <div className="h-2 sm:h-2.5 md:h-3 w-6 sm:w-8 md:w-12 rounded-full bg-congo-red"></div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Message de fusion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200"
        >
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              Ensemble, nous créons une harmonie unique
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              La fusion de nos cultures, de nos rythmes et de nos traditions crée une expérience musicale inoubliable. 
              Chaque performance est un voyage à travers trois nations unies par la passion de la musique.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

