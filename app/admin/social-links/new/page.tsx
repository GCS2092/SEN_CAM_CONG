'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'
import { socialLinkSchema } from '@/lib/validations'

function NewSocialLinkPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    description: '',
    order: 0,
    active: true,
  })

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
      // Valider avec Zod
      const validation = socialLinkSchema.safeParse(formData)

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        setError(firstError.message)
        toast.error(firstError.message)
        return
      }

      const res = await fetch('/api/social-links', {
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

      toast.success('Lien social créé avec succès !')
      router.push('/admin/social-links')
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
          <h1 className="text-3xl md:text-4xl font-bold">Nouveau lien social</h1>
          <Link href="/admin/social-links" className="btn-secondary text-sm">
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la plateforme *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="YouTube, Spotify, Deezer, etc."
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL *
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Regardez nos vidéos et clips"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Actif</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le lien'}
            </button>
            <Link href="/admin/social-links" className="btn-secondary text-center">
              Annuler
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function NewSocialLinkPage() {
  return (
    <AdminGuard>
      <NewSocialLinkPageContent />
    </AdminGuard>
  )
}

