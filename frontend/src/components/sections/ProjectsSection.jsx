import { useRef, useState, useEffect } from 'react'

const GAP = 20 // must match .proj-track gap in index.css

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
)
const DemoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
)

function initials(title) {
  return title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .replace(/[^A-Za-z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase()
}

function ProjectCard({ project }) {
  return (
    <article className="project-card panel">
      <div className="project-thumb">
        {project.thumbnail_path ? (
          <img src={project.thumbnail_path} alt={project.title} />
        ) : (
          <div className="ph"><span className="mono">{initials(project.title)}</span></div>
        )}
      </div>
      <div className="project-body">
        <div className="project-top">
          <h3 className="project-title">{project.title}</h3>
        </div>
        <p className="project-desc">{project.description}</p>
        {project.tech_stacks?.length > 0 && (
          <div className="tech-row">
            {project.tech_stacks.map((t) => (
              <span key={t} className="tech">{t}</span>
            ))}
          </div>
        )}
        {(project.demo_url || project.github_url) && (
          <div className="project-actions" onPointerDown={(e) => e.stopPropagation()}>
            {project.demo_url && (
              <a className="project-btn primary" href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <DemoIcon /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a className="project-btn" href={project.github_url} target="_blank" rel="noopener noreferrer">
                <GithubIcon /> GitHub Repo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function ProjectsSection({ projects, num = '02' }) {
  const total = projects?.length ?? 0

  const [perView, setPerView] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 1 : 2
  )
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)

  const startX = useRef(0)
  const dragRef = useRef(0)
  const viewportRef = useRef(null)

  const maxIndex = Math.max(0, total - perView)
  const positions = maxIndex + 1
  const clamp = (i) => Math.max(0, Math.min(maxIndex, i))

  // Responsive cards-per-view: 1 on mobile, 2 on desktop
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const apply = () => setPerView(mq.matches ? 1 : 2)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Keep index in range when perView / count changes
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  // Measure the slide step (card width + gap) so the track can translate in px
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const measure = () => {
      const slide = vp.querySelector('.proj-slide')
      if (slide) setStep(slide.offsetWidth + GAP)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [projects, perView])

  const onPointerDown = (e) => {
    setDragging(true)
    startX.current = e.clientX
    dragRef.current = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - startX.current
    dragRef.current = dx
    setDrag(dx)
  }
  const endDrag = () => {
    if (!dragging) return
    if (step > 0 && Math.abs(dragRef.current) > step * 0.2) {
      setIndex((i) => clamp(i + (dragRef.current < 0 ? 1 : -1)))
    }
    setDragging(false)
    setDrag(0)
  }

  return (
    <section id="projects" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">{num}</span> PROJECTS</div>
        <h2 className="sec-title">Selected work</h2>
        <p className="sec-sub">A few recent projects — from full-stack apps to internal systems.</p>
      </div>

      {!projects ? (
        <div className="projects-grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 420 }} />
          ))}
        </div>
      ) : (
        <div className="proj-carousel reveal">
          <div
            className={`proj-viewport${dragging ? ' grabbing' : ''}`}
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              className="proj-track"
              style={{
                transform: `translateX(${-index * step + drag}px)`,
                transition: dragging ? 'none' : undefined,
              }}
            >
              {projects.map((project) => (
                <div className="proj-slide" key={project.id}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>

          {positions > 1 && (
            <div className="proj-nav">
              <button className="proj-arrow" onClick={() => setIndex((i) => clamp(i - 1))} disabled={index === 0} aria-label="Previous projects">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div className="proj-dots">
                {Array.from({ length: positions }).map((_, i) => (
                  <button key={i} className={`proj-dot${i === index ? ' active' : ''}`} onClick={() => setIndex(i)} aria-label={`Position ${i + 1}`} />
                ))}
              </div>
              <span className="proj-counter"><b>{index + 1}</b> / {positions}</span>
              <button className="proj-arrow" onClick={() => setIndex((i) => clamp(i + 1))} disabled={index === maxIndex} aria-label="Next projects">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
