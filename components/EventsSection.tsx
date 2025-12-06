'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateShort } from '@/lib/utils'
import { LocationIcon, TicketIcon } from '@/components/Icons'

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

interface EventsSectionProps {
  events: Event[]
  loading: boolean
}

export default function EventsSection({ events, loading }: EventsSectionProps) {
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">
            Événements à venir
          </h2>
          <p className="text-base md:text-lg text-gray-600 px-4 max-w-2xl mx-auto">
            Ne manquez pas nos prochains concerts et expériences musicales exceptionnelles
          </p>
        </motion.div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun événement à venir pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-primary-600 text-xs font-bold">
                          {formatDateShort(event.date)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    {!event.imageUrl && (
                      <span className="text-primary-600 text-sm font-semibold mb-2 block">
                        {formatDateShort(event.date)}
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                      <LocationIcon className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {event.location}
                        {event.venue && ` - ${event.venue}`}
                      </span>
                    </div>
                    {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                      <div className="flex items-center gap-2 text-primary-600 bg-primary-50 rounded-lg p-2">
                        <TicketIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-bold">
                          {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link 
          href="/events" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Voir tous les événements
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

