'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'
import { motion } from 'framer-motion'

function MigrateImagesPageContent() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleMigrate = async () => {
    if (!confirm('Voulez-vous uploader toutes les images du dossier uploads vers Vercel Blob Storage et les assigner automatiquement ?')) {
      return
    }

    setLoading(true)
    setResults(null)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/admin/upload-local-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la migration')
      }

      setResults(data.results)
      toast.success('Images migrées avec succès !')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la migration')
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
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Migration des images locales</h1>

        <div className="card p-6 md:p-8 max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Upload vers Vercel Blob Storage</h2>
          
          <p className="text-gray-600 mb-6">
            Ce script va :
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Uploader toutes les images du dossier <code className="bg-gray-100 px-2 py-1 rounded">public/uploads</code> vers Vercel Blob Storage</li>
            <li>Assigner une image à chaque événement (une image par événement)</li>
            <li>Ajouter toutes les images à la galerie</li>
            <li>Configurer la première image comme image de fond Hero</li>
          </ul>

          <button
            onClick={handleMigrate}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Migration en cours...' : '🚀 Lancer la migration'}
          </button>

          {results && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">✅ Migration terminée !</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>📤 {results.uploaded} image(s) uploadée(s)</li>
                <li>📅 {results.eventsUpdated} événement(s) mis à jour</li>
                <li>🖼️  {results.galleryAdded} image(s) ajoutée(s) à la galerie</li>
                <li>🎨 Image de fond Hero: {results.heroConfigured ? '✅ Configurée' : '❌ Non configurée'}</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function MigrateImagesPage() {
  return (
    <AdminGuard>
      <MigrateImagesPageContent />
    </AdminGuard>
  )
}

