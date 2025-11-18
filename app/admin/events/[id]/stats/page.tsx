'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AdminGuard from '@/components/AdminGuard'
import Image from 'next/image'

interface Like {
  id: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: string
    createdAt: string
  }
}

interface CommentUser {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: string
  createdAt: string
  commentsCount: number
  firstCommentDate: string
}

interface EventStats {
  event: {
    id: string
    title: string
  }
  likes: Like[]
  likesCount: number
  commentUsers: CommentUser[]
  commentUsersCount: number
  totalComments: number
}

function EventStatsPageContent() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<EventStats | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const eventId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!eventId) {
          setLoading(false)
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const [likesRes, commentsRes, eventRes] = await Promise.all([
          fetch(`/api/events/${eventId}/likes/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`/api/events/${eventId}/comments/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`/api/events/${eventId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ])

        if (!likesRes.ok || !commentsRes.ok || !eventRes.ok) {
          throw new Error('Erreur lors du chargement des statistiques')
        }

        const likesData = await likesRes.json()
        const commentsData = await commentsRes.json()
        const eventData = await eventRes.json()

        setStats({
          event: eventData.event,
          likes: likesData.likes || [],
          likesCount: likesData.count || 0,
          commentUsers: commentsData.users || [],
          commentUsersCount: commentsData.count || 0,
          totalComments: commentsData.totalComments || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadStats()
    }
  }, [params.id, router])

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
      ADMIN: 'Admin',
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

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Erreur lors du chargement</h1>
        <Link href="/admin/events" className="btn-primary">
          Retour
        </Link>
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
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Statistiques</h1>
            <p className="text-gray-600">{stats.event.title}</p>
          </div>
          <Link href="/admin/events" className="btn-secondary text-sm">
            ← Retour
          </Link>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Likes</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.likesCount}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Commentaires</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalComments}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Utilisateurs ayant commenté</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.commentUsersCount}</p>
          </div>
        </div>

        {/* Liste des utilisateurs qui ont liké */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4 p-4 border-b border-gray-200">Utilisateurs qui ont aimé ({stats.likesCount})</h2>
          {stats.likes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun like pour le moment
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stats.likes.map((like) => (
                <div key={like.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {like.user.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={like.user.avatar}
                        alt={like.user.name || like.user.email}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold">
                        {(like.user.name || like.user.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 truncate">
                        {like.user.name || like.user.email}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${getRoleBadge(like.user.role)}`}>
                        {getRoleLabel(like.user.role)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(like.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liste des utilisateurs qui ont commenté */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 p-4 border-b border-gray-200">Utilisateurs qui ont commenté ({stats.commentUsersCount})</h2>
          {stats.commentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun commentaire pour le moment
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stats.commentUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {user.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={user.avatar}
                        alt={user.name || user.email}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold">
                        {(user.name || user.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 truncate">
                        {user.name || user.email}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${getRoleBadge(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.commentsCount} commentaire{user.commentsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Premier commentaire : {new Date(user.firstCommentDate).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function EventStatsPage() {
  return (
    <AdminGuard>
      <EventStatsPageContent />
    </AdminGuard>
  )
}

