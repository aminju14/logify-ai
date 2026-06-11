'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme: Theme
  toggleTheme: () => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  if (!mounted) return <div className="dark">{children}</div>

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
