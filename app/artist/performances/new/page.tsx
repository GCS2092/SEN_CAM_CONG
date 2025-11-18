'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import ArtistGuard from '@/components/ArtistGuard'
import { performanceSchema } from '@/lib/validations'

function NewPerformancePageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    async function loadEvents() {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEvents(data.events || [])
      } catch (err) {
        console.error('Error loading events:', err)
      }
    }
    loadEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Vous devez être connecté')
      return
    }

    try {
      // Récupérer l'ID de l'utilisateur depuis le token
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      // Valider avec Zod
      const validation = performanceSchema.safeParse({
        ...formData,
        date: new Date(formData.date).toISOString(),
        eventId: formData.eventId || null,
        userId: payload.id,
      })

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        setError(firstError.message)
        toast.error(firstError.message)
        return
      }
      
      const res = await fetch('/api/performances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || data.details?.[0]?.message || 'Erreur lors de la création'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      toast.success('Performance créée avec succès !')
      router.push('/artist/dashboard')
    } catch (err) {
      const errorMsg = 'Une erreur est survenue'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl md:text-4xl font-bold">Nouvelle performance</h1>
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
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer la performance'}
            </button>
            <Link href="/artist/dashboard" className="btn-secondary text-center">
              Annuler
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function NewPerformancePage() {
  return (
    <ArtistGuard>
      <NewPerformancePageContent />
    </ArtistGuard>
  )
}

