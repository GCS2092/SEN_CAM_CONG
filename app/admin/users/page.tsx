'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  updatedAt: string
}

function UsersPageContent() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login')
            return
          }
          throw new Error('Erreur lors du chargement des utilisateurs')
        }

        const data = await res.json()
        setUsers(data.users || [])
      } catch (error) {
        console.error('Error loading users:', error)
        toast.error('Erreur lors du chargement des utilisateurs')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [router])

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Vous devez être connecté')
        return
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      toast.success('Utilisateur supprimé avec succès')
      // Recharger la liste
      setUsers(users.filter(u => u.id !== userId))
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      ARTIST: 'bg-purple-100 text-purple-800',
      USER: 'bg-gray-100 text-gray-800',
    }
    return colors[role as keyof typeof colors] || colors.USER
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Administrateur',
      ARTIST: 'Artiste',
      USER: 'Utilisateur',
    }
    return labels[role as keyof typeof labels] || role
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Gestion des utilisateurs</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href="/admin/users/new" className="btn-primary text-sm text-center">
              + Nouvel utilisateur
            </Link>
            <Link href="/admin" className="btn-secondary text-sm text-center">
              ← Retour
            </Link>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
            <Link href="/admin/users/new" className="btn-primary">
              Créer le premier utilisateur
            </Link>
          </div>
        ) : (
          <>
            {/* Version mobile : cartes */}
            <div className="block md:hidden space-y-4">
              {users.map((user) => (
                <div key={user.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user.email}
                      </h3>
                      {user.name && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.name}
                        </p>
                      )}
                    </div>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full flex-shrink-0 ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 border border-primary-300 dark:border-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Version desktop : tableau */}
            <div className="hidden md:block card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Créé le
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <div className="max-w-xs truncate" title={user.email}>
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.name || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <AdminGuard>
      <UsersPageContent />
    </AdminGuard>
  )
}

