'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'
import { userUpdateSchema } from '@/lib/validations'

function EditUserPageContent() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'ARTIST',
  })

  useEffect(() => {
    async function loadUser() {
      try {
        const userId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!userId) {
          setError('ID utilisateur manquant')
          setLoading(false)
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Error loading user:', res.status, errorText)
          setError(`Erreur lors du chargement: ${res.status === 404 ? 'Utilisateur non trouvé' : 'Erreur serveur'}`)
          setLoading(false)
          setTimeout(() => {
            router.push('/admin/users')
          }, 3000)
          return
        }

        const data = await res.json()
        if (!data.user) {
          setError('Utilisateur non trouvé dans la réponse')
          setLoading(false)
          setTimeout(() => {
            router.push('/admin/users')
          }, 3000)
          return
        }

        const user = data.user
        setFormData({
          email: user.email || '',
          password: '', // Ne pas pré-remplir le mot de passe
          name: user.name || '',
          role: user.role || 'USER',
        })
      } catch (err) {
        console.error('Error loading user:', err)
        setError('Erreur lors du chargement de l\'utilisateur')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadUser()
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
      const userId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!userId) {
        setError('ID utilisateur manquant')
        return
      }

      // Préparer les données (ne pas envoyer le mot de passe s'il est vide)
      const updateData: any = {
        email: formData.email,
        name: formData.name || null,
        role: formData.role,
      }

      // Ajouter le mot de passe seulement s'il a été modifié
      if (formData.password) {
        updateData.password = formData.password
      }

      // Valider avec Zod
      const validation = userUpdateSchema.safeParse(updateData)

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        setError(firstError.message)
        toast.error(firstError.message)
        return
      }

      const res = await fetch(`/api/users/${userId}`, {
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

      toast.success('Utilisateur mis à jour avec succès !')
      router.push('/admin/users')
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
          <h1 className="text-3xl md:text-4xl font-bold">Modifier l&apos;utilisateur</h1>
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
              Nouveau mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              id="password"
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
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? 'Mise à jour...' : 'Enregistrer les modifications'}
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

export default function EditUserPage() {
  return (
    <AdminGuard>
      <EditUserPageContent />
    </AdminGuard>
  )
}

