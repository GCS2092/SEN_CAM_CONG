'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string
  venue: string | null
  status: string
}

function AdminEventsPageContent() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setEvents(events.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Gérer les événements</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Link href="/admin" className="btn-secondary text-center text-sm">
            ← Retour
          </Link>
          <Link href="/admin/events/new" className="btn-primary text-center text-sm">
            + Nouvel événement
          </Link>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 font-medium">{event.title}</td>
                  <td className="px-6 py-4">{formatDate(event.date)}</td>
                  <td className="px-6 py-4">{event.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'UPCOMING'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/admin/events/${event.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                        Modifier
                      </Link>
                      <Link href={`/admin/events/${event.id}/stats`} className="text-blue-600 hover:text-blue-700 text-sm">
                        Stats
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun événement pour le moment
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {events.map((event) => (
          <div key={event.id} className="card p-4">
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>📅 {formatDate(event.date)}</p>
              <p>📍 {event.location}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                event.status === 'UPCOMING'
                  ? 'bg-green-100 text-green-800'
                  : event.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
              </span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href={`/admin/events/${event.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Modifier
              </Link>
              <Link href={`/admin/events/${event.id}/stats`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Stats
              </Link>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun événement pour le moment
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminEventsPage() {
  return (
    <AdminGuard>
      <AdminEventsPageContent />
    </AdminGuard>
  )
}

