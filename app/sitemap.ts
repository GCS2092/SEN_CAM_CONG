import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sec-cam-cong.com'

  // Récupérer les événements et performances
  const [events, performances] = await Promise.all([
    prisma.event.findMany({
      select: { id: true, updatedAt: true },
    }),
    prisma.performance.findMany({
      select: { id: true, updatedAt: true },
    }),
  ])

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

