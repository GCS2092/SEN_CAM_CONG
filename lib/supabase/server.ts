import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/**
 * Client Supabase pour le serveur (API routes).
 * Retourne null si les variables d'environnement Supabase ne sont pas définies.
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Vérifie le JWT Supabase et retourne l'utilisateur Auth (auth.users).
 * À utiliser dans les API routes avec le token du header Authorization.
 */
export async function getSupabaseAuthUser(accessToken: string | null) {
  if (!accessToken) {
    console.error('[getSupabaseAuthUser] No access token provided')
    return { user: null, error: new Error('No token') }
  }
  
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    console.error('[getSupabaseAuthUser] Supabase not configured. URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing', 'Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing')
    return { user: null, error: new Error('Supabase not configured') }
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error) {
    console.error('[getSupabaseAuthUser] Supabase auth error:', error.message)
    return { user: null, error }
  }
  
  if (!user) {
    console.error('[getSupabaseAuthUser] No user returned from Supabase')
    return { user: null, error: new Error('No user found') }
  }
  
  console.log('[getSupabaseAuthUser] Success:', user.id, user.email)
  return { user, error: null }
}
