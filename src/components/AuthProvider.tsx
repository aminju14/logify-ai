'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  authEnabled,
  getCurrentUser,
  onAuthChange,
  signOut as doSignOut,
  type AuthUser,
} from '@/lib/auth'

interface AuthContextValue {
  user: AuthUser | null
  /** Still resolving the initial session. */
  loading: boolean
  /** Whether auth is active (Supabase configured). */
  enabled: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  enabled: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(authEnabled)

  useEffect(() => {
    if (!authEnabled) {
      setLoading(false)
      return
    }
    let active = true
    getCurrentUser().then((u) => {
      if (active) {
        setUser(u)
        setLoading(false)
      }
    })
    const unsub = onAuthChange((u) => setUser(u))
    return () => {
      active = false
      unsub()
    }
  }, [])

  const signOut = async () => {
    await doSignOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, enabled: authEnabled, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
