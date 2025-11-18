import { z } from 'zod'

// Validation des URLs - accepte les URLs complètes (http/https) et les chemins relatifs (/uploads/...)
const urlSchema = z.string().refine(
  (val) => {
    if (!val || val === '') return true // Vide est accepté
    // Accepter les URLs complètes (http/https)
    if (val.startsWith('http://') || val.startsWith('https://')) {
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }
    // Accepter les chemins relatifs qui commencent par /
    if (val.startsWith('/')) {
      return true
    }
    return false
  },
  { message: 'URL invalide. Utilisez une URL complète (http://...) ou un chemin relatif (/uploads/...)' }
).or(z.literal(''))

// Schéma de validation pour les événements
export const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().max(5000, 'La description est trop longue').optional().nullable(),
  date: z.string().datetime('Date invalide'),
  location: z.string().min(1, 'Le lieu est requis').max(200, 'Le lieu est trop long'),
  venue: z.string().max(200, 'Le nom de la salle est trop long').optional().nullable(),
  imageUrl: urlSchema.optional().nullable(),
  externalUrl: urlSchema.optional().nullable(),
  ticketPrice: z.number().min(0, 'Le prix doit être positif').optional().nullable(),
  status: z.enum(['UPCOMING', 'PAST', 'CANCELLED']).optional(),
  userId: z.string().min(1, 'ID utilisateur requis'),
})

export const eventUpdateSchema = eventSchema.partial().extend({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long').optional(),
  date: z.string().datetime('Date invalide').optional(),
  location: z.string().min(1, 'Le lieu est requis').max(200, 'Le lieu est trop long').optional(),
})

// Schéma de validation pour les performances
export const performanceSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().max(5000, 'La description est trop longue').optional().nullable(),
  date: z.string().datetime('Date invalide'),
  location: z.string().max(200, 'Le lieu est trop long').optional().nullable(),
  videoUrl: urlSchema.optional().nullable(),
  imageUrl: urlSchema.optional().nullable(),
  eventId: z.string().optional().nullable(),
  userId: z.string().min(1, 'ID utilisateur requis'),
})

export const performanceUpdateSchema = performanceSchema.partial().extend({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long').optional(),
  date: z.string().datetime('Date invalide').optional(),
})

// Schéma de validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().max(100, 'Le nom est trop long').optional(),
})

// Schéma de validation pour les liens sociaux
export const socialLinkSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(50, 'Le nom est trop long'),
  url: z.string().url('URL invalide'),
  icon: z.string().max(50, 'Le nom de l\'icône est trop long').optional().nullable(),
  description: z.string().max(200, 'La description est trop longue').optional().nullable(),
  order: z.number().int().min(0, 'L\'ordre doit être positif').default(0),
  active: z.boolean().default(true),
})

export const socialLinkUpdateSchema = socialLinkSchema.partial()

// Schéma de validation pour les médias
export const mediaSchema = z.object({
  type: z.enum(['VIDEO', 'IMAGE', 'AUDIO']),
  url: z.string().url('URL invalide'),
  thumbnailUrl: urlSchema.optional().nullable(),
  title: z.string().max(200, 'Le titre est trop long').optional().nullable(),
  description: z.string().max(1000, 'La description est trop longue').optional().nullable(),
  performanceId: z.string().optional().nullable(),
})

// Schéma de validation pour les commentaires
export const commentSchema = z.object({
  content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(1000, 'Le commentaire est trop long'),
  eventId: z.string().optional().nullable(),
  userId: z.string().min(1, 'ID utilisateur requis'),
})

// Schéma de validation pour les utilisateurs (création par admin)
export const userCreateSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  name: z.string().max(100, 'Le nom est trop long').optional().nullable(),
  role: z.enum(['USER', 'ADMIN', 'ARTIST']).default('USER'),
})

// Schéma de validation pour la mise à jour des utilisateurs
export const userUpdateSchema = z.object({
  email: z.string().email('Email invalide').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  name: z.string().max(100, 'Le nom est trop long').optional().nullable(),
  role: z.enum(['USER', 'ADMIN', 'ARTIST']).optional(),
})

// Fonction helper pour valider avec Zod
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

