'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import ArtistGuard from '@/components/ArtistGuard'

interface Member {
  id: string
  name: string
  role: string | null
  bio: string | null
  imageUrl: string | null
  nationality: string
  instruments: string[]
  order: number
  active: boolean
  userId: string | null
}

function ArtistMemberPageContent() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    nationality: 'Sénégal',
    instruments: [] as string[],
    order: 0,
    active: true,
  })
  const [instrumentInput, setInstrumentInput] = useState('')

  const loadMyMember = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Récupérer l'ID de l'utilisateur depuis le token
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      // Chercher le membre lié à cet utilisateur
      const res = await fetch('/api/members')
      const data = await res.json()
      const myMember = (data.members || []).find((m: Member) => m.userId === payload.id)

      if (myMember) {
        setMember(myMember)
        setFormData({
          name: myMember.name,
          role: myMember.role || '',
          bio: myMember.bio || '',
          imageUrl: myMember.imageUrl || '',
          nationality: myMember.nationality,
          instruments: myMember.instruments || [],
          order: myMember.order,
          active: myMember.active,
        })
      }
    } catch (error) {
      console.error('Error loading member:', error)
      toast.error('Erreur lors du chargement de votre profil')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadMyMember()
  }, [loadMyMember])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      if (member) {
        // Mise à jour
        const res = await fetch(`/api/members/${member.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erreur lors de la mise à jour')
        }

        toast.success('Profil mis à jour avec succès !')
        loadMyMember()
      } else {
        // Création
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erreur lors de la création')
        }

        toast.success('Profil créé avec succès !')
        loadMyMember()
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    }
  }

  function addInstrument() {
    if (instrumentInput.trim() && !formData.instruments.includes(instrumentInput.trim())) {
      setFormData({
        ...formData,
        instruments: [...formData.instruments, instrumentInput.trim()],
      })
      setInstrumentInput('')
    }
  }

  function removeInstrument(instrument: string) {
    setFormData({
      ...formData,
      instruments: formData.instruments.filter(i => i !== instrument),
    })
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mon Profil Membre</h1>
            <p className="text-gray-600 mt-2">Gérez votre profil public en tant que membre du groupe</p>
          </div>
          <a href="/artist/dashboard" className="btn-secondary text-sm">
            ← Retour au dashboard
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              {member ? 'Modifier mon profil' : 'Créer mon profil membre'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Chanteur & Percussionniste"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationalité *
                  </label>
                  <select
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Sénégal">Sénégal</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Congo">Congo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
                  placeholder="Votre description/biographie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  label=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instruments
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={instrumentInput}
                    onChange={(e) => setInstrumentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addInstrument()
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ajouter un instrument (Entrée pour ajouter)"
                  />
                  <button
                    type="button"
                    onClick={addInstrument}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.instruments.map((instrument) => (
                    <span
                      key={instrument}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                    >
                      {instrument}
                      <button
                        type="button"
                        onClick={() => removeInstrument(instrument)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Actif (visible sur le site)
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {member ? 'Mettre à jour' : 'Créer mon profil'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ArtistMemberPage() {
  return (
    <ArtistGuard>
      <ArtistMemberPageContent />
    </ArtistGuard>
  )
}

