import { useEffect, useRef, useState } from 'react'
import useThemeStore from '../store/themeStore'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function SectionRail() {
  const [active, setActive] = useState('about')
  const [open, setOpen] = useState(false)
  const pillRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? 'About'
  const toggleAriaLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <>
      <aside
        aria-label="Section navigation"
        className="hidden md:block fixed top-1/2 right-5 -translate-y-1/2 z-50"
      >
        <ul className="flex flex-col items-end gap-5">
          {SECTIONS.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center gap-3 justify-end"
                >
                  <span
                    className={
                      'text-[11px] font-medium tracking-wide transition-all duration-200 ' +
                      'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ' +
                      (isActive
                        ? 'text-violet-600 dark:text-violet-300'
                        : 'text-slate-700 dark:text-zinc-300')
                    }
                  >
                    {s.label}
                  </span>
                  <span
                    className={
                      'block rounded-full transition-all duration-200 ' +
                      (isActive
                        ? 'w-2.5 h-2.5 bg-violet-500 dark:bg-violet-400 shadow-[0_0_10px_rgba(124,58,237,0.5)] dark:shadow-[0_0_10px_rgba(167,139,250,0.7)]'
                        : 'w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-600 group-hover:bg-slate-600 dark:group-hover:bg-zinc-300')
                    }
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={toggleAriaLabel}
            className="grid place-items-center w-7 h-7 rounded-full text-slate-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <div ref={pillRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Section navigation"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 dark:bg-ink-950/80 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] shadow-lg shadow-slate-900/10 dark:shadow-black/30 text-sm font-medium text-slate-900 dark:text-white"
          >
            <span>{activeLabel}</span>
            <svg
              className={'transition-transform duration-200 ' + (open ? 'rotate-180' : '')}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] p-1 rounded-2xl bg-white/95 dark:bg-ink-950/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] shadow-2xl shadow-slate-900/15 dark:shadow-black/40"
            >
              {SECTIONS.map((s) => {
                const isActive = active === s.id
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? 'true' : undefined}
                      className={
                        'block px-4 py-2.5 rounded-lg text-sm transition-colors ' +
                        (isActive
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]')
                      }
                    >
                      {s.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={toggleAriaLabel}
          className="grid place-items-center w-9 h-9 rounded-full bg-white/85 dark:bg-ink-950/80 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 shadow-lg shadow-slate-900/10 dark:shadow-black/30"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </>
  )
}
