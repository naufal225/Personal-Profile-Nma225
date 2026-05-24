import { create } from 'zustand'

const STORAGE_KEY = 'portfolio_admin_theme'

function resolveInitial() {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

const useThemeStore = create((set) => ({
  theme: resolveInitial(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },
}))

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') {
      useThemeStore.setState((state) => ({ theme: state.theme }))
    }
  })
}

export default useThemeStore
