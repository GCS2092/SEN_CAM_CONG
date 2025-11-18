import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ne créer le client Prisma que si DATABASE_URL est défini
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // Retourner un proxy qui throw une erreur si on essaie d'utiliser Prisma sans DATABASE_URL
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not defined. Cannot use Prisma client.')
      },
    })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

