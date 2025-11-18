'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { VideoIcon, ImageIcon } from '@/components/Icons'

interface Media {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
}

interface Performance {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  videoUrl: string | null
  imageUrl: string | null
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
  event: {
    id: string
    title: string
    date: string
  } | null
  media?: Media[]
}

export default function PerformanceDetailPage() {
  const params = useParams()
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [loading, setLoading] = useState(true)

  const [media, setMedia] = useState<Media[]>([])

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const [performanceRes, mediaRes] = await Promise.all([
          fetch(`/api/performances/${params.id}`),
          fetch(`/api/media?performanceId=${params.id}`),
        ])
        
        if (performanceRes.ok) {
          const data = await performanceRes.json()
          setPerformance(data.performance)
        }
        
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json()
          setMedia(mediaData.media || [])
        }
      } catch (error) {
        console.error('Error fetching performance:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchPerformance()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Performance non trouvée</h1>
        <Link href="/performances" className="btn-primary">
          Retour aux performances
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/performances" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Retour aux performances
        </Link>

        {performance.videoUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-gray-900">
              <iframe
                src={performance.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {!performance.videoUrl && performance.imageUrl && (
          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <img
              src={performance.imageUrl}
              alt={performance.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{performance.title}</h1>

          <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>{formatDate(performance.date)}</span>
            </div>
            {performance.location && (
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>{performance.location}</span>
              </div>
            )}
            {performance.event && (
              <div className="flex items-center gap-2">
                <span className="text-xl">🎵</span>
                <Link href={`/events/${performance.event.id}`} className="text-primary-600 hover:text-primary-700">
                  {performance.event.title}
                </Link>
              </div>
            )}
          </div>

          {performance.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {performance.description}
              </p>
            </div>
          )}

          {/* Galerie de médias */}
          {media.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Médias ({media.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {media.map((item) => (
                  <div key={item.id} className="card overflow-hidden p-0">
                    {item.type === 'IMAGE' ? (
                      <div className="relative h-64 bg-gray-100">
                        <Image
                          src={item.url}
                          alt={item.title || 'Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : item.type === 'VIDEO' ? (
                      <div className="relative h-64 bg-gray-900 flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title || 'Vidéo'}
                            fill
                            className="object-cover opacity-50"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : null}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <VideoIcon className="w-8 h-8 text-white ml-1" />
                        </a>
                      </div>
                    ) : (
                      <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 text-primary-600 hover:text-primary-700"
                        >
                          <ImageIcon className="w-12 h-12" />
                          <span className="text-sm font-semibold">Écouter</span>
                        </a>
                      </div>
                    )}
                    {(item.title || item.description) && (
                      <div className="p-4">
                        {item.title && (
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

