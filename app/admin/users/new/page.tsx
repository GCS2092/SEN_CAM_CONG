'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'
import { userCreateSchema } from '@/lib/validations'

function NewUserPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'ARTIST',
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
      const validation = userCreateSchema.safeParse(formData)

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        setError(firstError.message)
        toast.error(firstError.message)
        return
      }

      const res = await fetch('/api/users', {
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

      toast.success('Utilisateur créé avec succès !')
      router.push('/admin/users')
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
          <h1 className="text-3xl md:text-4xl font-bold">Nouvel utilisateur</h1>
          <Link href="/admin/users" className="btn-secondary text-sm">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Minimum 6 caractères"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom (optionnel)
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nom complet"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <select
              id="role"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' | 'ARTIST' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
              <option value="ARTIST">Artiste</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Les administrateurs ont accès à toutes les fonctionnalités de gestion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
            <Link href="/admin/users" className="btn-secondary text-center">
              Annuler
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function NewUserPage() {
  return (
    <AdminGuard>
      <NewUserPageContent />
    </AdminGuard>
  )
}

