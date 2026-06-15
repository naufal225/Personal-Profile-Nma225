import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Code2, Folder, Wrench, Award, Briefcase, GraduationCap, Mail } from 'lucide-react'
import { useGlobalSearch } from '../hooks/useGlobalSearch'

const TYPE_ICON = {
  projects: Folder,
  skills: Code2,
  services: Wrench,
  certificates: Award,
  experiences: Briefcase,
  educations: GraduationCap,
  contacts: Mail,
}

const GROUP_ORDER = ['projects', 'skills', 'services', 'certificates', 'experiences', 'educations', 'contacts']

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const { index, loading } = useGlobalSearch(open)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // focus after the element mounts
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [open])

  const results = useMemo(() => {
    const items = index ?? []
    const q = query.trim().toLowerCase()
    const filtered = q
      ? items.filter((it) => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q))
      : items
    return filtered.slice(0, 40)
  }, [index, query])

  useEffect(() => {
    setActive(0)
  }, [query])

  // Group results while keeping a flat order for keyboard navigation
  const { groups, flat } = useMemo(() => {
    const byType = {}
    for (const it of results) {
      ;(byType[it.type] ||= []).push(it)
    }
    const orderedGroups = GROUP_ORDER.filter((t) => byType[t]).map((t) => ({
      type: t,
      group: byType[t][0].group,
      items: byType[t],
    }))
    const flatList = orderedGroups.flatMap((g) => g.items)
    return { groups: orderedGroups, flat: flatList }
  }, [results])

  const select = (item) => {
    if (!item) return
    onClose()
    navigate(item.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(flat.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(flat[active])
    }
  }

  // Keep active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  let runningIdx = -1

  return (
    <div className="cmdk-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Global search">
        <div className="cmdk-input-wrap">
          <Search />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Cari proyek, skill, sertifikat, kontak…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="cmdk-esc">ESC</kbd>
        </div>

        <div className="cmdk-list" ref={listRef}>
          {loading && !index ? (
            <div className="cmdk-empty">Memuat data…</div>
          ) : flat.length === 0 ? (
            <div className="cmdk-empty">Tidak ada hasil{query ? ` untuk "${query}"` : ''}.</div>
          ) : (
            groups.map((g) => {
              const Icon = TYPE_ICON[g.type] || Search
              return (
                <div key={g.type}>
                  <div className="cmdk-group-label">{g.group}</div>
                  {g.items.map((item) => {
                    runningIdx += 1
                    const idx = runningIdx
                    return (
                      <div
                        key={item.id}
                        data-idx={idx}
                        className={`cmdk-item${idx === active ? ' active' : ''}`}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => select(item)}
                      >
                        <span className="ci"><Icon /></span>
                        <span style={{ minWidth: 0 }}>
                          <div className="ct" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                          {item.sub && <div className="cs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sub}</div>}
                        </span>
                        <span className="ck">{item.group}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
