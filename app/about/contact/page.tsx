'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
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
              Contact
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="absolute top-4 left-4 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
                Pour toute demande de collaboration, booking ou information, n&apos;hésitez pas à nous contacter.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-3xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Email</p>
                    <a href="mailto:contact@seccamcong.com" className="text-primary-600 hover:text-primary-700">
                      contact@seccamcong.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-3xl">📱</span>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Réseaux sociaux</p>
                    <p className="text-gray-600">Suivez-nous sur nos réseaux sociaux pour rester informé de nos dernières actualités</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

