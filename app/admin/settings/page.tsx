'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminGuard from '@/components/AdminGuard'

interface SiteSetting {
  id: string
  key: string
  value: string | null
  type: string
  description: string | null
}

function AdminSettingsPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [formData, setFormData] = useState({
    heroBackgroundImage: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutPresentation: '',
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/site-settings')
        const data = await res.json()
        
        if (data.settings) {
          setSettings(data.settings)
          
          // Remplir le formulaire avec les valeurs existantes
          const heroBg = data.settings.find((s: SiteSetting) => s.key === 'hero_background_image')
          const heroTitle = data.settings.find((s: SiteSetting) => s.key === 'hero_title')
          const heroSubtitle = data.settings.find((s: SiteSetting) => s.key === 'hero_subtitle')
          const aboutPresentation = data.settings.find((s: SiteSetting) => s.key === 'about_presentation')
          
          setFormData({
            heroBackgroundImage: heroBg?.value || '',
            heroTitle: heroTitle?.value || 'SEN CAM CONG',
            heroSubtitle: heroSubtitle?.value || 'La fusion musicale du Sénégal, du Cameroun et du Congo',
            aboutPresentation: aboutPresentation?.value || '',
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error('Erreur lors du chargement des paramètres')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async (key: string, value: string, type: string = 'text', description?: string) => {
    setSaving(true)
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ key, value, type, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      toast.success('Paramètre sauvegardé avec succès !')
      
      // Mettre à jour les settings locaux
      setSettings(prev => {
        const existing = prev.find(s => s.key === key)
        const descriptionValue = description ?? null
        if (existing) {
          return prev.map(s => s.key === key ? { ...s, value, type, description: descriptionValue } : s)
        }
        return [...prev, { id: data.setting.id, key, value, type, description: descriptionValue, updatedAt: new Date().toISOString() }]
      })
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await Promise.all([
        handleSave('hero_background_image', formData.heroBackgroundImage, 'image', 'Image de fond de la section Hero'),
        handleSave('hero_title', formData.heroTitle, 'text', 'Titre principal de la section Hero'),
        handleSave('hero_subtitle', formData.heroSubtitle, 'text', 'Sous-titre de la section Hero'),
      ])
      toast.success('Tous les paramètres ont été sauvegardés !')
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSavePresentation = async () => {
    setSaving(true)
    try {
      await handleSave('about_presentation', formData.aboutPresentation, 'text', 'Texte de présentation de la page À propos')
      toast.success('Texte de présentation sauvegardé avec succès !')
    } catch (error) {
      console.error('Error saving presentation:', error)
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
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Paramètres du site</h1>
          <Link href="/admin" className="btn-secondary text-sm">
            ← Retour
          </Link>
        </div>

        <div className="space-y-8">
          {/* Section Hero */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Section Hero (Page d&apos;accueil)</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de fond
                </label>
                <ImageUpload
                  value={formData.heroBackgroundImage}
                  onChange={(url) => setFormData({ ...formData, heroBackgroundImage: url })}
                  label=""
                />
                <p className="text-xs text-gray-500 mt-2">
                  Cette image sera utilisée comme arrière-plan de la section Hero sur la page d&apos;accueil
                </p>
              </div>

              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre principal
                </label>
                <input
                  type="text"
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="SEN CAM CONG"
                />
              </div>

              <div>
                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="La fusion musicale du Sénégal, du Cameroun et du Congo"
                />
              </div>

              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer les paramètres Hero'}
              </button>
            </div>
          </div>

          {/* Section Présentation À propos */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Section Présentation (Page À propos)</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="aboutPresentation" className="block text-sm font-medium text-gray-700 mb-2">
                  Texte de présentation
                </label>
                <textarea
                  id="aboutPresentation"
                  value={formData.aboutPresentation}
                  onChange={(e) => setFormData({ ...formData, aboutPresentation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[300px]"
                  placeholder="SenCamCong – L&apos;Afrique en symphonie

Quand le Sénégal, le Cameroun et le Congo s'unissent, la musique devient un langage universel..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Ce texte sera affiché sur la page À propos. Vous pouvez utiliser des retours à la ligne pour structurer le contenu.
                </p>
              </div>

              <button
                onClick={handleSavePresentation}
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer la présentation'}
              </button>
            </div>
          </div>

          {/* Section URLs externes */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">URLs externes</h2>
            <p className="text-gray-600 mb-4">
              Gérez les liens externes (billeterie, partenaires, etc.) qui seront affichés sur le site.
            </p>
            <Link href="/admin/social-links" className="btn-primary">
              Gérer les liens sociaux et externes
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <AdminSettingsPageContent />
    </AdminGuard>
  )
}

