'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const countries = [
  {
    name: 'Sénégal',
    flag: '🇸🇳',
    href: '/members/senegal',
    description: 'Terre de la Teranga',
    gradient: 'from-senegal-green/20 via-senegal-yellow/15 to-senegal-red/20',
  },
  {
    name: 'Cameroun',
    flag: '🇨🇲',
    href: '/members/cameroon',
    description: "L'Afrique en miniature",
    gradient: 'from-green-100 via-yellow-50 to-green-100',
  },
  {
    name: 'Congo',
    flag: '🇨🇬',
    href: '/members/congo',
    description: "Cœur de l'Afrique",
    gradient: 'from-green-100 via-yellow-50 to-blue-50',
  },
]

export default function MembersIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="relative py-20 md:py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l&apos;accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              Les membres
            </h1>
            <p className="text-gray-600 text-lg">
              Découvrez les artistes de SEN CAM CONG par pays.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {countries.map((country, index) => (
            <motion.div
              key={country.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={country.href}
                className={`block rounded-2xl px-4 py-5 md:px-5 md:py-6 bg-gradient-to-br ${country.gradient} border border-gray-200 shadow-md hover:shadow-xl hover:border-primary-200 transition-all`}
              >
                <span className="text-3xl md:text-4xl mb-3 block">{country.flag}</span>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{country.name}</h2>
                <p className="text-gray-600 text-xs md:text-sm">{country.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-primary-600 font-medium text-xs md:text-sm">
                  Voir les membres
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
