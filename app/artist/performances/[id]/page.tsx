'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import ArtistGuard from '@/components/ArtistGuard'
import { performanceUpdateSchema } from '@/lib/validations'

function EditPerformancePageContent() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    videoUrl: '',
    imageUrl: '',
    eventId: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const performanceId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!performanceId) {
          setError('ID performance manquant')
          setLoading(false)
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const [performanceRes, eventsRes] = await Promise.all([
          fetch(`/api/performances/${performanceId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('/api/events'),
        ])

        if (!performanceRes.ok) {
          const errorText = await performanceRes.text()
          console.error('Error loading performance:', performanceRes.status, errorText)
          setError(`Erreur lors du chargement: ${performanceRes.status === 404 ? 'Performance non trouvée' : 'Erreur serveur'}`)
          setLoading(false)
          setTimeout(() => {
            router.push('/artist/dashboard')
          }, 3000)
          return
        }

        const performanceData = await performanceRes.json()
        const eventsData = await eventsRes.json()
        
        const performance = performanceData.performance
        
        // Vérifier que c'est bien la performance de l'artiste
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (performance.user.id !== payload.id) {
          setError('Vous ne pouvez modifier que vos propres performances')
          setLoading(false)
          setTimeout(() => {
            router.push('/artist/dashboard')
          }, 3000)
          return
        }
        
        const date = new Date(performance.date)
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)

        setFormData({
          title: performance.title ?? '',
          description: performance.description ?? '',
          date: formattedDate,
          location: performance.location ?? '',
          videoUrl: performance.videoUrl ?? '',
          imageUrl: performance.imageUrl ?? '',
          eventId: performance.eventId ?? '',
        })
        setEvents(eventsData.events || [])
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Erreur lors du chargement de la performance')
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
    setError('')
    setSaving(true)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Vous devez être connecté')
      return
    }

    try {
      const performanceId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!performanceId) {
        setError('ID performance manquant')
        return
      }

      // Valider avec Zod
      const validation = performanceUpdateSchema.safeParse({
        ...formData,
        date: new Date(formData.date).toISOString(),
        eventId: formData.eventId || null,
      })

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        setError(firstError.message)
        toast.error(firstError.message)
        return
      }

      const res = await fetch(`/api/performances/${performanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || data.details?.[0]?.message || 'Erreur lors de la mise à jour'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      toast.success('Performance mise à jour avec succès !')
      router.push('/artist/dashboard')
    } catch (err) {
      const errorMsg = 'Une erreur est survenue'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setSaving(false)
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
        className="max-w-2xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Modifier la performance</h1>
          <Link href="/artist/dashboard" className="btn-secondary text-sm">
            ← Retour
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="datetime-local"
              id="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Image de la performance"
          />

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Lien vidéo (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
              Lier à un événement existant (optionnel)
            </label>
            <select
              id="eventId"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">-- Aucun événement --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({new Date(event.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
            <Link 
              href={`/artist/performances/${params.id}/media`} 
              className="btn-secondary text-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              Gérer les médias
            </Link>
            <Link href="/artist/dashboard" className="btn-secondary text-center">
              Annuler
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function EditPerformancePage() {
  return (
    <ArtistGuard>
      <EditPerformancePageContent />
    </ArtistGuard>
  )
}

