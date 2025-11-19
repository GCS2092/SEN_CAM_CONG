'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EventIcon, PerformanceIcon, MediaIcon, UserIcon, ShareIcon, ImageIcon } from '@/components/Icons'
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
    <div className="container mx-auto px-4 py-8 md:py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Admin</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gérez votre plateforme en toute simplicité</p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            ← Retour au site
          </Link>
        </div>

        {/* Statistiques améliorées */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Événements</h3>
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <EventIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">{stats.events}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Performances</h3>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <PerformanceIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.performances}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Médias</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MediaIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.media}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Utilisateurs</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">{stats.users}</p>
            </motion.div>
          </div>
        )}

        {/* Actions rapides améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/admin/events" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <EventIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Gérer les événements</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Créer, modifier ou supprimer des événements</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link href="/admin/performances" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <PerformanceIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Gérer les performances</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Créer, modifier ou supprimer des performances</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/admin/media" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <MediaIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Gérer les médias</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Ajouter ou supprimer des médias</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link href="/admin/social-links" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-primary-200 dark:border-primary-700 p-6 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <ShareIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Liens sociaux &quot;Suivez-nous&quot;</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Gérer les liens de la bannière &quot;Suivez-nous&quot;</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/admin/users" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-green-200 dark:border-green-700 p-6 hover:shadow-xl hover:border-green-400 dark:hover:border-green-500 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Gérer les utilisateurs</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Créer, modifier ou supprimer des utilisateurs et admins</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/admin/settings" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">Paramètres du site</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Gérer l&apos;image de fond, les textes et les paramètres globaux</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/admin/gallery-media" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-primary-200 dark:border-primary-700 p-6 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <MediaIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">📸 Médias de la galerie publique</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Ajouter des images, vidéos et sons directement visibles dans la galerie publique</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link href="/admin/global-media" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <MediaIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Médias globaux</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Gérer toutes les images, vidéos et sons du site (toutes catégories)</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/admin/images" className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-primary-200 dark:border-primary-700 p-6 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Gestion des images</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Gérer l&apos;image de fond et toutes les images de la plateforme</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Link href="/admin/migrate-images" className="block bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-md border-2 border-blue-200 dark:border-blue-700 p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">🚀 Migration des images</h3>
              </div>
              <p className="text-sm md:text-base text-blue-700 dark:text-blue-400">Uploader les images locales vers Vercel Blob Storage</p>
            </Link>
          </motion.div>
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

