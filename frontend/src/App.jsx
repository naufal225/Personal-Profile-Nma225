import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useThemeStore from './store/themeStore'

import HomePage from './pages/public/HomePage'

export default function App() {
  useEffect(() => {
    const apply = (theme) => {
      document.documentElement.setAttribute('data-theme', theme)
    }
    apply(useThemeStore.getState().theme)
    const unsub = useThemeStore.subscribe((state) => apply(state.theme))

    // Enable hero entrance + scroll animations (no-JS / reduced-motion still show content)
    document.documentElement.classList.add('anim')

    return unsub
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
