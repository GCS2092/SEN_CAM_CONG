'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toastDelete, toastError } from '@/lib/toast-helpers'
import { SearchIcon, EditIcon, DeleteIcon, PlusIcon, UserIcon, FilterIcon } from '@/components/Icons'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'ARTIST' | 'USER'>('all')

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
        toastError('Erreur lors du chargement des utilisateurs')
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
        toastError('Vous devez être connecté')
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

      toastDelete('Utilisateur supprimé avec succès')
      // Recharger la liste
      setUsers(users.filter(u => u.id !== userId))
    } catch (error: any) {
      toastError(error.message || 'Erreur lors de la suppression')
    }
  }

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    // Filtre par rôle
    if (filter !== 'all' && user.role !== filter) return false
    
    // Recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.email.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query))
      )
    }
    
    return true
  })

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-100bg-red-900/30 text-red-800text-red-300',
      ARTIST: 'bg-purple-100bg-purple-900/30 text-purple-800text-purple-300',
      USER: 'bg-gray-100bg-gray-700 text-gray-800text-gray-300',
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
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header avec icône et stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100bg-green-900/30 rounded-xl">
                <UserIcon className="w-6 h-6 text-green-600text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900text-white">Gestion des utilisateurs</h1>
                <p className="text-sm text-gray-600text-gray-400 mt-1">
                  {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} {filter !== 'all' ? `(${getRoleLabel(filter)})` : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-whitebg-gray-800 border border-gray-300border-gray-700 text-gray-700text-gray-300 rounded-lg hover:bg-gray-50hover:bg-gray-700 transition-colors text-sm font-medium text-center flex items-center justify-center gap-2"
              >
                ← Retour
              </Link>
              <Link 
                href="/admin/users/new" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-4 h-4" />
                Nouvel utilisateur
              </Link>
            </div>
          </div>
        </div>

        {/* Barre de recherche améliorée */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-4 text-sm border-2 border-gray-200border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-whitebg-gray-800 text-gray-900text-white placeholder-gray-400placeholder-gray-500 transition-all shadow-sm hover:shadow-md"
            />
            <SearchIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtres améliorés */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-gray-700text-gray-300 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filtres :
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
              filter === 'all'
                ? 'bg-green-600 text-white shadow-md scale-105'
                : 'bg-whitebg-gray-800 text-gray-700text-gray-300 border border-gray-200border-gray-700 hover:bg-gray-50hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('ADMIN')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
              filter === 'ADMIN'
                ? 'bg-red-600 text-white shadow-md scale-105'
                : 'bg-whitebg-gray-800 text-gray-700text-gray-300 border border-gray-200border-gray-700 hover:bg-gray-50hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            Administrateurs
          </button>
          <button
            onClick={() => setFilter('ARTIST')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
              filter === 'ARTIST'
                ? 'bg-purple-600 text-white shadow-md scale-105'
                : 'bg-whitebg-gray-800 text-gray-700text-gray-300 border border-gray-200border-gray-700 hover:bg-gray-50hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            Artistes
          </button>
          <button
            onClick={() => setFilter('USER')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm ${
              filter === 'USER'
                ? 'bg-gray-600 text-white shadow-md scale-105'
                : 'bg-whitebg-gray-800 text-gray-700text-gray-300 border border-gray-200border-gray-700 hover:bg-gray-50hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            Utilisateurs
          </button>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100bg-gray-800 mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            {searchQuery || filter !== 'all' 
              ? (
                <p className="text-gray-500text-gray-400 text-lg font-medium">Aucun utilisateur ne correspond à vos critères</p>
              ) : (
                <>
                  <p className="text-gray-500text-gray-400 text-lg font-medium mb-4">Aucun utilisateur trouvé</p>
                  <Link href="/admin/users/new" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                    <PlusIcon className="w-4 h-4" />
                    Créer le premier utilisateur
                  </Link>
                </>
              )}
          </div>
        ) : (
          <>
            {/* Version mobile : cartes améliorées */}
            <div className="block md:hidden space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-whitebg-gray-800 rounded-xl shadow-md border border-gray-200border-gray-700 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-base font-semibold text-gray-900text-white truncate">
                        {user.email}
                      </h3>
                      {user.name && (
                        <p className="text-sm text-gray-600text-gray-400 mt-1">
                          {user.name}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full flex-shrink-0 ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500text-gray-400 mb-4">
                    Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200border-gray-700">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50bg-green-900/20 text-green-600text-green-400 rounded-lg hover:bg-green-100hover:bg-green-900/30 transition-colors text-sm font-medium"
                    >
                      <EditIcon className="w-4 h-4" />
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50bg-red-900/20 text-red-600text-red-400 rounded-lg hover:bg-red-100hover:bg-red-900/30 transition-colors text-sm font-medium"
                    >
                      <DeleteIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Version desktop : tableau amélioré */}
            <div className="hidden md:block bg-whitebg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-50 to-green-100from-green-900/30to-green-800/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Rôle</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Créé le</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100divide-gray-700">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900text-white max-w-xs truncate" title={user.email}>
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600text-gray-400">
                          {user.name || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="p-2 text-green-600 hover:text-green-700text-green-400hover:text-green-300 hover:bg-green-50hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Modifier"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditIcon className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(user.id, user.email)
                              }}
                              className="p-2 text-red-600 hover:text-red-700text-red-400hover:text-red-300 hover:bg-red-50hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
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


