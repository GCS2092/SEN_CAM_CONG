'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminGuard from '@/components/AdminGuard'
import Image from 'next/image'

interface GlobalMedia {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
  category: string | null
  order: number
  active: boolean
  createdAt: string
}

function AdminGlobalMediaPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [media, setMedia] = useState<GlobalMedia[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'IMAGE',
    url: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    category: 'gallery',
    order: 0,
    active: true,
  })

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch('/api/global-media')
        const data = await res.json()
        setMedia(data.media || [])
      } catch (error) {
        console.error('Error loading media:', error)
        toast.error('Erreur lors du chargement des médias')
      } finally {
        setLoading(false)
      }
    }

    loadMedia()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error('Vous devez être connecté')
      return
    }

    try {
      const res = await fetch('/api/global-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      toast.success('Média ajouté avec succès !')
      setMedia([...media, data.media])
      setFormData({
        type: 'IMAGE',
        url: '',
        thumbnailUrl: '',
        title: '',
        description: '',
        category: 'gallery',
        order: 0,
        active: true,
      })
      setShowForm(false)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout du média')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/global-media/${id}`, {
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

  const handleToggleActive = async (item: GlobalMedia) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/global-media/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !item.active }),
      })

      if (res.ok) {
        toast.success(`Média ${!item.active ? 'activé' : 'désactivé'} avec succès !`)
        setMedia(media.map(m => m.id === item.id ? { ...m, active: !m.active } : m))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating media:', error)
      toast.error('Erreur lors de la mise à jour')
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
          <h1 className="text-3xl md:text-4xl font-bold">Médias globaux</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link href="/admin" className="btn-secondary text-center text-sm">
              ← Retour
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-center text-sm"
            >
              {showForm ? 'Annuler' : '+ Ajouter un média'}
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="card p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Ajouter un média global</h2>
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
                </div>
              )}

              {formData.type === 'VIDEO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="gallery">Galerie</option>
                  <option value="hero">Hero</option>
                  <option value="background">Arrière-plan</option>
                  <option value="promo">Promotion</option>
                  <option value="other">Autre</option>
                </select>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    id="order"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">
                    Actif
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                Ajouter le média
              </button>
            </form>
          </div>
        )}

        {/* Liste des médias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {item.type === 'IMAGE' && item.url && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title || 'Image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              {item.type === 'VIDEO' && (
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
                  <div className="relative z-10 text-white text-4xl">▶️</div>
                </div>
              )}
              {item.type === 'AUDIO' && (
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-6xl">🎵</span>
                </div>
              )}
              <div className="p-4">
                {item.title && (
                  <h3 className="font-bold mb-2">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-gray-100 rounded">{item.type}</span>
                  {item.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                      item.active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {item.active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun média global pour le moment
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function AdminGlobalMediaPage() {
  return (
    <AdminGuard>
      <AdminGlobalMediaPageContent />
    </AdminGuard>
  )
}

