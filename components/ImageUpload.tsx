'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mettre à jour la prévisualisation quand value change
  useEffect(() => {
    if (value) {
      const previewUrl = value.startsWith('http') 
        ? value 
        : value.startsWith('/') 
          ? `${window.location.origin}${value}`
          : value
      setPreview(previewUrl)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type (images et vidéos)
    const allowedTypes = ['image/', 'video/']
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      setError('Veuillez sélectionner une image ou une vidéo')
      return
    }

    // Vérifier la taille (50MB max pour vidéos, 10MB pour images)
    const maxSize = file.type.startsWith('video/') 
      ? 50 * 1024 * 1024 // 50MB pour les vidéos
      : 10 * 1024 * 1024 // 10MB pour les images
    
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      setError(`Le fichier est trop volumineux (max ${maxSizeMB}MB)`)
      return
    }

    setError('')
    setUploading(true)

    // Prévisualisation locale
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload vers le serveur
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Vous devez être connecté')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      // Mettre à jour l'URL - Vercel Blob retourne { url, filename }
      // Cloudinary retourne { secure_url, url }
      const imageUrl = data.url || data.secure_url || data.blob?.url || ''
      
      console.log('📤 Upload Response:', {
        fullData: data,
        extractedUrl: imageUrl,
        hasUrl: !!data.url,
        hasSecureUrl: !!data.secure_url,
        hasBlob: !!data.blob,
      })
      
      if (imageUrl) {
        // Toujours utiliser l'URL complète (https://...) pour Vercel Blob
        const finalUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : imageUrl.startsWith('/') 
            ? `${window.location.origin}${imageUrl}`
            : imageUrl
        
        console.log('✅ Image URL finale:', finalUrl)
        
        // Appeler onChange avec l'URL complète
        onChange(finalUrl)
        
        // Pour la prévisualisation, utiliser l'URL complète
        setPreview(finalUrl)
        setError('')
        
        // Afficher un message de succès
        toast.success('Image uploadée avec succès !')
      } else {
        console.error('❌ Aucune URL dans la réponse:', data)
        throw new Error('Aucune URL retournée par le serveur. Réponse: ' + JSON.stringify(data))
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Input URL (optionnel) - Se remplit automatiquement après upload */}
      <div className="mb-3">
        {value && (value.startsWith('/uploads/') || (typeof window !== 'undefined' && value.startsWith(window.location.origin))) ? (
          // Si une image a été uploadée, afficher l'URL en lecture seule avec un message clair
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 font-semibold mb-1">
              ✅ Image uploadée avec succès ! L&apos;URL est automatiquement remplie.
            </p>
            <input
              type="text"
              value={value}
              readOnly
              className="w-full px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Vous pouvez maintenant créer l&apos;événement sans saisir d&apos;URL manuellement.
            </p>
          </div>
        ) : (
          // Sinon, afficher l'input normal pour saisir une URL externe
          <input
            type="url"
            value={value || ''}
            onChange={(e) => {
              const url = e.target.value
              onChange(url)
              if (url) {
                setPreview(url)
              } else {
                setPreview(null)
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ou entrez une URL d'image externe (optionnel)"
          />
        )}
      </div>

      {/* Bouton d'upload */}
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {uploading ? 'Upload en cours...' : '📤 Uploader depuis l\'appareil'}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Supprimer
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {/* Prévisualisation */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={() => {
                setError('Impossible de charger l\'image')
                setPreview(null)
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              </div>
            )}
          </div>
          {value && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700 font-semibold">
                {value.startsWith('/uploads/') || (typeof window !== 'undefined' && value.startsWith(window.location.origin))
                  ? '✅ Image uploadée avec succès !' 
                  : value.startsWith('http')
                    ? '✅ URL externe configurée'
                    : '✅ Image configurée'}
              </p>
              <p className="text-xs text-gray-500 mt-1 break-all font-mono">
                {value}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

