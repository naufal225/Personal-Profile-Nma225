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

export default function Navbar() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const [active, setActive] = useState('about')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const linksRef = useRef(null)
  const indicatorRef = useRef(null)
  const progressRef = useRef(null)

  // Scroll progress bar + scrolled state
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
      if (progressRef.current) progressRef.current.style.width = `${pct}%`
      setScrolled(doc.scrollTop > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Slide indicator to active link
  useEffect(() => {
    const container = linksRef.current
    const indicator = indicatorRef.current
    if (!container || !indicator) return
    const move = () => {
      const link = container.querySelector(`[data-nav="${active}"]`)
      if (!link) {
        indicator.classList.remove('show')
        return
      }
      indicator.style.transform = `translateX(${link.offsetLeft}px)`
      indicator.style.width = `${link.offsetWidth}px`
      indicator.classList.add('show')
    }
    move()
    window.addEventListener('resize', move)
    return () => window.removeEventListener('resize', move)
  }, [active])

  const go = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />

      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <nav className="nav-pill" aria-label="Main navigation">
          <div className="nav-links" ref={linksRef}>
            <span className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                className={`nav-link${active === s.id ? ' active' : ''}`}
                data-nav={s.id}
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
              >
                {s.label}
              </a>
            ))}
          </div>
          <span className="nav-sep" />
          <button className="nav-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
          <button
            className="nav-icon nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </nav>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            data-nav={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'active' : ''}
            onClick={(e) => go(e, s.id)}
          >
            {s.label}
          </a>
        ))}
      </div>
    </>
  )
}
