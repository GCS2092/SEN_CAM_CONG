import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sec-cam-cong.com'

  // Récupérer les événements et performances (avec gestion d'erreur si DB non disponible)
  let events: { id: string; updatedAt: Date }[] = []
  let performances: { id: string; updatedAt: Date }[] = []

  try {
    if (process.env.DATABASE_URL) {
      const results = await Promise.all([
        prisma.event.findMany({
          select: { id: true, updatedAt: true },
        }),
        prisma.performance.findMany({
          select: { id: true, updatedAt: true },
        }),
      ])
      events = results[0]
      performances = results[1]
    }
  } catch (error) {
    // Si la connexion DB échoue (par exemple pendant le build), on continue avec un sitemap de base
    console.warn('Could not fetch events/performances for sitemap:', error)
  }

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/performances`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const performanceRoutes = performances.map((performance) => ({
    url: `${baseUrl}/performances/${performance.id}`,
    lastModified: performance.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...eventRoutes, ...performanceRoutes]
}

