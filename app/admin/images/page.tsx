'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminGuard from '@/components/AdminGuard'
import Image from 'next/image'

interface ImageItem {
  id: string
  url: string
  type: 'hero' | 'event' | 'performance' | 'media' | 'global'
  title?: string
  source?: string // 'event', 'performance', etc.
  sourceId?: string
}

function AdminImagesPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<ImageItem[]>([])
  const [filter, setFilter] = useState<'all' | 'hero' | 'event' | 'performance' | 'media' | 'global'>('all')
  const [showHeroForm, setShowHeroForm] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAllImages()
    loadHeroImage()
  }, [])

  async function loadHeroImage() {
    try {
      const res = await fetch('/api/site-settings?key=hero_background_image')
      const data = await res.json()
      if (data.setting?.value) {
        setHeroImage(data.setting.value)
      }
    } catch (error) {
      console.error('Error loading hero image:', error)
    }
  }

  async function loadAllImages() {
    setLoading(true)
    try {
      // Charger toutes les images depuis différentes sources avec gestion d'erreur
      const [eventsRes, performancesRes, mediaRes, globalMediaRes] = await Promise.all([
        fetch('/api/events').catch(() => ({ json: async () => ({ events: [] }) })),
        fetch('/api/performances').catch(() => ({ json: async () => ({ performances: [] }) })),
        fetch('/api/media').catch(() => ({ json: async () => ({ media: [] }) })),
        fetch('/api/global-media?type=IMAGE').catch(() => ({ json: async () => ({ media: [] }) })),
      ])

      const events = await eventsRes.json()
      const performances = await performancesRes.json()
      const media = await mediaRes.json()
      const globalMedia = await globalMediaRes.json()

      const allImages: ImageItem[] = []

      // Images des événements
      if (events.events) {
        events.events.forEach((event: any) => {
          if (event.imageUrl) {
            allImages.push({
              id: `event-${event.id}`,
              url: event.imageUrl,
              type: 'event',
              title: event.title,
              source: 'event',
              sourceId: event.id,
            })
          }
        })
      }

      // Images des performances
      if (performances.performances) {
        performances.performances.forEach((perf: any) => {
          if (perf.imageUrl) {
            allImages.push({
              id: `performance-${perf.id}`,
              url: perf.imageUrl,
              type: 'performance',
              title: perf.title,
              source: 'performance',
              sourceId: perf.id,
            })
          }
        })
      }

      // Images des médias
      if (media.media) {
        media.media
          .filter((m: any) => m.type === 'IMAGE')
          .forEach((m: any) => {
            allImages.push({
              id: `media-${m.id}`,
              url: m.url,
              type: 'media',
              title: m.title || 'Média',
              source: 'media',
              sourceId: m.id,
            })
          })
      }

      // Images globales
      if (globalMedia.media) {
        globalMedia.media.forEach((gm: any) => {
          allImages.push({
            id: `global-${gm.id}`,
            url: gm.url,
            type: 'global',
            title: gm.title || 'Média global',
            source: 'global',
            sourceId: gm.id,
          })
        })
      }

      setImages(allImages)
    } catch (error) {
      console.error('Error loading images:', error)
      toast.error('Erreur lors du chargement des images')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHeroImage = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: 'hero_background_image',
          value: heroImage,
          type: 'image',
          description: 'Image de fond de la section Hero',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      toast.success('Image de fond Hero sauvegardée avec succès !')
      setShowHeroForm(false)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (image: ImageItem) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette image ?`)) return

    const token = localStorage.getItem('token')
    
    try {
      let res
      
      if (image.source === 'event') {
        // Mettre à jour l'événement pour supprimer l'image
        res = await fetch(`/api/events/${image.sourceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: null }),
        })
      } else if (image.source === 'performance') {
        // Mettre à jour la performance pour supprimer l'image
        res = await fetch(`/api/performances/${image.sourceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: null }),
        })
      } else if (image.source === 'media') {
        // Supprimer le média
        res = await fetch(`/api/media/${image.sourceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      } else if (image.source === 'global') {
        // Supprimer le média global
        res = await fetch(`/api/global-media/${image.sourceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }

      if (res && res.ok) {
        toast.success('Image supprimée avec succès !')
        loadAllImages()
      } else {
        const data = await res?.json()
        toast.error(data?.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Erreur lors de la suppression de l\'image')
    }
  }

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.type === filter)

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
          <h1 className="text-3xl md:text-4xl font-bold">Gestion des images</h1>
          <Link href="/admin" className="btn-secondary text-sm">
            ← Retour
          </Link>
        </div>

        {/* Section Image de fond Hero */}
        <div className="card p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Image de fond du site (Hero)</h2>
              <p className="text-gray-600 text-sm">
                Cette image est affichée en arrière-plan de la section Hero sur la page d&apos;accueil
              </p>
            </div>
            <button
              onClick={() => setShowHeroForm(!showHeroForm)}
              className="btn-primary text-sm"
            >
              {showHeroForm ? 'Annuler' : heroImage ? 'Modifier' : 'Configurer'}
            </button>
          </div>

          {showHeroForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <ImageUpload
                value={heroImage}
                onChange={setHeroImage}
                label="Image de fond Hero"
              />
              <button
                onClick={handleSaveHeroImage}
                disabled={saving || !heroImage}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </motion.div>
          )}

          {!showHeroForm && heroImage && (
            <div className="mt-4">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <Image
                  src={heroImage}
                  alt="Image de fond Hero"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 break-all font-mono">{heroImage}</p>
            </div>
          )}
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'hero', 'event', 'performance', 'media', 'global'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Toutes' : f === 'hero' ? 'Hero' : f === 'event' ? 'Événements' : f === 'performance' ? 'Performances' : f === 'media' ? 'Médias' : 'Globales'}
                {f !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                    {images.filter(img => img.type === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des images */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Aucune image trouvée</p>
            <p className="text-sm">
              {filter === 'all' 
                ? 'Aucune image n\'a été ajoutée sur la plateforme'
                : `Aucune image de type "${filter}" trouvée`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.title || 'Image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-image.png'
                    }}
                  />
                </div>
                <div className="p-4">
                  {image.title && (
                    <h3 className="font-bold mb-2 text-sm line-clamp-1">{image.title}</h3>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded ${
                      image.type === 'event' ? 'bg-blue-100 text-blue-800' :
                      image.type === 'performance' ? 'bg-purple-100 text-purple-800' :
                      image.type === 'media' ? 'bg-green-100 text-green-800' :
                      image.type === 'global' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {image.type === 'event' ? 'Événement' :
                       image.type === 'performance' ? 'Performance' :
                       image.type === 'media' ? 'Média' :
                       image.type === 'global' ? 'Global' : 'Hero'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {image.source && image.sourceId && (
                      <Link
                        href={
                          image.source === 'event' ? `/admin/events/${image.sourceId}` :
                          image.source === 'performance' ? `/admin/performances/${image.sourceId}` :
                          image.source === 'media' ? `/admin/media` :
                          image.source === 'global' ? `/admin/global-media` : '/admin/settings'
                        }
                        className="flex-1 px-3 py-2 text-sm text-center bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                      >
                        Modifier
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 break-all font-mono line-clamp-2">
                    {image.url}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{images.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {images.filter(img => img.type === 'event').length}
            </p>
            <p className="text-sm text-gray-600">Événements</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {images.filter(img => img.type === 'performance').length}
            </p>
            <p className="text-sm text-gray-600">Performances</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {images.filter(img => img.type === 'media').length}
            </p>
            <p className="text-sm text-gray-600">Médias</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {images.filter(img => img.type === 'global').length}
            </p>
            <p className="text-sm text-gray-600">Globales</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminImagesPage() {
  return (
    <AdminGuard>
      <AdminImagesPageContent />
    </AdminGuard>
  )
}

