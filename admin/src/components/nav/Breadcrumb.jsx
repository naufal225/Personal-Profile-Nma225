import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getRouteByPath } from '../../routes/adminRoutes'

const ACTION_LABELS = {
  create: 'Create',
  edit: 'Edit',
}

export default function Breadcrumb() {
  const location = useLocation()
  const route = getRouteByPath(location.pathname)

  if (!route) {
    return <span className="text-sm text-muted-foreground">Admin</span>
  }

  const segments = location.pathname.split('/').filter(Boolean)
  const baseSegment = route.path.replace('/', '')
  const trail = []
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i]
    if (ACTION_LABELS[seg]) {
      trail.push({ label: ACTION_LABELS[seg], to: null })
    } else if (/^\d+$/.test(seg) || /^[0-9a-f-]{8,}$/i.test(seg)) {
      const next = segments[i + 1]
      if (!next) trail.push({ label: 'View', to: null })
    } else {
      trail.push({ label: seg, to: null })
    }
  }

  const isIndex = route.path !== '/dashboard' && segments.length === 1 && segments[0] === baseSegment

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
        Admin
      </Link>
      {route.path !== '/dashboard' && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          {isIndex ? (
            <span className="font-medium text-foreground">{route.label}</span>
          ) : (
            <Link to={route.path} className="text-muted-foreground hover:text-foreground transition-colors">
              {route.label}
            </Link>
          )}
          {trail.map((t, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className={idx === trail.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                {t.label}
              </span>
            </span>
          ))}
        </>
      )}
    </nav>
  )
}
