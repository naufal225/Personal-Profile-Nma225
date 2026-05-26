import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

export default function SidebarItem({ to, icon: Icon, label, onClick }) {
  const { pathname } = useLocation()
  const isDashboard = to === '/dashboard'
  const active = isDashboard
    ? pathname === '/dashboard' || pathname === '/'
    : pathname === to || pathname.startsWith(to + '/')

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="truncate">{label}</span>
    </NavLink>
  )
}
