'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Member {
  id: string
  name: string
  role: string | null
  bio: string | null
  imageUrl: string | null
  nationality: string
  instruments: string[]
}

export default function SenegalMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch('/api/members?nationality=Sénégal&active=true')
        const data = await res.json()
        setMembers(data.members || [])
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <div className="relative py-20 md:py-24 bg-gradient-to-br from-senegal-green/20 via-senegal-yellow/15 to-senegal-red/20 overflow-hidden">
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
              🇸🇳
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red bg-clip-text text-transparent">
              Membres du Sénégal
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Découvrez les talents sénégalais qui apportent leur héritage musical au groupe
            </p>
          </motion.div>
        </div>
      </div>

      {/* Membres */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : members.length > 0 ? (
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
                    <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow bg-gradient-to-br from-senegal-green/20 to-senegal-green/10">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🎵
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-senegal-green/10 to-senegal-green/5 text-senegal-green rounded-full text-sm font-bold border border-senegal-green/20">
                          {member.nationality}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h2>
                      {member.role && (
                        <p className="text-primary-600 font-semibold mb-4 text-lg">{member.role}</p>
                      )}
                      {member.bio && (
                        <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                      )}
                      {member.instruments && member.instruments.length > 0 && (
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
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun membre disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
