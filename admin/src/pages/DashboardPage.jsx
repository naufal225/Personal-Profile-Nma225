import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, Folder } from 'lucide-react'
import { toast } from 'sonner'
import { adminRoutes } from '../routes/adminRoutes'

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
              setRecentProjects(Array.isArray(data) ? data.slice(0, 4) : [])
            }
          } else {
            next[paths[idx]] = null
          }
        })
        setCounts(next)
      })
      .catch(() => toast.error('Gagal memuat statistik'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Kelola seluruh konten portfolio Anda dari satu tempat.</p>
        </div>
        <div className="page-actions">
          <Link to="/projects/create" className="btn btn-primary"><Plus /> Proyek Baru</Link>
        </div>
      </div>

      <div className="stat-grid">
        {grouped.map((r) => {
          const Icon = r.icon
          const count = counts[r.path]
          return (
            <Link key={r.path} to={r.path} className="stat-card card">
              <div className="stat-top">
                <span className="stat-ic"><Icon /></span>
              </div>
              <div className="stat-k">{loading ? '…' : (count ?? 0)}</div>
              <div className="stat-l">{r.label}</div>
            </Link>
          )
        })}
      </div>

      <div className="dash-cols">
        <div className="card">
          <div className="section-card-head">
            <h3>Proyek terbaru</h3>
            <Link to="/projects">Lihat semua</Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="empty" style={{ padding: '40px 24px' }}>
              <p>Belum ada proyek.</p>
            </div>
          ) : (
            recentProjects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}/edit`} className="activity">
                <span className="activity-ic">
                  {p.thumbnail_path ? <img src={p.thumbnail_path} alt={p.title} /> : <Folder />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="t" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  {p.description && (
                    <div className="m" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>{p.description}</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-card-head">
            <h3>Aksi cepat</h3>
          </div>
          <div className="quick-links">
            {QUICK_CREATE.map((label) => {
              const route = adminRoutes.find((r) => r.label === label)
              if (!route) return null
              return (
                <Link key={label} to={`${route.path}/create`} className="quick-link">
                  <Plus />
                  <span className="t">Tambah {label}</span>
                  <ArrowRight className="arrow" size={16} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
