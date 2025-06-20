/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTheme as useThemeNext } from 'next-themes'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  isDark: false,
  setTheme: () => null,
  toggleTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const { setTheme: setThemeNext } = useThemeNext()
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = document.documentElement as HTMLElement

    root.classList.remove('light', 'dark')

    root.classList.add(theme)
    localStorage.setItem(storageKey, theme)
    console.log(`Theme set to: ${theme}`)
  }, [theme])

  const contextValue = useMemo(() => {
    return {
      theme,
      isDark: theme === 'dark',
      setTheme: (theme: Theme) => {
        setThemeNext(theme)
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      },
      toggleTheme: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    }
  }, [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
