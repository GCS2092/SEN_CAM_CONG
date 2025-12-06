'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, LocationIcon, SearchIcon, TicketIcon } from '@/components/Icons'
import Pagination from '@/components/Pagination'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string
  venue: string | null
  imageUrl: string | null
  ticketPrice: number | null
  status: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'UPCOMING' | 'PAST' | 'CANCELLED'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    pageSize: 12,
  })

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pagination.pageSize.toString(),
        })
        
        if (filter !== 'all') {
          params.append('status', filter)
        }
        
        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const res = await fetch(`/api/events?${params.toString()}`)
        const data = await res.json()
        setEvents(data.events || [])
        if (data.pagination) {
          setPagination(prev => ({ ...prev, ...data.pagination }))
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [page, filter, searchQuery, pagination.pageSize])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
              Événements
            </h1>
            <p className="text-base md:text-lg text-center text-gray-600 px-4 max-w-2xl mx-auto">
              Découvrez nos concerts et performances à venir
            </p>
          </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-4 md:mb-6 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // Reset à la page 1 lors de la recherche
              }}
              className="w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-10 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            />
            <SearchIcon className="absolute left-2.5 md:left-3 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-4">
          <button
            onClick={() => {
              setFilter('all')
              setPage(1)
            }}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => {
              setFilter('UPCOMING')
              setPage(1)
            }}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'UPCOMING'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => {
              setFilter('PAST')
              setPage(1)
            }}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'PAST'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Passés
          </button>
          <button
            onClick={() => {
              setFilter('CANCELLED')
              setPage(1)
            }}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm ${
              filter === 'CANCELLED'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Annulés
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? `Aucun événement trouvé pour "${searchQuery}"` : 'Aucun événement disponible'}
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
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/events/${event.id}`}>
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full transform hover:-translate-y-2">
                    {event.imageUrl && (
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span
                            className={`text-xs font-bold ${
                              event.status === 'UPCOMING'
                                ? 'text-green-700'
                                : event.status === 'CANCELLED'
                                ? 'text-red-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {!event.imageUrl && (
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === 'UPCOMING'
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3 bg-gray-50 rounded-lg p-2">
                        <CalendarIcon className="w-4 h-4 text-primary-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-700 mb-3">
                        <LocationIcon className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">
                          {event.location}
                          {event.venue && ` - ${event.venue}`}
                        </span>
                      </div>
                      {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                        <div className="flex items-center gap-2 text-primary-600 bg-primary-50 rounded-lg p-2 mb-3">
                          <TicketIcon className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold">
                            {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
                          </span>
                        </div>
                      )}
                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {event.description}
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
    </div>
  )
}

