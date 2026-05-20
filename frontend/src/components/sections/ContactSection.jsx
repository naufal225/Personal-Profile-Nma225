import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'

export default function ContactSection({ contacts }) {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="07"
          title="Contact"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          subtitle="Open to freelance projects, collaborations, and full-time opportunities."
        />

        {!contacts ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {contacts.map((c) => {
              const Wrap = c.url ? 'a' : 'div'
              const wrapProps = c.url
                ? { href: c.url, target: '_blank', rel: 'noopener noreferrer' }
                : {}
              return (
                <Wrap
                  key={c.id}
                  {...wrapProps}
                  className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-5 min-w-0 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] backdrop-blur-sm transition-all duration-300 ${
                    c.url ? 'hover:border-violet-300 dark:hover:border-violet-400/30 hover:bg-violet-50 dark:hover:bg-violet-500/[0.05] hover:-translate-y-0.5' : ''
                  }`}
                >
                  <div className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-violet-600 dark:text-violet-300 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/10 group-hover:border-violet-300 dark:group-hover:border-violet-400/30 transition-all duration-300">
                    <ContactIcon type={c.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-0.5 truncate">
                      {c.label}
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white truncate group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">
                      {c.value}
                    </p>
                  </div>
                  {c.url && (
                    <svg
                      className="text-slate-400 dark:text-zinc-600 group-hover:text-violet-600 dark:group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all"
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  )}
                </Wrap>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}

function ContactIcon({ type }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const icons = {
    email: (
      <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    github: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    whatsapp: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  }
  return icons[type] ?? (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
