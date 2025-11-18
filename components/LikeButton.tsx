'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { HeartIcon } from './Icons'

interface LikeButtonProps {
  eventId: string
  initialLiked?: boolean
  initialCount?: number
}

export default function LikeButton({ eventId, initialLiked = false, initialCount = 0 }: LikeButtonProps) {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      checkLike()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, eventId])

  async function checkLike() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch(`/api/events/${eventId}/likes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
      }
    } catch (error) {
      console.error('Error checking like:', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour aimer un événement')
      // Rediriger vers la page de connexion avec redirection
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Vous devez être connecté')
        return
      }

      const res = await fetch(`/api/events/${eventId}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout du like')
      }

      const data = await res.json()
      setLiked(data.liked)
      setCount(prev => data.liked ? prev + 1 : prev - 1)
      
      if (data.liked) {
        toast.success('Événement aimé !')
      } else {
        toast.success('Like retiré')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout du like')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 text-gray-500 cursor-not-allowed"
      >
        <HeartIcon className="w-5 h-5" />
        <span>{count}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <HeartIcon className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span className="font-semibold">{count}</span>
    </button>
  )
}

