'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
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
        setPerformances(performances.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting performance:', error)
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
        <h1 className="text-3xl md:text-4xl font-bold">Gérer les performances</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Link href="/admin" className="btn-secondary text-center text-sm">
            ← Retour
          </Link>
          <Link href="/admin/performances/new" className="btn-primary text-center text-sm">
            + Nouvelle performance
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performances.map((performance) => (
                <tr key={performance.id}>
                  <td className="px-6 py-4 font-medium">{performance.title}</td>
                  <td className="px-6 py-4">{formatDate(performance.date)}</td>
                  <td className="px-6 py-4">{performance.location || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/performances/${performance.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(performance.id)}
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
        {performances.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune performance pour le moment
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {performances.map((performance) => (
          <div key={performance.id} className="card p-4">
            <h3 className="font-bold text-lg mb-2">{performance.title}</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>📅 {formatDate(performance.date)}</p>
              {performance.location && <p>📍 {performance.location}</p>}
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/performances/${performance.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Modifier
              </Link>
              <button
                onClick={() => handleDelete(performance.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {performances.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune performance pour le moment
          </div>
        )}
      </div>
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

