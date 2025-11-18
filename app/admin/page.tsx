'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AdminGuard from '@/components/AdminGuard'

interface Stats {
  events: number
  performances: number
  media: number
  users: number
}

function AdminDashboardContent() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {

    // Charger les statistiques
    async function loadStats() {
      try {
        const [eventsRes, performancesRes, mediaRes, usersRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/performances'),
          fetch('/api/media'),
          fetch('/api/users'),
        ])

        const events = await eventsRes.json()
        const performances = await performancesRes.json()
        const media = await mediaRes.json()
        const users = await usersRes.json()

        setStats({
          events: events.events?.length || 0,
          performances: performances.performances?.length || 0,
          media: media.media?.length || 0,
          users: users.users?.length || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard Admin</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
            ← Retour au site
          </Link>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="card p-4 md:p-6">
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Événements</h3>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.events}</p>
            </div>
            <div className="card p-4 md:p-6">
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Performances</h3>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.performances}</p>
            </div>
            <div className="card p-4 md:p-6">
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Médias</h3>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.media}</p>
            </div>
            <div className="card p-4 md:p-6">
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-2">Utilisateurs</h3>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">{stats.users}</p>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link href="/admin/events" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Gérer les événements</h3>
            <p className="text-sm md:text-base text-gray-600">Créer, modifier ou supprimer des événements</p>
          </Link>
          <Link href="/admin/performances" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Gérer les performances</h3>
            <p className="text-sm md:text-base text-gray-600">Créer, modifier ou supprimer des performances</p>
          </Link>
          <Link href="/admin/media" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Gérer les médias</h3>
            <p className="text-sm md:text-base text-gray-600">Ajouter ou supprimer des médias</p>
          </Link>
          <Link href="/admin/social-links" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Liens sociaux</h3>
            <p className="text-sm md:text-base text-gray-600">Gérer les liens YouTube, Spotify, Deezer, etc.</p>
          </Link>
          <Link href="/admin/users" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary-200">
            <h3 className="text-lg md:text-xl font-bold mb-2">Gérer les utilisateurs</h3>
            <p className="text-sm md:text-base text-gray-600">Créer, modifier ou supprimer des utilisateurs et admins</p>
          </Link>
          <Link href="/admin/settings" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Paramètres du site</h3>
            <p className="text-sm md:text-base text-gray-600">Gérer l&apos;image de fond, les textes et les paramètres globaux</p>
          </Link>
          <Link href="/admin/global-media" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold mb-2">Médias globaux</h3>
            <p className="text-sm md:text-base text-gray-600">Gérer toutes les images, vidéos et sons du site</p>
          </Link>
          <Link href="/admin/images" className="card p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary-200">
            <h3 className="text-lg md:text-xl font-bold mb-2">Gestion des images</h3>
            <p className="text-sm md:text-base text-gray-600">Gérer l&apos;image de fond et toutes les images de la plateforme</p>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  )
}

