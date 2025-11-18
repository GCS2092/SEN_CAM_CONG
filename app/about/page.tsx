'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">À propos</h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">
              La fusion musicale du Cameroun, du Sénégal et du Congo
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Section Notre Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-8 mb-8"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">Notre Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
              SEN CAM CONG représente l&apos;union de trois nations africaines à travers la musique. 
              Nous croyons en la puissance de la fusion culturelle pour créer des expériences musicales 
              exceptionnelles qui transcendent les frontières.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Notre mission est de partager cette harmonie unique avec le monde, en célébrant les richesses 
              culturelles du Cameroun, du Sénégal et du Congo à travers chaque performance, chaque chanson, 
              chaque événement.
            </p>
          </motion.div>

          {/* Section Notre Histoire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 mb-8"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">Notre Histoire</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
              Nés de la passion commune pour la musique et le désir de créer quelque chose d&apos;unique, 
              SEN CAM CONG est né de la rencontre de talents venant du Cameroun, du Sénégal et du Congo.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
              Chaque membre apporte sa propre identité culturelle, ses rythmes traditionnels et sa vision 
              moderne, créant ainsi une fusion authentique qui résonne avec les publics du monde entier.
            </p>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              Ensemble, nous créons des expériences musicales mémorables qui célèbrent la diversité et 
              l&apos;unité de l&apos;Afrique.
            </p>
          </motion.div>

          {/* Section Fusion des Cultures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-8 mb-8 bg-gray-50"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">La Fusion des Cultures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-4xl mb-2">🇨🇲</div>
                <h3 className="font-bold text-lg mb-2">Cameroun</h3>
                <p className="text-sm text-gray-600">Rythmes vibrants et énergie</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-4xl mb-2">🇸🇳</div>
                <h3 className="font-bold text-lg mb-2">Sénégal</h3>
                <p className="text-sm text-gray-600">Traditions et modernité</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-4xl mb-2">🇨🇬</div>
                <h3 className="font-bold text-lg mb-2">Congo</h3>
                <p className="text-sm text-gray-600">Passion et créativité</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-center">
              Trois nations, une seule voix. Une harmonie unique qui célèbre la richesse culturelle africaine.
            </p>
          </motion.div>

          {/* Section Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card p-8"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">Contact</h2>
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}

