import { useState, useEffect } from 'react'
import Sidebar from '../components/nav/Sidebar'
import TopBar from '../components/nav/TopBar'
import CommandPalette from '../components/CommandPalette'

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <div className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className={`sb-scrim${mobileOpen ? ' show' : ''}`} onClick={() => setMobileOpen(false)} />

      <div className="main">
        <TopBar onMenuClick={() => setMobileOpen(true)} onSearchClick={() => setPaletteOpen(true)} />
        <div className="content">{children}</div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
