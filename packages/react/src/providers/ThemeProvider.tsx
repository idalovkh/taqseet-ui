import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  /** Current theme setting (can be 'system') */
  theme: ThemeMode
  /** Resolved theme (always 'light' or 'dark') */
  resolvedTheme: ResolvedTheme
  /** Set theme manually */
  setTheme: (theme: ThemeMode) => void
  /** Toggle between light and dark */
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'app-theme'

/**
 * Get system color scheme preference
 */
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Resolve theme mode to actual theme
 */
const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  return mode === 'system' ? getSystemTheme() : mode
}

/**
 * Apply theme to document
 */
const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  
  // Also update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute(
      'content',
      theme === 'dark' ? '#0d0d0d' : '#ffffff'
    )
  }
}

interface ThemeProviderProps {
  children: ReactNode
  /** Default theme if none is saved */
  defaultTheme?: ThemeMode
  /** Storage key override */
  storageKey?: string
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  storageKey = THEME_STORAGE_KEY 
}: ThemeProviderProps) => {
  // Initialize theme from localStorage or default
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultTheme
    
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved as ThemeMode
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => 
    resolveTheme(theme)
  )

  // Apply theme on mount and when it changes
  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [theme])

  // Listen to system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setResolvedTheme(newTheme)
      applyTheme(newTheme)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
    
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [storageKey])

  const toggleTheme = useCallback(() => {
    // Only toggle between light and dark (ignore system)
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

