'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ImageUpload from '@/components/ImageUpload'
import { toastDelete, toastAdd, toastError, toastSuccess } from '@/lib/toast-helpers'
import { SearchIcon, DeleteIcon, PlusIcon, MediaIcon, FilterIcon, ImageIcon, VideoIcon, MusicIcon } from '@/components/Icons'
import AdminGuard from '@/components/AdminGuard'
import Image from 'next/image'

interface Media {
  id: string
  type: string
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
  performanceId: string | null
}

function AdminMediaPageContent() {
  const router = useRouter()
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'IMAGE' | 'VIDEO' | 'AUDIO'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    type: 'IMAGE',
    url: '',
    thumbnailUrl: '',
    title: '',
    description: '',
    addToGallery: false, // Option pour ajouter directement à la galerie
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    if (!token) {
      toastError('Vous devez être connecté')
      return
    }

    try {
      // Si "addToGallery" est coché, créer un global_media
      if (formData.addToGallery) {
        const res = await fetch('/api/global-media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: formData.type,
            url: formData.url,
            thumbnailUrl: formData.thumbnailUrl || null,
            title: formData.title || null,
            description: formData.description || null,
            category: 'gallery',
            order: 0,
            active: true,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de la création')
        }
        toastAdd('Média ajouté à la galerie avec succès !')
      } else {
        // Sinon, créer un média normal (lié à une performance si performanceId existe)
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: formData.type,
            url: formData.url,
            thumbnailUrl: formData.thumbnailUrl || null,
            title: formData.title || null,
            description: formData.description || null,
            performanceId: null, // Média global, non lié à une performance
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de la création')
        }
        toastAdd('Média ajouté avec succès !')
        setMedia([...media, data.media])
      }

      // Réinitialiser le formulaire
      setFormData({
        type: 'IMAGE',
        url: '',
        thumbnailUrl: '',
        title: '',
        description: '',
        addToGallery: false,
      })
      setShowForm(false)
      
      // Recharger les médias
      const mediaRes = await fetch('/api/media')
      const mediaData = await mediaRes.json()
      setMedia(mediaData.media || [])
    } catch (error: any) {
      toastError(error.message || 'Erreur lors de l\'ajout du média')
    }
  }

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
        toastDelete('Média supprimé avec succès !')
        setMedia(media.filter(m => m.id !== id))
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
      console.error('Error deleting media:', error)
      toastError('Erreur lors de la suppression du média')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} média(s) ?`)) return

    const token = localStorage.getItem('token')
    let successCount = 0
    let errorCount = 0

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/media/${id}`, {
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
      toastDelete(`${successCount} média(s) supprimé(s) avec succès !`)
      setMedia(media.filter(m => !selectedIds.has(m.id)))
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
    if (selectedIds.size === filteredMedia.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMedia.map(m => m.id)))
    }
  }

  // Filtrer les médias
  const filteredMedia = media.filter(item => {
    // Filtre par type
    if (filter !== 'all' && item.type !== filter) return false
    
    // Recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        item.url.toLowerCase().includes(query)
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <MediaIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Gérer les médias</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredMedia.length} média{filteredMedia.length > 1 ? 's' : ''} {filter !== 'all' ? `(${filter.toLowerCase()})` : ''}
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
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {showForm ? (
                  <>✕ Annuler</>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    Ajouter un média
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche améliorée */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Rechercher un média..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-4 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm hover:shadow-md"
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

        {/* Filtres améliorés */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filtres :
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('IMAGE')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm flex items-center gap-2 ${
              filter === 'IMAGE'
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images
          </button>
          <button
            onClick={() => setFilter('VIDEO')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm flex items-center gap-2 ${
              filter === 'VIDEO'
                ? 'bg-red-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            <VideoIcon className="w-4 h-4" />
            Vidéos
          </button>
          <button
            onClick={() => setFilter('AUDIO')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm flex items-center gap-2 ${
              filter === 'AUDIO'
                ? 'bg-purple-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            <MusicIcon className="w-4 h-4" />
            Audio
          </button>
          {selectedIds.size > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleBulkDelete}
              className="ml-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <DeleteIcon className="w-4 h-4" />
              Supprimer {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
            </motion.button>
          )}
        </div>

        {/* Formulaire d'ajout amélioré */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Ajouter un média</h2>
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
                    Image *
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

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="addToGallery"
                  checked={formData.addToGallery}
                  onChange={(e) => setFormData({ ...formData, addToGallery: e.target.checked })}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="addToGallery" className="ml-2 block text-sm font-medium text-gray-700">
                  Ajouter directement à la galerie publique
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Ajouter le média
              </button>
            </form>
          </motion.div>
        )}

        {/* Liste des médias améliorée */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Tous les médias ({filteredMedia.length} / {media.length})
            </h2>
            {filteredMedia.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredMedia.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Sélectionner tout
              </label>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Les médias peuvent être liés à des performances ou être globaux
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden relative hover:shadow-lg transition-all group"
            >
              <div className="absolute top-3 right-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800 shadow-md w-5 h-5 cursor-pointer"
                />
              </div>
              {item.type === 'IMAGE' && item.url && (
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={item.url}
                    alt={item.title || 'Image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      console.error('Error loading image:', item.url)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              {item.type === 'VIDEO' && (
                <div className="relative h-48 bg-gray-900 dark:bg-gray-800 flex items-center justify-center">
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
                <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center">
                  <MusicIcon className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="p-4">
                {item.title && (
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className={`px-2 py-1 rounded-full font-semibold ${
                    item.type === 'IMAGE' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : item.type === 'VIDEO'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                  }`}>
                    {item.type.toLowerCase()}
                  </span>
                  {item.performanceId && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full font-semibold">Performance</span>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium flex items-center justify-center gap-1"
                  >
                    <DeleteIcon className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredMedia.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <MediaIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
              {searchQuery || filter !== 'all' 
                ? 'Aucun média ne correspond à vos critères'
                : 'Aucun média pour le moment'}
            </p>
            {!searchQuery && filter === 'all' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Cliquez sur &quot;Ajouter un média&quot; pour commencer</p>
            )}
          </div>
        )}
      </motion.div>
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

