// Gestion de la persistance de l'authentification
// Utilise localStorage avec vérification automatique de validité

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const TOKEN_EXPIRY_KEY = 'token_expiry'

// Durée de validité du token (7 jours)
const TOKEN_EXPIRY_DAYS = 7

export interface StoredUser {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
}

/**
 * Sauvegarde le token et les informations utilisateur
 */
export function saveAuth(token: string, user: StoredUser) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    
    // Calculer la date d'expiration
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString())
    
    return true
  } catch (error) {
    console.error('Error saving auth:', error)
    return false
  }
}

/**
 * Récupère le token stocké
 */
export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null
    
    // Vérifier si le token a expiré
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (expiry) {
      const expiryDate = new Date(expiry)
      if (new Date() > expiryDate) {
        // Token expiré, nettoyer
        clearAuth()
        return null
      }
    }
    
    return token
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

/**
 * Récupère les informations utilisateur stockées
 */
export function getStoredUser(): StoredUser | null {
  try {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    
    return JSON.parse(userStr) as StoredUser
  } catch (error) {
    console.error('Error getting stored user:', error)
    return null
  }
}

/**
 * Vérifie si l'utilisateur est authentifié (token valide)
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  
  try {
    // Vérifier la structure du token JWT
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // Décoder le payload
    const payload = JSON.parse(atob(parts[1]))
    
    // Vérifier l'expiration du token (si présente)
    if (payload.exp) {
      const expiryDate = new Date(payload.exp * 1000)
      if (new Date() > expiryDate) {
        clearAuth()
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Error verifying token:', error)
    clearAuth()
    return false
  }
}

/**
 * Récupère le rôle de l'utilisateur depuis le token
 */
export function getUserRole(): string | null {
  try {
    const token = getToken()
    if (!token) return null
    
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload.role || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Nettoie toutes les données d'authentification
 */
export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  } catch (error) {
    console.error('Error clearing auth:', error)
  }
}

/**
 * Vérifie et rafraîchit l'authentification si nécessaire
 */
export async function verifyAndRefreshAuth(): Promise<{
  authenticated: boolean
  user: StoredUser | null
}> {
  const token = getToken()
  if (!token) {
    return { authenticated: false, user: null }
  }
  
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    
    const data = await res.json()
    
    if (res.ok && data.authenticated && data.user) {
      // Mettre à jour les données stockées
      saveAuth(token, data.user)
      return { authenticated: true, user: data.user }
    } else {
      // Token invalide, nettoyer
      clearAuth()
      return { authenticated: false, user: null }
    }
  } catch (error) {
    console.error('Error verifying auth:', error)
    clearAuth()
    return { authenticated: false, user: null }
  }
}

