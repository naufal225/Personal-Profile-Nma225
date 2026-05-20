import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'
import Card from '../ui/Card'

const typeLabel = {
  training: 'Training',
  achievement: 'Achievement',
  competition: 'Competition',
}

const typeStyle = {
  training: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-400/30',
  achievement: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-400/30',
  competition: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-400/30',
}

const typeIcon = {
  training: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
  ),
  achievement: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /></svg>
  ),
  competition: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
  ),
}

export default function CertificatesSection({ certificates }) {
  return (
    <section id="certificates" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="05"
          title="Certificates"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>}
          subtitle="Trainings, achievements, and competitions I've completed."
        />

        {!certificates ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {certificates.map((cert) => {
              const style = typeStyle[cert.type] ?? 'bg-slate-100 dark:bg-zinc-500/10 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-400/30'
              return (
                <Card key={cert.id} className="!p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900 dark:text-white leading-snug tracking-tight">
                      {cert.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border shrink-0 ${style}`}
                    >
                      {typeIcon[cert.type]}
                      {typeLabel[cert.type] ?? cert.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mb-3">
                    {cert.issuer} · <span className="font-mono">{cert.year}</span>
                  </p>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      View credential
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                    </a>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
