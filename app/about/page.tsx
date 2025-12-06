'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
  const sections = [
    {
      href: '/about/symphonie',
      title: 'L\'Afrique en symphonie',
      description: 'Découvrez la fusion musicale unique du Sénégal, du Cameroun et du Congo',
      icon: '🎵',
      gradient: 'from-senegal-green via-cameroon-red to-congo-blue'
    },
    {
      href: '/about/histoire',
      title: 'Notre Histoire',
      description: 'L\'histoire de SenCamCong et de notre fusion culturelle',
      icon: '📖',
      gradient: 'from-primary-500 via-primary-600 to-primary-700'
    },
    {
      href: '/about/contact',
      title: 'Contact',
      description: 'Contactez-nous pour toute demande de collaboration ou information',
      icon: '📧',
      gradient: 'from-blue-500 via-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
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
              Découvrez SenCamCong
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={section.href}>
                  <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-2 h-full">
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${section.gradient}`}></div>
                    <div className="p-8">
                      <div className="text-6xl mb-4 text-center transform group-hover:scale-110 transition-transform">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 group-hover:text-primary-600 transition-colors text-center">
                        {section.title}
                      </h2>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {section.description}
                      </p>
                      <div className="mt-6 text-center">
                        <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                          En savoir plus
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
