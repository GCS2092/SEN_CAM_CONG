'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateShort } from '@/lib/utils'

interface Performance {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  videoUrl: string | null
  imageUrl: string | null
}

interface PerformancesSectionProps {
  performances: Performance[]
  loading: boolean
}

export default function PerformancesSection({ performances, loading }: PerformancesSectionProps) {
  if (loading) {
    return (
      <section className="py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Dernières performances</h2>
        <p className="text-sm md:text-base text-gray-600 px-4">Revivez nos meilleurs moments sur scène</p>
      </div>

      {performances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune performance disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {performances.map((performance, index) => (
            <motion.div
              key={performance.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/performances/${performance.id}`}>
                <div className="card cursor-pointer h-full">
                  {performance.imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={performance.imageUrl}
                        alt={performance.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {performance.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : performance.videoUrl ? (
                    <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : null}
                  <div className="p-6">
                    <span className="text-primary-600 text-sm font-semibold">
                      {formatDateShort(performance.date)}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">{performance.title}</h3>
                    {performance.location && (
                      <p className="text-gray-600 text-sm">📍 {performance.location}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link href="/performances" className="btn-primary">
          Voir toutes les performances
        </Link>
      </div>
    </section>
  )
}

