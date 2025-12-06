'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import { CalendarIcon } from '@/components/Icons'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string
  venue: string | null
  imageUrl: string | null
  status: string
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const res = await fetch('/api/events?status=UPCOMING&limit=6')
        const data = await res.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUpcomingEvents()
  }, [])

  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Section Événements à venir */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Événements à venir
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Découvrez nos prochains concerts et événements
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun événement à venir pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                      {event.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                              À venir
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <CalendarIcon className="w-4 h-4 text-primary-600" />
                          <span className="text-xs md:text-sm">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {event.location}{event.venue && ` - ${event.venue}`}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        )}
                        <span className="inline-flex items-center text-primary-600 font-semibold text-xs md:text-sm group-hover:gap-2 transition-all">
                          En savoir plus
                          <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                Voir tous les événements
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
