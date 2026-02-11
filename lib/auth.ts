import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
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

  try {
    // 1) Cherche par supabaseAuthId
    let appUser = await prisma.user.findUnique({
      where: { supabaseAuthId: authUser.id },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    })
    if (appUser) {
      console.log('[getCurrentUserFromSupabaseToken] Trouvé par supabaseAuthId:', appUser.email)
      return { user: { ...appUser, role: appUser.role } }
    }

    const email = authUser.email!.toLowerCase().trim()
    // 2) Cherche par email (insensible à la casse)
    const existingByEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    })
    if (existingByEmail) {
      console.log('[getCurrentUserFromSupabaseToken] Liaison par email:', existingByEmail.email)
      appUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { supabaseAuthId: authUser.id },
        select: { id: true, email: true, name: true, role: true, avatar: true },
      })
      return { user: { ...appUser, role: appUser.role } }
    }

    // 3) Crée un nouvel utilisateur (présent dans Auth mais pas dans table users)
    console.log('[getCurrentUserFromSupabaseToken] Création nouvel utilisateur:', email)
    appUser = await prisma.user.create({
      data: {
        supabaseAuthId: authUser.id,
        email,
        name: (authUser.user_metadata?.name as string) ?? (authUser.user_metadata?.full_name as string) ?? null,
        role: 'USER',
      },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    })
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
