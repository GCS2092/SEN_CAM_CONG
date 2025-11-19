'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { toastDelete, toastError } from '@/lib/toast-helpers'
import { SearchIcon, EditIcon, DeleteIcon, StatsIcon, PlusIcon, EventIcon, CalendarIcon, LocationIcon, FilterIcon } from '@/components/Icons'
import { motion } from 'framer-motion'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'UPCOMING' | 'PAST' | 'CANCELLED'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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
        toastDelete('Événement supprimé avec succès !')
        setEvents(events.filter(e => e.id !== id))
        setSelectedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      } else {
        const data = await res.json()
        toastError(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toastError('Erreur lors de la suppression de l\'événement')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} événement(s) ?`)) return

    const token = localStorage.getItem('token')
    let successCount = 0
    let errorCount = 0

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (res.ok) {
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        errorCount++
      }
    }

    if (successCount > 0) {
      toastDelete(`${successCount} événement(s) supprimé(s) avec succès !`)
      setEvents(events.filter(e => !selectedIds.has(e.id)))
      setSelectedIds(new Set())
    }
    if (errorCount > 0) {
      toastError(`${errorCount} erreur(s) lors de la suppression`)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEvents.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredEvents.map(e => e.id)))
    }
  }

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    // Filtre par statut
    if (filter !== 'all' && event.status !== filter) return false
    
    // Recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query))
      )
    }
    
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header avec icône et stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <EventIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Gérer les événements</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} {filter !== 'all' ? `(${filter === 'UPCOMING' ? 'à venir' : filter === 'PAST' ? 'passés' : 'annulés'})` : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-center flex items-center justify-center gap-2"
              >
                ← Retour
              </Link>
              <Link 
                href="/admin/events/new" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-4 h-4" />
                Nouvel événement
              </Link>
            </div>
          </div>
        </div>

        {/* Barre de recherche améliorée */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-4 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm hover:shadow-md"
            />
            <SearchIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtres et actions en masse améliorés */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              Filtres :
            </span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('UPCOMING')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
                filter === 'UPCOMING'
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setFilter('PAST')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
                filter === 'PAST'
                  ? 'bg-gray-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              Passés
            </button>
            <button
              onClick={() => setFilter('CANCELLED')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
                filter === 'CANCELLED'
                  ? 'bg-red-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              Annulés
            </button>
          </div>
          {selectedIds.size > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleBulkDelete}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <DeleteIcon className="w-4 h-4" />
              Supprimer {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
            </motion.button>
          )}
        </div>

        {/* Desktop Table amélioré */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredEvents.length && filteredEvents.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Lieu</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredEvents.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(event.id)}
                        onChange={() => toggleSelect(event.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <LocationIcon className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'UPCOMING'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : event.status === 'CANCELLED'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link 
                          href={`/admin/events/${event.id}`} 
                          className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="Modifier"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/events/${event.id}/stats`} 
                          className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Statistiques"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatsIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(event.id)
                          }}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <EventIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                {searchQuery || filter !== 'all' 
                  ? 'Aucun événement ne correspond à vos critères'
                  : 'Aucun événement pour le moment'}
              </p>
              {!searchQuery && filter === 'all' && (
                <Link href="/admin/events/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold">
                  <PlusIcon className="w-4 h-4" />
                  Créer le premier événement
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Cards améliorées */}
        <div className="md:hidden space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex-1 pr-2">{event.title}</h3>
                <input
                  type="checkbox"
                  checked={selectedIds.has(event.id)}
                  onChange={() => toggleSelect(event.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5 mt-1 flex-shrink-0"
                />
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>{event.location}</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'UPCOMING'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : event.status === 'CANCELLED'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {event.status === 'UPCOMING' ? 'À venir' : event.status === 'CANCELLED' ? 'Annulé' : 'Passé'}
                </span>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href={`/admin/events/${event.id}`} 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium"
                >
                  <EditIcon className="w-4 h-4" />
                  Modifier
                </Link>
                <Link 
                  href={`/admin/events/${event.id}/stats`} 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                >
                  <StatsIcon className="w-4 h-4" />
                  Stats
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  <DeleteIcon className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <EventIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                {searchQuery || filter !== 'all' 
                  ? 'Aucun événement ne correspond à vos critères'
                  : 'Aucun événement pour le moment'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
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

