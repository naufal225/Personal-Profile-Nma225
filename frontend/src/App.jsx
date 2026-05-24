import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useThemeStore from './store/themeStore'

import HomePage from './pages/public/HomePage'

export default function App() {
  useEffect(() => {
    const apply = (theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    apply(useThemeStore.getState().theme)
    return useThemeStore.subscribe((state) => apply(state.theme))
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
