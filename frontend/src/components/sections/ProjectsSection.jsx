import { useRef, useState } from 'react'

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
                <DemoIcon /> Lihat Demo
              </a>
            )}
            {project.github_url && (
              <a className="project-btn" href={project.github_url} target="_blank" rel="noopener noreferrer">
                <GithubIcon /> Repo GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function ProjectsSection({ projects }) {
  const pages = projects ? chunk(projects, 2) : []
  const pageCount = pages.length

  const [page, setPage] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const dragRef = useRef(0)
  const viewportRef = useRef(null)

  const clamp = (p) => Math.max(0, Math.min(pageCount - 1, p))

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
    const w = viewportRef.current?.offsetWidth || 1
    if (Math.abs(dragRef.current) > w * 0.18) {
      setPage((p) => clamp(p + (dragRef.current < 0 ? 1 : -1)))
    }
    setDragging(false)
    setDrag(0)
  }

  return (
    <section id="projects" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">02</span> PROJECTS</div>
        <h2 className="sec-title">Karya pilihan</h2>
        <p className="sec-sub">Beberapa pekerjaan terbaru — dari aplikasi full-stack hingga sistem internal.</p>
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
                transform: `translateX(calc(${-page * 100}% + ${drag}px))`,
                transition: dragging ? 'none' : undefined,
              }}
            >
              {pages.map((group, gi) => (
                <div className="proj-page" key={gi}>
                  {group.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {pageCount > 1 && (
            <div className="proj-nav">
              <button className="proj-arrow" onClick={() => setPage((p) => clamp(p - 1))} disabled={page === 0} aria-label="Proyek sebelumnya">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div className="proj-dots">
                {pages.map((_, i) => (
                  <button key={i} className={`proj-dot${i === page ? ' active' : ''}`} onClick={() => setPage(i)} aria-label={`Halaman ${i + 1}`} />
                ))}
              </div>
              <span className="proj-counter"><b>{page + 1}</b> / {pageCount}</span>
              <button className="proj-arrow" onClick={() => setPage((p) => clamp(p + 1))} disabled={page === pageCount - 1} aria-label="Proyek berikutnya">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
