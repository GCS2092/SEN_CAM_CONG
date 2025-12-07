'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { toastDelete, toastError } from '@/lib/toast-helpers'
import { SearchIcon, EditIcon, DeleteIcon, PlusIcon, PerformanceIcon, CalendarIcon, LocationIcon } from '@/components/Icons'
import { motion } from 'framer-motion'
import AdminGuard from '@/components/AdminGuard'

interface Performance {
  id: string
  title: string
  date: string
  location: string | null
}

function AdminPerformancesPageContent() {
  const router = useRouter()
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadPerformances() {
      try {
        const res = await fetch('/api/performances')
        const data = await res.json()
        setPerformances(data.performances || [])
      } catch (error) {
        console.error('Error loading performances:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPerformances()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette performance ?')) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/performances/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        toastDelete('Performance supprimée avec succès !')
        setPerformances(performances.filter(p => p.id !== id))
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
      console.error('Error deleting performance:', error)
      toastError('Erreur lors de la suppression de la performance')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} performance(s) ?`)) return

    const token = localStorage.getItem('token')
    let successCount = 0
    let errorCount = 0

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/performances/${id}`, {
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
      toastDelete(`${successCount} performance(s) supprimée(s) avec succès !`)
      setPerformances(performances.filter(p => !selectedIds.has(p.id)))
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
    if (selectedIds.size === filteredPerformances.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredPerformances.map(p => p.id)))
    }
  }

  // Filtrer les performances
  const filteredPerformances = performances.filter(performance => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        performance.title.toLowerCase().includes(query) ||
        (performance.location && performance.location.toLowerCase().includes(query))
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
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header avec icône et stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100bg-purple-900/30 rounded-xl">
                <PerformanceIcon className="w-6 h-6 text-purple-600text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900text-white">Gérer les performances</h1>
                <p className="text-sm text-gray-600text-gray-400 mt-1">
                  {filteredPerformances.length} performance{filteredPerformances.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-whitebg-gray-800 border border-gray-300border-gray-700 text-gray-700text-gray-300 rounded-lg hover:bg-gray-50hover:bg-gray-700 transition-colors text-sm font-medium text-center flex items-center justify-center gap-2"
              >
                ← Retour
              </Link>
              <Link 
                href="/admin/performances/new" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-4 h-4" />
                Nouvelle performance
              </Link>
            </div>
          </div>
        </div>

        {/* Barre de recherche améliorée */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Rechercher une performance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-4 text-sm border-2 border-gray-200border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-whitebg-gray-800 text-gray-900text-white placeholder-gray-400placeholder-gray-500 transition-all shadow-sm hover:shadow-md"
            />
            <SearchIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions en masse améliorées */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={handleBulkDelete}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <DeleteIcon className="w-4 h-4" />
              Supprimer {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
            </button>
          </motion.div>
        )}

        {/* Desktop Table amélioré */}
        <div className="hidden md:block bg-whitebg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100from-purple-900/30to-purple-800/30">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredPerformances.length && filteredPerformances.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Lieu</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100divide-gray-700">
                {filteredPerformances.map((performance, index) => (
                  <motion.tr
                    key={performance.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(performance.id)}
                        onChange={() => toggleSelect(performance.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900text-white group-hover:text-purple-600group-hover:text-purple-400 transition-colors">
                        {performance.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{formatDate(performance.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {performance.location ? (
                        <div className="flex items-center gap-2 text-gray-600text-gray-400">
                          <LocationIcon className="w-4 h-4" />
                          <span className="text-sm">{performance.location}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link 
                          href={`/admin/performances/${performance.id}`} 
                          className="p-2 text-purple-600 hover:text-purple-700text-purple-400hover:text-purple-300 hover:bg-purple-50hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Modifier"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(performance.id)
                          }}
                          className="p-2 text-red-600 hover:text-red-700text-red-400hover:text-red-300 hover:bg-red-50hover:bg-red-900/20 rounded-lg transition-colors"
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
          {filteredPerformances.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100bg-gray-800 mb-4">
                <PerformanceIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500text-gray-400 text-lg font-medium">
                {searchQuery 
                  ? 'Aucune performance ne correspond à vos critères'
                  : 'Aucune performance pour le moment'}
              </p>
              {!searchQuery && (
                <Link href="/admin/performances/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                  <PlusIcon className="w-4 h-4" />
                  Créer la première performance
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Cards améliorées */}
        <div className="md:hidden space-y-4">
          {filteredPerformances.map((performance, index) => (
            <motion.div
              key={performance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-whitebg-gray-800 rounded-xl shadow-md border border-gray-200border-gray-700 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900text-white flex-1 pr-2">{performance.title}</h3>
                <input
                  type="checkbox"
                  checked={selectedIds.has(performance.id)}
                  onChange={() => toggleSelect(performance.id)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5 mt-1 flex-shrink-0"
                />
              </div>
              <div className="space-y-2 text-sm text-gray-600text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-purple-600text-purple-400" />
                  <span>{formatDate(performance.date)}</span>
                </div>
                {performance.location && (
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4 text-purple-600text-purple-400" />
                    <span>{performance.location}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200border-gray-700">
                <Link 
                  href={`/admin/performances/${performance.id}`} 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50bg-purple-900/20 text-purple-600text-purple-400 rounded-lg hover:bg-purple-100hover:bg-purple-900/30 transition-colors text-sm font-medium"
                >
                  <EditIcon className="w-4 h-4" />
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(performance.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50bg-red-900/20 text-red-600text-red-400 rounded-lg hover:bg-red-100hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  <DeleteIcon className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
          {filteredPerformances.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100bg-gray-800 mb-4">
                <PerformanceIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500text-gray-400 text-lg font-medium">
                {searchQuery 
                  ? 'Aucune performance ne correspond à vos critères'
                  : 'Aucune performance pour le moment'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminPerformancesPage() {
  return (
    <AdminGuard>
      <AdminPerformancesPageContent />
    </AdminGuard>
  )
}

