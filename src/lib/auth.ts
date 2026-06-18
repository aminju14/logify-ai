import { isSupabaseConfigured, getClient } from '@/lib/repository/supabase'

// Minimal user shape the UI needs — backend-agnostic.
export interface AuthUser {
  id: string
  email: string | null
}

export interface AuthResult {
  error: string | null
}

/** Whether auth is active. False in localStorage mode (no accounts). */
export const authEnabled = isSupabaseConfigured()

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await getClient().auth.signInWithPassword({ email, password })
  return { error: error?.message ?? null }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const { error } = await getClient().auth.signUp({ email, password })
  return { error: error?.message ?? null }
}

export async function signOut(): Promise<void> {
  if (!authEnabled) return
  await getClient().auth.signOut()
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!authEnabled) return null
  const { data } = await getClient().auth.getUser()
  if (!data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 * In localStorage mode this is a no-op (no auth events ever fire).
 */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  if (!authEnabled) return () => {}
  const { data } = getClient().auth.onAuthStateChange((_event, session) => {
    cb(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null)
  })
  return () => data.subscription.unsubscribe()
}
