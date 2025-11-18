'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { SearchIcon } from '@/components/Icons'
import Pagination from '@/components/Pagination'

interface Performance {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  videoUrl: string | null
  imageUrl: string | null
}

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    pageSize: 12,
  })

  useEffect(() => {
    async function fetchPerformances() {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pagination.pageSize.toString(),
        })
        
        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const res = await fetch(`/api/performances?${params.toString()}`)
        const data = await res.json()
        setPerformances(data.performances || [])
        if (data.pagination) {
          setPagination(prev => ({ ...prev, ...data.pagination }))
        }
      } catch (error) {
        console.error('Error fetching performances:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPerformances()
  }, [page, searchQuery, pagination.pageSize])

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Performances</h1>
          <p className="text-sm md:text-base text-center text-gray-600 dark:text-gray-400 px-4">
            Revivez nos meilleurs moments sur scène
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-4 md:mb-6 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une performance..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-10 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            />
            <SearchIcon className="absolute left-2.5 md:left-3 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : performances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? `Aucune performance trouvée pour "${searchQuery}"` : 'Aucune performance disponible'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setPage(1)
                }}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {performances.map((performance, index) => (
              <motion.div
                key={performance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-4xl">🎵</span>
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-primary-600 text-sm font-semibold mb-2">
                        {formatDate(performance.date)}
                      </p>
                      <h3 className="text-xl font-bold mb-2">{performance.title}</h3>
                      {performance.location && (
                        <p className="text-gray-600 text-sm mb-2">📍 {performance.location}</p>
                      )}
                      {performance.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {performance.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </motion.div>
    </div>
  )
}

