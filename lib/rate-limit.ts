// Simple in-memory rate limiter (pour production, utiliser Redis)
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  windowMs: number // Fenêtre de temps en millisecondes
  max: number // Nombre maximum de requêtes
}

export function rateLimit(identifier: string, options: RateLimitOptions): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const record = store[key]

  // Nettoyer les anciennes entrées
  if (record && record.resetTime < now) {
    delete store[key]
  }

  const current = store[key]

  if (!current) {
    // Première requête
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    }
    return {
      allowed: true,
      remaining: options.max - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (current.count >= options.max) {
    // Limite atteinte
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    }
  }

  // Incrémenter le compteur
  current.count++
  return {
    allowed: true,
    remaining: options.max - current.count,
    resetTime: current.resetTime,
  }
}

// Helper pour obtenir l'identifiant depuis une requête
export function getRateLimitIdentifier(request: Request): string {
  // Sur Vercel, utiliser l'IP réelle depuis les headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
  
  // Pour le login, on peut aussi utiliser l'email si disponible dans le body
  // Mais pour l'instant, on garde l'IP pour la simplicité
  return `login:${ip}`
}

