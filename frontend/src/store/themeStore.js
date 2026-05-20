import { create } from 'zustand'

const STORAGE_KEY = 'portfolio_theme'

function resolveInitial() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const useThemeStore = create((set, get) => ({
  theme: resolveInitial(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    set({ theme: next })
  },
}))

// Respond to real-time OS theme changes (only when user hasn't manually overridden)
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      useThemeStore.getState().setTheme(e.matches ? 'light' : 'dark')
    }
  })
}

export default useThemeStore
