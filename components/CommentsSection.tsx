'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: string
  }
}

interface CommentsSectionProps {
  eventId: string
}

export default function CommentsSection({ eventId }: CommentsSectionProps) {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    loadComments()
  }, [eventId])

  async function loadComments() {
    try {
      const res = await fetch(`/api/events/${eventId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour commenter')
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas être vide')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Vous devez être connecté')
        return
      }

      const res = await fetch(`/api/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout du commentaire')
      }

      const data = await res.json()
      setComments([data.comment, ...comments])
      setNewComment('')
      toast.success('Commentaire ajouté !')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout du commentaire')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Commentaires ({comments.length})</h2>

      {/* Formulaire de commentaire */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-primary self-start disabled:opacity-50"
            >
              {submitting ? 'Envoi...' : 'Commenter'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Vous devez être connecté pour commenter</p>
          <a
            href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Se connecter
          </a>
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun commentaire pour le moment</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card p-4">
              <div className="flex gap-4">
                {comment.user.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={comment.user.avatar}
                      alt={comment.user.name || comment.user.email}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold">
                      {(comment.user.name || comment.user.email)[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {comment.user.name || comment.user.email}
                    </span>
                    {comment.user.role === 'ADMIN' && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                    {comment.user.role === 'ARTIST' && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Artiste
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

