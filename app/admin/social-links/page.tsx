'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AdminGuard from '@/components/AdminGuard'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string | null
  description: string | null
  order: number
  active: boolean
}

function AdminSocialLinksPageContent() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/social-links')
        const data = await res.json()
        if (res.ok) {
          setSocialLinks(data.socialLinks || [])
        } else {
          setError(data.error || 'Failed to fetch social links')
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error('Error fetching social links:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSocialLinks()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    try {
      const res = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setSocialLinks(socialLinks.filter((link) => link.id !== id))
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression')
      console.error('Error deleting social link:', err)
    }
  }

  const handleToggleActive = async (link: SocialLink) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    try {
      const res = await fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          active: !link.active,
        }),
      })

      if (res.ok) {
        setSocialLinks(
          socialLinks.map((l) =>
            l.id === link.id ? { ...l, active: !l.active } : l
          )
        )
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error('Error updating social link:', err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Gérer les liens sociaux</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Link href="/admin" className="btn-secondary text-center text-sm">
            ← Retour
          </Link>
          <Link href="/admin/social-links/new" className="btn-primary text-center text-sm">
            + Nouveau lien
          </Link>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Ordre</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {socialLinks.map((link) => (
                <tr key={link.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{link.name}</td>
                  <td className="px-6 py-4">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm truncate max-w-xs block"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {link.description || '-'}
                  </td>
                  <td className="px-6 py-4">{link.order}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(link)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        link.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {link.active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/social-links/${link.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {socialLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun lien social pour le moment
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{link.name}</h3>
              <button
                onClick={() => handleToggleActive(link)}
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  link.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {link.active ? 'Actif' : 'Inactif'}
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium">URL:</span>{' '}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline break-all"
                >
                  {link.url}
                </a>
              </p>
              {link.description && (
                <p>
                  <span className="font-medium">Description:</span> {link.description}
                </p>
              )}
              <p>
                <span className="font-medium">Ordre:</span> {link.order}
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/social-links/${link.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Modifier
              </Link>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {socialLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun lien social pour le moment
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminSocialLinksPage() {
  return (
    <AdminGuard>
      <AdminSocialLinksPageContent />
    </AdminGuard>
  )
}

