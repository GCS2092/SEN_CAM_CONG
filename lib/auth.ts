import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from './prisma'
import { getSupabaseAuthUser } from './supabase/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export interface UserPayload {
  id: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(token: string | null) {
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
    },
  })

  return user
}

export type GetSupabaseUserResult =
  | { user: { id: string; email: string; name: string | null; role: string; avatar: string | null }; error?: never }
  | { user: null; error: string }

/** Utilisateur app (table users) depuis un JWT Supabase. Crée le profil au premier login si besoin. */
export async function getCurrentUserFromSupabaseToken(
  accessToken: string | null
): Promise<GetSupabaseUserResult> {
  if (!accessToken) {
    return { user: null, error: 'SUPABASE: Token manquant' }
  }

  let authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }
  try {
    const { user, error } = await getSupabaseAuthUser(accessToken)
    if (error || !user) {
      const msg = error?.message || 'Utilisateur Auth non trouvé'
      console.error('[getCurrentUserFromSupabaseToken] Supabase auth:', msg)
      return { user: null, error: `SUPABASE: ${msg}` }
    }
    if (!user.email) {
      console.error('[getCurrentUserFromSupabaseToken] No email, Auth ID:', user.id)
      return { user: null, error: 'SUPABASE: Email manquant sur le compte' }
    }
    authUser = user
    console.log('[getCurrentUserFromSupabaseToken] Auth OK:', authUser.email, 'ID:', authUser.id)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue'
    console.error('[getCurrentUserFromSupabaseToken] Supabase exception:', msg)
    return { user: null, error: `SUPABASE: ${msg}` }
  }

  type UserRow = { id: string; email: string; name: string | null; role: string; avatar: string | null }
  try {
    // 1) Cherche par id = auth.users.id (requêtes brutes pour éviter le bug Prisma "colonne")
    const byId = await prisma.$queryRaw<UserRow[]>(
      Prisma.sql`SELECT id, email, name, role, avatar FROM users WHERE id = ${authUser.id} LIMIT 1`
    )
    let appUser: UserRow | null = byId[0] ?? null
    if (appUser) {
      console.log('[getCurrentUserFromSupabaseToken] Trouvé par id (auth):', appUser.email)
      return { user: { ...appUser, role: appUser.role } }
    }

    // 2) Anciens comptes : chercher par supabaseAuthId
    const bySupabaseId = await prisma.$queryRaw<UserRow[]>(
      Prisma.sql`SELECT id, email, name, role, avatar FROM users WHERE "supabaseAuthId" = ${authUser.id} LIMIT 1`
    )
    appUser = bySupabaseId[0] ?? null
    if (appUser) {
      console.log('[getCurrentUserFromSupabaseToken] Trouvé par supabaseAuthId:', appUser.email)
      return { user: { ...appUser, role: appUser.role } }
    }

    const email = authUser.email!.toLowerCase().trim()
    // 3) Lien par email (compte existant en base sans lien Auth) — requête brute pour éviter le bug Prisma "colonne" avec mode: 'insensitive'
    const byEmail = await prisma.$queryRaw<UserRow[]>(
      Prisma.sql`SELECT id, email, name, role, avatar FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1`
    )
    const existingByEmail = byEmail[0] ?? null
    if (existingByEmail) {
      console.log('[getCurrentUserFromSupabaseToken] Liaison par email:', existingByEmail.email)
      const updated = await prisma.$queryRaw<UserRow[]>(
        Prisma.sql`UPDATE users SET "supabaseAuthId" = ${authUser.id}, "updatedAt" = NOW() WHERE id = ${existingByEmail.id} RETURNING id, email, name, role, avatar`
      )
      appUser = updated[0] ?? existingByEmail
      return { user: { ...appUser, role: appUser.role } }
    }

    // 4) Création (trigger n'a pas tourné ou compte créé avant le trigger) : id = auth.id pour rester aligné
    console.log('[getCurrentUserFromSupabaseToken] Création nouvel utilisateur:', email)
    const name = (authUser.user_metadata?.name as string) ?? (authUser.user_metadata?.full_name as string) ?? null
    const created = await prisma.$queryRaw<UserRow[]>(
      Prisma.sql`INSERT INTO users (id, email, name, role, "createdAt", "updatedAt") VALUES (${authUser.id}, ${email}, ${name}, 'USER', NOW(), NOW()) RETURNING id, email, name, role, avatar`
    )
    appUser = created[0]!
    return { user: { ...appUser, role: appUser.role } }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[getCurrentUserFromSupabaseToken] Erreur base de données:', msg)
    return { user: null, error: `BASE_DE_DONNÉES: ${msg}` }
  }
}

/**
 * Vérifie le token (Supabase en priorité, puis JWT legacy) et retourne le payload pour les API.
 * À utiliser dans les routes API à la place de verifyToken().
 */
export async function verifyTokenOrSupabase(token: string | null): Promise<UserPayload | null> {
  if (!token) return null

  const result = await getCurrentUserFromSupabaseToken(token)
  if (result.user) {
    return { id: result.user.id, email: result.user.email, role: result.user.role }
  }

  return verifyToken(token)
}

/** Utilisateur complet : Supabase en priorité, sinon JWT legacy. */
export async function getCurrentUserOrSupabase(
  token: string | null
): Promise<{ id: string; email: string; name: string | null; role: string; avatar: string | null } | null> {
  if (!token) return null
  const result = await getCurrentUserFromSupabaseToken(token)
  if (result.user) return result.user
  return getCurrentUser(token)
}
