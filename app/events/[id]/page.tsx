'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, LocationIcon, TicketIcon } from '@/components/Icons'
import LikeButton from '@/components/LikeButton'
import CommentsSection from '@/components/CommentsSection'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string
  venue: string | null
  imageUrl: string | null
  externalUrl: string | null
  ticketPrice: number | null
  status: string
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
  _count?: {
    likes: number
    comments: number
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!eventId) {
          console.error('No event ID provided')
          setLoading(false)
          return
        }
        
        console.log('Fetching event with ID:', eventId)
        const res = await fetch(`/api/events/${eventId}`)
        
        if (res.ok) {
          const data = await res.json()
          if (data.event) {
            setEvent(data.event)
          } else {
            console.error('No event in response:', data)
          }
        } else {
          const errorText = await res.text()
          console.error('Error fetching event:', res.status, errorText)
        }
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchEvent()
    } else {
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
        <Link href="/events" className="btn-primary">
          Retour aux événements
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/events" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux événements
          </Link>

          <div className="max-w-5xl mx-auto">
            {/* Image Hero */}
            {event.imageUrl && (
              <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  onError={(e) => {
                    console.error('Error loading event image:', event.imageUrl)
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        event.status === 'UPCOMING'
                          ? 'bg-green-500 text-white'
                          : event.status === 'CANCELLED'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                    </span>
                    <LikeButton 
                      eventId={event.id} 
                      initialCount={event._count?.likes || 0}
                    />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">{event.title}</h1>
                </div>
              </div>
            )}

            {!event.imageUrl && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      event.status === 'UPCOMING'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                  </span>
                  <LikeButton 
                    eventId={event.id} 
                    initialCount={event._count?.likes || 0}
                  />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800">{event.title}</h1>
              </div>
            )}

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-lg font-bold text-gray-800">{formatDate(event.date)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <LocationIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lieu</p>
                    <p className="text-lg font-bold text-gray-800">{event.location}{event.venue && ` - ${event.venue}`}</p>
                  </div>
                </div>
              </div>

              {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-lg p-6 border border-primary-200 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-600 rounded-xl">
                        <TicketIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Prix du ticket</p>
                        <p className="text-3xl font-bold text-primary-700">
                          {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">À propos de l&apos;événement</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {event.externalUrl && (
                <a
                  href={event.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Plus d&apos;informations
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              
              {/* Boutons de partage */}
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  aria-label="Partager sur Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(event.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl"
                  aria-label="Partager sur Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(event.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                  aria-label="Partager sur WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.239-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Section commentaires */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <CommentsSection eventId={event.id} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

