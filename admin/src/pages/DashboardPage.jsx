import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { adminRoutes } from '../routes/adminRoutes'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

import { adminGetProjects } from '../api/projects'
import { adminGetSkills } from '../api/skills'
import { adminGetServices } from '../api/services'
import { adminGetCertificates } from '../api/certificates'
import { adminGetExperiences } from '../api/experiences'
import { adminGetEducations } from '../api/educations'
import { adminGetContacts } from '../api/contacts'

const STAT_FETCHERS = {
  '/projects': adminGetProjects,
  '/skills': adminGetSkills,
  '/services': adminGetServices,
  '/certificates': adminGetCertificates,
  '/experiences': adminGetExperiences,
  '/educations': adminGetEducations,
  '/contacts': adminGetContacts,
}

const QUICK_CREATE = ['Projects', 'Skills', 'Certificates', 'Experiences']

export default function DashboardPage() {
  const grouped = adminRoutes.filter((r) => r.group !== null)
  const [counts, setCounts] = useState({})
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paths = Object.keys(STAT_FETCHERS)
    Promise.allSettled(paths.map((p) => STAT_FETCHERS[p]()))
      .then((results) => {
        const next = {}
        results.forEach((res, idx) => {
          if (res.status === 'fulfilled') {
            const data = res.value?.data?.data ?? []
            next[paths[idx]] = Array.isArray(data) ? data.length : 0
            if (paths[idx] === '/projects') {
              setRecentProjects(Array.isArray(data) ? data.slice(0, 3) : [])
            }
          } else {
            next[paths[idx]] = null
          }
        })
        setCounts(next)
      })
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your portfolio content from one place.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick create
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_CREATE.map((label) => {
            const route = adminRoutes.find((r) => r.label === label)
            if (!route) return null
            return (
              <Button key={label} asChild variant="outline" size="sm">
                <Link to={`${route.path}/create`}>
                  <Plus className="h-3.5 w-3.5" /> {label}
                </Link>
              </Button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          All modules
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {grouped.map((r) => {
            const Icon = r.icon
            const count = counts[r.path]
            return (
              <Link
                key={r.path}
                to={r.path}
                className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/40 hover:border-accent"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground group-hover:bg-background">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.group}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  {loading ? (
                    <Skeleton className="h-7 w-10" />
                  ) : (
                    <span className="text-2xl font-semibold tracking-tight text-foreground">
                      {r.path === '/hero' ? '—' : (count ?? 0)}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.path === '/hero' ? 'single record' : 'total'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {recentProjects.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent projects
            </h2>
            <Link to="/projects" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40 hover:border-accent"
              >
                {p.thumbnail_path ? (
                  <img
                    src={p.thumbnail_path}
                    alt={p.title}
                    className="h-14 w-14 rounded-lg object-cover bg-muted shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-muted shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-foreground">{p.title}</p>
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
