'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { VideoIcon, ImageIcon, MusicIcon } from '@/components/Icons'

interface Media {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
}

export default function GalleryPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'VIDEO' | 'IMAGE' | 'AUDIO'>('all')

  useEffect(() => {
    async function fetchMedia() {
      try {
        // Charger les médias des performances ET les médias globaux de la galerie
        const [mediaRes, globalMediaRes] = await Promise.all([
          fetch('/api/media').catch(() => ({ json: async () => ({ media: [] }) })),
          fetch('/api/global-media?category=gallery&active=true').catch(() => ({ json: async () => ({ media: [] }) })),
        ])

        const mediaData = await mediaRes.json()
        const globalMediaData = await globalMediaRes.json()

        // Combiner les deux sources de médias
        const allMedia = [
          ...(mediaData.media || []),
          ...(globalMediaData.media || []),
        ]

        setMedia(allMedia)
      } catch (error) {
        console.error('Error fetching media:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMedia()
  }, [])

  const filteredMedia = media.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              Galerie
            </h1>
            <p className="text-sm md:text-base text-center text-gray-600 px-4 max-w-2xl mx-auto">
              Explorez notre collection de photos, vidéos et enregistrements
            </p>
          </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4">
          {(['all', 'VIDEO', 'IMAGE', 'AUDIO'] as const).map((filterType) => {
            const labels = {
              all: 'Tous',
              VIDEO: 'Vidéos',
              IMAGE: 'Photos',
              AUDIO: 'Audio',
            }
            return (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 text-xs md:text-sm ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {labels[filterType]}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun média disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-2"
              >
                {item.type === 'VIDEO' ? (
                  <div className="relative h-56 md:h-64 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title || 'Vidéo'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 group-hover:from-primary-600 group-hover:to-primary-800 transition-all">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                          <VideoIcon className="w-10 h-10 text-white ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                ) : item.type === 'IMAGE' ? (
                  <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={item.url}
                      alt={item.title || 'Image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        console.error('Error loading image:', item.url)
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="h-56 md:h-64 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-800 transition-all">
                    <div className="p-8 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 group-hover:scale-110 transition-transform">
                      <MusicIcon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                {(item.title || item.description) && (
                  <div className="p-4 md:p-6 bg-white">
                    {item.title && (
                      <h3 className="font-bold mb-1 text-sm md:text-base text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        </motion.div>
      </div>
    </div>
  )
}

