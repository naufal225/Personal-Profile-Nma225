import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Sun, Moon, ChevronRight } from 'lucide-react'
import { getRouteByPath } from '../../routes/adminRoutes'
import { useTheme } from '../../hooks/useTheme'

const ACTION_LABELS = { create: 'Create', edit: 'Edit' }

function Crumb() {
  const { pathname } = useLocation()
  const route = getRouteByPath(pathname)
  const segments = pathname.split('/').filter(Boolean)
  const tail = []
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i]
    if (ACTION_LABELS[seg]) tail.push(ACTION_LABELS[seg])
    else if (/^\d+$/.test(seg)) { if (!segments[i + 1]) tail.push('View') }
  }

  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link to="/dashboard">Admin</Link>
      {route && route.path !== '/dashboard' && (
        <>
          <ChevronRight className="sep" />
          {tail.length === 0 ? (
            <span className="cur">{route.label}</span>
          ) : (
            <Link to={route.path}>{route.label}</Link>
          )}
          {tail.map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ChevronRight className="sep" />
              <span className={i === tail.length - 1 ? 'cur' : ''}>{t}</span>
            </span>
          ))}
        </>
      )}
      {route && route.path === '/dashboard' && (
        <>
          <ChevronRight className="sep" />
          <span className="cur">Dashboard</span>
        </>
      )}
    </nav>
  )
}

export default function TopBar({ onMenuClick, onSearchClick }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="topbar">
      <button className="icon-btn sb-toggle" onClick={onMenuClick} aria-label="Open menu">
        <Menu />
      </button>

      <Crumb />

      <div className="topbar-spacer" />

      <button className="search" onClick={onSearchClick} aria-label="Open search" style={{ cursor: 'pointer' }}>
        <Search />
        <span className="ph">Cari konten…</span>
        <kbd>⌘K</kbd>
      </button>

      <button
        className="icon-btn"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
    </header>
  )
}
