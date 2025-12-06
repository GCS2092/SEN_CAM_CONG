'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Données de test - à remplacer par les vraies infos
const members = [
  {
    id: '1',
    name: 'Papa Wemba',
    role: 'Chanteur & Showman',
    bio: 'Roi de la rumba congolaise, Papa Wemba a révolutionné la musique africaine. Artiste charismatique et innovateur, il a marqué plusieurs générations.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    instruments: ['Voix', 'Guitare', 'Percussions'],
    nationality: 'Congo',
  },
  {
    id: '2',
    name: 'Koffi Olomidé',
    role: 'Chanteur & Compositeur',
    bio: 'Maître de la rumba et du soukous, Koffi Olomidé est une figure emblématique de la musique congolaise. Artiste prolifique et créatif.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    instruments: ['Voix', 'Guitare', 'Piano'],
    nationality: 'Congo',
  },
]

export default function CongoMembersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <div className="relative py-20 md:py-24 bg-gradient-to-br from-congo-blue/20 via-congo-yellow/15 to-congo-red/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l&apos;accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div 
              className="text-8xl md:text-9xl mb-6 inline-block"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              🇨🇬
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-congo-blue via-congo-yellow to-congo-red bg-clip-text text-transparent">
              Membres du Congo
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Découvrez les talents congolais qui apportent leur passion musicale au groupe
            </p>
          </motion.div>
        </div>
      </div>

      {/* Membres */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-congo-blue/10 to-congo-blue/5 text-congo-blue rounded-full text-sm font-bold border border-congo-blue/20">
                        {member.nationality}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-primary-600 font-semibold mb-4 text-lg">{member.role}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.instruments.map((instrument) => (
                        <span
                          key={instrument}
                          className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-colors"
                        >
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

