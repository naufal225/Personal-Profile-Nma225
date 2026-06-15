import { useEffect, useRef, useState } from 'react'
import { adminGetProjects } from '../api/projects'
import { adminGetSkills } from '../api/skills'
import { adminGetServices } from '../api/services'
import { adminGetCertificates } from '../api/certificates'
import { adminGetExperiences } from '../api/experiences'
import { adminGetEducations } from '../api/educations'
import { adminGetContacts } from '../api/contacts'

// type -> { label (group), path, fetch, map(row) -> { label, sub } }
const SOURCES = [
  { type: 'projects', group: 'Projects', path: '/projects', fetch: adminGetProjects, map: (r) => ({ label: r.title, sub: r.description }) },
  { type: 'skills', group: 'Skills', path: '/skills', fetch: adminGetSkills, map: (r) => ({ label: r.name, sub: r.category }) },
  { type: 'services', group: 'Services', path: '/services', fetch: adminGetServices, map: (r) => ({ label: r.title, sub: r.description }) },
  { type: 'certificates', group: 'Certificates', path: '/certificates', fetch: adminGetCertificates, map: (r) => ({ label: r.title, sub: r.issuer }) },
  { type: 'experiences', group: 'Experiences', path: '/experiences', fetch: adminGetExperiences, map: (r) => ({ label: r.title, sub: r.organization }) },
  { type: 'educations', group: 'Educations', path: '/educations', fetch: adminGetEducations, map: (r) => ({ label: r.institution, sub: r.major }) },
  { type: 'contacts', group: 'Contacts', path: '/contacts', fetch: adminGetContacts, map: (r) => ({ label: r.label, sub: r.value }) },
]

// Builds a flat search index the first time `enabled` becomes true, then caches it.
export function useGlobalSearch(enabled) {
  const [index, setIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!enabled || loadedRef.current) return
    loadedRef.current = true
    setLoading(true)
    Promise.allSettled(SOURCES.map((s) => s.fetch()))
      .then((results) => {
        const items = []
        results.forEach((res, i) => {
          if (res.status !== 'fulfilled') return
          const src = SOURCES[i]
          const rows = res.value?.data?.data ?? []
          for (const row of rows) {
            const { label, sub } = src.map(row)
            items.push({
              id: `${src.type}-${row.id}`,
              type: src.type,
              group: src.group,
              label: label || '(untitled)',
              sub: sub || '',
              to: `${src.path}/${row.id}/edit`,
            })
          }
        })
        setIndex(items)
      })
      .finally(() => setLoading(false))
  }, [enabled])

  return { index, loading }
}
