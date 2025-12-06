'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import ArtistGuard from '@/components/ArtistGuard'
import Image from 'next/image'

interface Performance {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  imageUrl: string | null
  videoUrl: string | null
  createdAt: string
  media?: any[]
  _count?: {
    media: number
  }
}

function ArtistDashboardContent() {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMemberProfile, setHasMemberProfile] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    withMedia: 0,
  })

  useEffect(() => {
    async function loadPerformances() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Récupérer l'ID de l'utilisateur depuis le token
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        // Vérifier si l'artiste a un profil membre
        const membersRes = await fetch('/api/members')
        const membersData = await membersRes.json()
        const myMember = (membersData.members || []).find((m: any) => m.userId === payload.id)
        setHasMemberProfile(!!myMember)
        
        // Récupérer toutes les performances de l'artiste
        const res = await fetch('/api/performances')
        const data = await res.json()
        
        // Filtrer pour ne garder que celles de l'artiste
        const myPerformances = (data.performances || []).filter(
          (p: any) => p.user?.id === payload.id
        )

        setPerformances(myPerformances)
        setStats({
          total: myPerformances.length,
          withMedia: myPerformances.filter((p: any) => p.media && p.media.length > 0).length,
        })
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

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la suppression')
        return
      }

      toast.success('Performance supprimée avec succès !')
      // Recharger la liste
      setPerformances(performances.filter(p => p.id !== id))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (error) {
      console.error('Error deleting performance:', error)
      toast.error('Erreur lors de la suppression')
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard Artiste</h1>
            <p className="text-gray-600 mt-2">Gérez vos performances et votre profil membre</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/artist/member"
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                hasMemberProfile
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {hasMemberProfile ? '✏️ Mon Profil Membre' : '➕ Créer mon Profil Membre'}
            </Link>
            <Link href="/artist/performances/new" className="btn-primary text-sm">
              + Nouvelle performance
            </Link>
            <Link href="/" className="btn-secondary text-sm">
              ← Retour au site
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="card p-4 md:p-6">
            <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Performances</h3>
            <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.total}</p>
          </div>
          <div className="card p-4 md:p-6">
            <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Avec médias</h3>
            <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.withMedia}</p>
          </div>
        </div>

        {/* Liste des performances */}
        {performances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune performance pour le moment</p>
            <Link href="/artist/performances/new" className="btn-primary">
              Créer votre première performance
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {performances.map((performance) => (
              <motion.div
                key={performance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card overflow-hidden"
              >
                {performance.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={performance.imageUrl}
                      alt={performance.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{performance.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(performance.date)}
                  </p>
                  {performance.location && (
                    <p className="text-sm text-gray-600 mb-2">{performance.location}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">
                    {performance._count?.media ?? performance.media?.length ?? 0} média(s)
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/artist/performances/${performance.id}`}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(performance.id)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function ArtistDashboard() {
  return (
    <ArtistGuard>
      <ArtistDashboardContent />
    </ArtistGuard>
  )
}

