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
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/events" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Retour aux événements
        </Link>

        {event.imageUrl && (
          <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden bg-gray-100">
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
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
            
            {/* Boutons de partage */}
            <div className="flex gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
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
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                aria-label="Partager sur WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.239-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-primary-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-primary-50 rounded-lg">
                <LocationIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-medium">{event.location}{event.venue && ` - ${event.venue}`}</span>
            </div>
            {event.ticketPrice !== null && event.ticketPrice !== undefined && (
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <TicketIcon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium">
                  {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
                </span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
              {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-gray-800 font-semibold mb-1">💰 Prix du ticket :</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
                  </p>
                </div>
              )}
            </div>
          )}
          {!event.description && event.ticketPrice !== null && event.ticketPrice !== undefined && (
            <div className="mb-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-gray-800 font-semibold mb-1">💰 Prix du ticket :</p>
              <p className="text-2xl font-bold text-primary-700">
                {new Intl.NumberFormat('fr-FR').format(event.ticketPrice)} FCFA
              </p>
            </div>
          )}

          {event.externalUrl && (
            <div className="mt-8">
              <a
                href={event.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Plus d&apos;informations
              </a>
            </div>
          )}

          {/* Section commentaires */}
          <CommentsSection eventId={event.id} />
        </div>
      </motion.div>
    </div>
  )
}

