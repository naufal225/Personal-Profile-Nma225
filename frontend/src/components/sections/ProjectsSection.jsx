import { useRef, useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ProjectsSection({ projects }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  return (
    <section id="projects" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="03"
          title="Projects"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
          subtitle="A selection of recent work — from full-stack apps to internal tools."
        />

        {!projects ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 -mx-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[460px] w-[85%] md:w-[calc(50%-12px)] shrink-0 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="relative group/section">
            {/* Scroll buttons (Visible and clickable ONLY on hover of the section) */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 text-slate-600 dark:text-zinc-400 hover:text-violet-700 dark:hover:text-white shadow-xl hover:scale-105 flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none group-hover/section:opacity-100 group-hover/section:pointer-events-auto hidden md:flex"
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 text-slate-600 dark:text-zinc-400 hover:text-violet-700 dark:hover:text-white shadow-xl hover:scale-105 flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none group-hover/section:opacity-100 group-hover/section:pointer-events-auto hidden md:flex"
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide py-4 px-2 -mx-2"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

function ProjectCard({ project }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <Card
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      hover={false} // Disable basic card translate to use our customized Translate-y-2
      className="flex flex-col group w-[85%] md:w-[calc(50%-12px)] shrink-0 snap-start !p-0 overflow-hidden relative transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/50 dark:hover:border-violet-500/35 hover:shadow-2xl hover:shadow-violet-500/15 dark:hover:shadow-violet-500/10 cursor-default"
    >
      {/* Dynamic Cursor Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.12), transparent 85%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Thumbnail Image or Gradient Initials */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-white/[0.06]">
          {project.thumbnail_path ? (
            <img
              src={project.thumbnail_path}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-ink-950 flex items-center justify-center transition-all duration-300">
              <div className="absolute inset-0 bg-grid-light dark:bg-grid opacity-[0.12] dark:opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,_black,_transparent_70%)]" />
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 opacity-80 dark:opacity-60 tracking-wider">
                {project.title.split(' ').map(w => w[0]).join('').substring(0, 3)}
              </span>
            </div>
          )}
        </div>

        {/* Card details with padding */}
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {project.github_url && (
                <IconLink href={project.github_url} label="GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                </IconLink>
              )}
              {project.demo_url && (
                <IconLink href={project.demo_url} label="Live Demo">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                </IconLink>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 flex-1">
            {project.description}
          </p>

          {project.tech_stacks?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tech_stacks.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2.5">
            {project.github_url && (
              <Badge variant="link" href={project.github_url}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                Source Code
              </Badge>
            )}
            {project.demo_url && (
              <Badge variant="link" href={project.demo_url}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                Live Demo
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-7 h-7 rounded-md text-slate-400 dark:text-zinc-500 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
    >
      {children}
    </a>
  )
}
