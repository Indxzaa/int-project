'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'memorycare_theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'dark' || s === 'light') return s
  } catch {}
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => { setThemeState(getInitialTheme()) }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
