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

/** Utilisateur app (table users) depuis un JWT Supabase. Crée le profil au premier login si besoin. */
export async function getCurrentUserFromSupabaseToken(
  accessToken: string | null
): Promise<{ id: string; email: string; name: string | null; role: string; avatar: string | null } | null> {
  if (!accessToken) return null
  
  try {
    const { user: authUser, error } = await getSupabaseAuthUser(accessToken)
    if (error || !authUser) {
      console.error('[getCurrentUserFromSupabaseToken] Supabase auth error:', error?.message || 'No auth user')
      return null
    }

    if (!authUser.email) {
      console.error('[getCurrentUserFromSupabaseToken] No email in auth user. User ID:', authUser.id)
      return null
    }
    
    console.log('[getCurrentUserFromSupabaseToken] Auth user found:', authUser.email, 'ID:', authUser.id)

    // Cherche d'abord par supabaseAuthId
    let appUser = await prisma.user.findUnique({
      where: { supabaseAuthId: authUser.id },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    })
    
    console.log('[getCurrentUserFromSupabaseToken] User found by supabaseAuthId:', appUser ? appUser.email : 'none')

    if (!appUser) {
      // Cherche par email (insensible à la casse)
      const email = authUser.email.toLowerCase().trim()
      console.log('[getCurrentUserFromSupabaseToken] Searching by email:', email)
      
      const existingByEmail = await prisma.user.findFirst({
        where: { 
          email: { equals: email, mode: 'insensitive' }
        },
        select: { id: true, email: true, name: true, role: true, avatar: true },
      })
      
      console.log('[getCurrentUserFromSupabaseToken] User found by email:', existingByEmail ? existingByEmail.email : 'none')
      
      if (existingByEmail) {
        // Lie l'utilisateur existant à Supabase Auth
        console.log('[getCurrentUserFromSupabaseToken] Linking existing user to Supabase Auth')
        appUser = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { supabaseAuthId: authUser.id },
          select: { id: true, email: true, name: true, role: true, avatar: true },
        })
      } else {
        // Crée un nouvel utilisateur
        console.log('[getCurrentUserFromSupabaseToken] Creating new user')
        appUser = await prisma.user.create({
          data: {
            supabaseAuthId: authUser.id,
            email: email,
            name: (authUser.user_metadata?.name as string) ?? authUser.user_metadata?.full_name ?? null,
            role: 'USER',
          },
          select: { id: true, email: true, name: true, role: true, avatar: true },
        })
      }
    }
    
    console.log('[getCurrentUserFromSupabaseToken] Final user:', appUser.email, 'Role:', appUser.role)

    return {
      ...appUser,
      role: appUser.role,
    }
  } catch (error) {
    console.error('[getCurrentUserFromSupabaseToken] Error:', error)
    return null
  }
}

/**
 * Vérifie le token (Supabase en priorité, puis JWT legacy) et retourne le payload pour les API.
 * À utiliser dans les routes API à la place de verifyToken().
 */
export async function verifyTokenOrSupabase(token: string | null): Promise<UserPayload | null> {
  if (!token) return null

  const supabaseUser = await getCurrentUserFromSupabaseToken(token)
  if (supabaseUser) {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: supabaseUser.role,
    }
  }

  return verifyToken(token)
}

/** Utilisateur complet : Supabase en priorité, sinon JWT legacy. */
export async function getCurrentUserOrSupabase(
  token: string | null
): Promise<{ id: string; email: string; name: string | null; role: string; avatar: string | null } | null> {
  if (!token) return null
  const fromSupabase = await getCurrentUserFromSupabaseToken(token)
  if (fromSupabase) return fromSupabase
  return getCurrentUser(token)
}
