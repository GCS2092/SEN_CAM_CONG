'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface LikedEvent {
  id: string
  event: {
    id: string
    title: string
    date: string
    location: string
    imageUrl: string | null
  }
  createdAt: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  event: {
    id: string
    title: string
    date: string
    imageUrl: string | null
  }
}

function UserDashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const [likedEvents, setLikedEvents] = useState<LikedEvent[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      if (!user) return

      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Charger les événements likés et commentés
        // Note: Ces routes devront être créées pour récupérer les données de l'utilisateur
        // Pour l'instant, on affiche juste le profil
        setLoading(false)
      } catch (error) {
        console.error('Error loading user data:', error)
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadUserData()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Vous devez être connecté</h1>
        <Link href="/login" className="btn-primary">
          Se connecter
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon compte</h1>
            <p className="text-gray-600">
              Bienvenue, {user.name || user.email} !
            </p>
          </div>
          <Link href="/" className="btn-secondary text-sm">
            ← Retour au site
          </Link>
        </div>

        {/* Informations du profil */}
        <div className="card p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Informations du profil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <p className="text-gray-900">{user.name}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                Utilisateur
              </span>
            </div>
          </div>
        </div>

        {/* Mes activités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Événements aimés */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Événements aimés</h2>
            {likedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">Vous n'avez pas encore aimé d'événement</p>
                <Link href="/events" className="btn-primary text-sm">
                  Découvrir les événements
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {likedEvents.map((like) => (
                  <Link
                    key={like.id}
                    href={`/events/${like.event.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{like.event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(like.event.date)} • {like.event.location}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mes commentaires */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Mes commentaires</h2>
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">Vous n'avez pas encore commenté</p>
                <Link href="/events" className="btn-primary text-sm">
                  Découvrir les événements
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Link
                    key={comment.id}
                    href={`/events/${comment.event.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{comment.event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function UserDashboard() {
  return <UserDashboardContent />
}

