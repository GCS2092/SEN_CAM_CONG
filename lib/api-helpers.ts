import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { rateLimit, getRateLimitIdentifier } from './rate-limit'

// Helper pour gérer les erreurs de validation
export function handleValidationError(error: ZodError) {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return NextResponse.json(
    {
      error: 'Erreur de validation',
      details: errors,
    },
    { status: 400 }
  )
}

// Helper pour gérer les erreurs serveur
export function handleServerError(error: unknown, message = 'Une erreur est survenue') {
  console.error('Server error:', error)
  
  return NextResponse.json(
    {
      error: message,
    },
    { status: 500 }
  )
}

// Middleware de rate limiting
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options = { windowMs: 15 * 60 * 1000, max: 100 } // 100 requêtes par 15 minutes par défaut
) {
  return async (request: NextRequest, context?: any) => {
    const identifier = getRateLimitIdentifier(request)
    const limit = rateLimit(identifier, options)

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': options.max.toString(),
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': new Date(limit.resetTime).toISOString(),
          },
        }
      )
    }

    const response = await handler(request, context)
    
    // Ajouter les headers de rate limit à la réponse
    response.headers.set('X-RateLimit-Limit', options.max.toString())
    response.headers.set('X-RateLimit-Remaining', limit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(limit.resetTime).toISOString())

    return response
  }
}

