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
    <section className="py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Événements à venir</h2>
        <p className="text-sm md:text-base text-gray-600 px-4">Ne manquez pas nos prochains concerts</p>
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
                <div className="card card-hover cursor-pointer h-full">
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-primary-600 text-sm font-semibold">
                      {formatDateShort(event.date)}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">{event.title}</h3>
                    <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
                      <LocationIcon className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                      <span>
                        {event.location}
                        {event.venue && ` - ${event.venue}`}
                      </span>
                    </div>
                    {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                      <div className="flex items-center gap-2 text-primary-600">
                        <TicketIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-semibold">
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

      <div className="text-center">
        <Link href="/events" className="btn-primary">
          Voir tous les événements
        </Link>
      </div>
    </section>
  )
}

