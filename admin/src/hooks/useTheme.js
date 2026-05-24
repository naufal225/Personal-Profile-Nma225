import useThemeStore from '../store/themeStore'

export function useTheme() {
  const { theme, setTheme } = useThemeStore()
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  return { theme, resolvedTheme: resolved, setTheme }
}
