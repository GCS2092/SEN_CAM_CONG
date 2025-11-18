'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import ArtistGuard from '@/components/ArtistGuard'
import Image from 'next/image'
import { VideoIcon, ImageIcon } from '@/components/Icons'

interface Media {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
  createdAt: string
}

interface Performance {
  id: string
  title: string
  user: {
    id: string
  }
}

function ManageMediaPageContent() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [media, setMedia] = useState<Media[]>([])
  const [formData, setFormData] = useState({
    type: 'IMAGE',
    url: '',
    thumbnailUrl: '',
    title: '',
    description: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const performanceId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!performanceId) {
          setLoading(false)
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Vérifier que c'est bien la performance de l'artiste
        const payload = JSON.parse(atob(token.split('.')[1]))

        const [performanceRes, mediaRes] = await Promise.all([
          fetch(`/api/performances/${performanceId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`/api/media?performanceId=${performanceId}`),
        ])

        if (!performanceRes.ok) {
          throw new Error('Performance non trouvée')
        }

        const performanceData = await performanceRes.json()
        const performance = performanceData.performance

        if (performance.user.id !== payload.id) {
          toast.error('Vous ne pouvez gérer que vos propres performances')
          router.push('/artist/dashboard')
          return
        }

        setPerformance(performance)

        // Filtrer les médias pour cette performance
        const allMedia = await mediaRes.json()
        const performanceMedia = (allMedia.media || []).filter(
          (m: any) => m.performanceId === performanceId
        )
        setMedia(performanceMedia)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadData()
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem('token')
    if (!token || !performance) {
      toast.error('Vous devez être connecté')
      return
    }

    try {
      if (!formData.url.trim()) {
        toast.error('L\'URL est requise')
        return
      }

      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          performanceId: performance.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout du média')
      }

      toast.success('Média ajouté avec succès !')
      setFormData({
        type: 'IMAGE',
        url: '',
        thumbnailUrl: '',
        title: '',
        description: '',
      })
      
      // Recharger les médias
      const mediaRes = await fetch(`/api/media?performanceId=${performance.id}`)
      const mediaData = await mediaRes.json()
      const performanceMedia = (mediaData.media || []).filter(
        (m: any) => m.performanceId === performance.id
      )
      setMedia(performanceMedia)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout du média')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      toast.success('Média supprimé avec succès !')
      setMedia(media.filter(m => m.id !== mediaId))
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Performance non trouvée</h1>
        <Link href="/artist/dashboard" className="btn-primary">
          Retour au dashboard
        </Link>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Gérer les médias</h1>
            <p className="text-gray-600">{performance.title}</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/artist/performances/${params.id}`} className="btn-secondary text-sm">
              ← Retour
            </Link>
            <Link href="/artist/dashboard" className="btn-secondary text-sm">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Formulaire d'ajout de média */}
        <div className="card p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Ajouter un média</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de média *
              </label>
              <select
                id="type"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Vidéo</option>
                <option value="AUDIO">Audio</option>
              </select>
            </div>

            {formData.type === 'IMAGE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <ImageUpload
                  value={formData.url}
                  onChange={(url) => setFormData({ ...formData, url })}
                  label=""
                />
              </div>
            )}

            {formData.type !== 'IMAGE' && (
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL {formData.type === 'VIDEO' ? 'de la vidéo' : 'de l\'audio'} *
                </label>
                <input
                  type="url"
                  id="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'VIDEO' 
                    ? 'URL YouTube, Vimeo, ou autre plateforme vidéo'
                    : 'URL du fichier audio'}
                </p>
              </div>
            )}

            {formData.type === 'VIDEO' && (
              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Miniature (optionnel)
                </label>
                <ImageUpload
                  value={formData.thumbnailUrl}
                  onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  label=""
                />
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Titre du média"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Description du média"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.url.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? 'Ajout...' : 'Ajouter le média'}
            </button>
          </form>
        </div>

        {/* Liste des médias existants */}
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Médias existants ({media.length})</h2>
          {media.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun média pour le moment. Ajoutez-en un ci-dessus.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {media.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {item.type === 'IMAGE' ? (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={item.url}
                        alt={item.title || 'Image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : item.type === 'VIDEO' ? (
                    <div className="relative h-48 bg-gray-900 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title || 'Vidéo'}
                          fill
                          className="object-cover opacity-50"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : null}
                      <VideoIcon className="w-12 h-12 text-white relative z-10" />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.title && (
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {item.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg py-2 hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ManageMediaPage() {
  return (
    <ArtistGuard>
      <ManageMediaPageContent />
    </ArtistGuard>
  )
}

