'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminGuard from '@/components/AdminGuard'

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
}

function AdminMembersPageContent() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'Sénégal' | 'Cameroun' | 'Congo'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
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

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true)
      const url = filter === 'all' ? '/api/members' : `/api/members?nationality=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Error loading members:', error)
      toast.error('Erreur lors du chargement des membres')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  function handleEdit(member: Member) {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      nationality: member.nationality,
      instruments: member.instruments || [],
      order: member.order,
      active: member.active,
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingMember(null)
    setFormData({
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      nationality: 'Sénégal',
      instruments: [],
      order: 0,
      active: true,
    })
    setInstrumentInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      if (editingMember) {
        // Mise à jour
        const res = await fetch(`/api/members/${editingMember.id}`, {
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

        toast.success('Membre mis à jour avec succès !')
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

        toast.success('Membre créé avec succès !')
      }

      handleCancel()
      loadMembers()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return
    }

    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      toast.success('Membre supprimé avec succès !')
      loadMembers()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
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

  const filteredMembers = filter === 'all' ? members : members.filter(m => m.nationality === filter)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Gestion des Membres</h1>
          <div className="flex gap-3">
            <Link href="/admin" className="btn-secondary text-sm">
              ← Retour
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-sm"
            >
              + Ajouter un membre
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          {(['all', 'Sénégal', 'Cameroun', 'Congo'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                filter === filterType
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filterType === 'all' ? 'Tous' : filterType}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 md:p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingMember ? 'Modifier le membre' : 'Nouveau membre'}
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
                  placeholder="Description du membre..."
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
                  {editingMember ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Liste des membres */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                {member.imageUrl && (
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.nationality === 'Sénégal' ? 'bg-senegal-green/10 text-senegal-green' :
                    member.nationality === 'Cameroun' ? 'bg-cameroon-red/10 text-cameroon-red' :
                    'bg-congo-blue/10 text-congo-blue'
                  }`}>
                    {member.nationality}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                {member.role && (
                  <p className="text-primary-600 font-semibold mb-2">{member.role}</p>
                )}
                {member.bio && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{member.bio}</p>
                )}
                {member.instruments && member.instruments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.instruments.map((instrument) => (
                      <span
                        key={instrument}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function AdminMembersPage() {
  return (
    <AdminGuard>
      <AdminMembersPageContent />
    </AdminGuard>
  )
}

