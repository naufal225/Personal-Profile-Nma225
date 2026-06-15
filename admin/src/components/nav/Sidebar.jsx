import { Link, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { adminRoutes, adminGroups } from '../../routes/adminRoutes'
import { useAuth } from '../../hooks/useAuth'

function initials(name) {
  if (!name) return 'A'
  return name.split(' ').map((s) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function isActive(pathname, to) {
  if (to === '/dashboard') return pathname === '/dashboard' || pathname === '/'
  return pathname === to || pathname.startsWith(to + '/')
}

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const ungrouped = adminRoutes.filter((r) => r.group === null)
  const display = user?.name || user?.email || 'Admin'

  const renderLink = (r) => {
    const Icon = r.icon
    return (
      <Link
        key={r.path}
        to={r.path}
        onClick={onNavigate}
        className={`sb-link${isActive(pathname, r.path) ? ' active' : ''}`}
      >
        <Icon />
        <span>{r.label}</span>
      </Link>
    )
  }

  return (
    <aside className="sidebar-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sb-brand">
        <span className="sb-mark">N</span>
        <div>
          <div className="t">Naufal CMS</div>
          <div className="s">Portfolio Admin</div>
        </div>
      </div>

      <nav className="sb-nav">
        <div className="sb-group">
          {ungrouped.map(renderLink)}
        </div>

        {adminGroups.map((group) => {
          const items = adminRoutes.filter((r) => r.group === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="sb-group">
              <div className="sb-group-label">{group}</div>
              {items.map(renderLink)}
            </div>
          )
        })}
      </nav>

      <div className="sb-foot">
        <button className="sb-user" onClick={logout} title="Logout">
          <span className="sb-ava">{initials(display)}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="n" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</div>
            {user?.email && <div className="e" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
          </div>
          <LogOut />
        </button>
      </div>
    </aside>
  )
}
