'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const resetSuccess = searchParams?.get('reset') === 'ok'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || undefined } },
        })
        if (signUpError) {
          setError(signUpError.message === 'User already registered' ? 'Cet email est déjà utilisé. Connectez-vous.' : signUpError.message)
          return
        }
        if (!authData.session) {
          setError('Inscription réussie. Vérifiez votre email pour confirmer le compte (ou désactivez la confirmation dans Supabase).')
          return
        }
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(signInError.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : signInError.message)
          return
        }
        if (!authData.session?.access_token) {
          setError('Session invalide. Réessayez.')
          return
        }
      }

      const session = (await supabase.auth.getSession()).data.session
      if (!session?.access_token) {
        setError('Impossible de récupérer la session.')
        return
      }

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session.access_token }),
      })
      const data = await res.json()

      if (!res.ok || !data.authenticated || !data.user) {
        setError(data.error || 'Vérification échouée')
        return
      }

      const { saveAuth } = await import('@/lib/auth-persistence')
      saveAuth(session.access_token, data.user)
      window.dispatchEvent(new Event('auth-change'))

      const redirect = searchParams?.get('redirect')
      if (redirect) {
        router.push(redirect)
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (data.user.role === 'ARTIST') {
        router.push('/artist/dashboard')
      } else if (data.user.role === 'USER') {
        router.push('/user/dashboard')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister ? (
              <>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                Pas de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {resetSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
              Mot de passe réinitialisé. Connectez-vous avec votre nouveau mot de passe.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Nom (optionnel)"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  isRegister ? '' : 'rounded-t-md'
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
            </button>
          </div>
          {!isRegister && (
            <div className="text-center">
              <Link
                href="/login/forgot-password"
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </form>
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
