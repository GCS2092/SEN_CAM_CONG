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
        const res = await fetch('/api/media')
        const data = await res.json()
        setMedia(data.media || [])
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
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Galerie</h1>
          <p className="text-sm md:text-base text-center text-gray-600 px-4">
            Photos, vidéos et enregistrements
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('VIDEO')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'VIDEO'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setFilter('IMAGE')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'IMAGE'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setFilter('AUDIO')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'AUDIO'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Audio
          </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="card overflow-hidden"
              >
                {item.type === 'VIDEO' ? (
                  <div className="relative h-48 md:h-64 bg-gray-200">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title || 'Vidéo'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                          <VideoIcon className="w-8 md:w-10 h-8 md:h-10 text-white ml-1" />
                        </div>
                      </div>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    >
                    </a>
                  </div>
                ) : item.type === 'IMAGE' ? (
                  <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={item.url}
                      alt={item.title || 'Image'}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.error('Error loading image:', item.url)
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 md:h-64 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <div className="p-6 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30">
                      <MusicIcon className="w-12 md:w-16 h-12 md:h-16 text-white" />
                    </div>
                  </div>
                )}
                {(item.title || item.description) && (
                  <div className="p-3 md:p-4">
                    {item.title && (
                      <h3 className="font-bold mb-2 text-sm md:text-base">{item.title}</h3>
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
  )
}

