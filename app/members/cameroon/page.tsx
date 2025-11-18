'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Données de test - à remplacer par les vraies infos
const members = [
  {
    id: '1',
    name: 'Manu Dibango',
    role: 'Saxophoniste & Compositeur',
    bio: 'Légende du jazz africain, Manu Dibango a fusionné les rythmes camerounais avec le jazz moderne. Artiste emblématique connu internationalement.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    instruments: ['Saxophone', 'Piano', 'Voix'],
    nationality: 'Cameroun',
  },
  {
    id: '2',
    name: 'Richard Bona',
    role: 'Bassiste & Chanteur',
    bio: 'Virtuose de la basse, Richard Bona apporte une dimension unique avec ses influences jazz et world music. Artiste de renommée mondiale.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    instruments: ['Basse', 'Guitare', 'Voix'],
    nationality: 'Cameroun',
  },
]

export default function CameroonMembersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="relative py-16 bg-gradient-to-r from-cameroon-red/10 via-cameroon-yellow/10 to-cameroon-green/10">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
            ← Retour à l&apos;accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🇨🇲</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Membres du Cameroun</h1>
            <p className="text-xl text-gray-600">Découvrez les talents camerounais du groupe</p>
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
              className="card p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="px-3 py-1 bg-cameroon-red/10 text-cameroon-red rounded-full text-sm font-semibold">
                      {member.nationality}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{member.name}</h2>
                  <p className="text-primary-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.instruments.map((instrument) => (
                      <span
                        key={instrument}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {instrument}
                      </span>
                    ))}
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

