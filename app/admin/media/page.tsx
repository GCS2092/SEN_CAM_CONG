'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'

interface Media {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
}

function AdminMediaPageContent() {
  const router = useRouter()
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch('/api/media')
        const data = await res.json()
        setMedia(data.media || [])
      } catch (error) {
        console.error('Error loading media:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMedia()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        toast.success('Média supprimé avec succès !')
        setMedia(media.filter(m => m.id !== id))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      toast.error('Erreur lors de la suppression du média')
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
        <h1 className="text-3xl md:text-4xl font-bold">Gérer les médias</h1>
        <Link href="/admin" className="btn-secondary text-sm">
          ← Retour
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {media.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            {item.type === 'IMAGE' && item.url && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title || 'Image'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {item.type === 'VIDEO' && (
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title || 'Vidéo'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            )}
            {item.type === 'AUDIO' && (
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-6xl">🎵</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold mb-2">{item.title || 'Sans titre'}</h3>
              <p className="text-sm text-gray-600 mb-2 capitalize">{item.type.toLowerCase()}</p>
              <div className="flex gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Voir
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {media.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun média pour le moment
        </div>
      )}
    </div>
  )
}

export default function AdminMediaPage() {
  return (
    <AdminGuard>
      <AdminMediaPageContent />
    </AdminGuard>
  )
}

