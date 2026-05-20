import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'
import { formatDate, formatYear } from '../../utils/formatDate'

function TimelineItem({ title, subtitle, dateRange, description, tags, isLast }) {
  return (
    <div className="relative pl-8 sm:pl-9">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-px bg-gradient-to-b from-violet-500/40 dark:from-violet-400/40 via-slate-300/60 dark:via-white/10 to-transparent" />
      )}
      {/* Dot */}
      <div className="absolute left-0 top-1.5 grid place-items-center w-4 h-4 sm:w-[18px] sm:h-[18px]">
        <span className="absolute inset-0 rounded-full bg-violet-500/30 blur-[6px]" />
        <span className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 ring-2 ring-slate-50 dark:ring-ink-950" />
      </div>

      <div className="pb-8 sm:pb-10">
        <p className="text-[11px] font-mono text-violet-600 dark:text-violet-400/90 mb-2 tracking-wide">
          {dateRange}
        </p>
        <h4 className="text-base sm:text-[17px] font-semibold text-slate-900 dark:text-white tracking-tight mb-1">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-zinc-500 mb-3">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
            {description}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ColumnHeader({ children, icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-400/20 text-violet-600 dark:text-violet-400">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">
        {children}
      </h3>
    </div>
  )
}

export default function JourneySection({ experiences, educations }) {
  const loading = !experiences && !educations

  return (
    <section id="journey" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="04"
          title="Journey"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><path d="M12 22V8M5 12h14" /></svg>}
          subtitle="Where I&apos;ve been — work experience and education."
        />

        {loading ? (
          <div className="grid md:grid-cols-2 gap-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <div className="h-4 w-24 bg-slate-200 dark:bg-white/[0.05] rounded animate-pulse" />
                <div className="h-32 bg-slate-200 dark:bg-white/[0.05] rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <ColumnHeader icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}>Experience</ColumnHeader>
              {experiences?.map((exp, i) => (
                <TimelineItem
                  key={exp.id}
                  title={exp.title}
                  subtitle={exp.organization}
                  dateRange={`${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`}
                  description={exp.description}
                  tags={exp.skills}
                  isLast={i === experiences.length - 1}
                />
              ))}
            </div>
            <div>
              <ColumnHeader icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}>Education</ColumnHeader>
              {educations?.map((edu, i) => (
                <TimelineItem
                  key={edu.id}
                  title={edu.institution}
                  subtitle={edu.major}
                  dateRange={`${formatYear(edu.start_year)} — ${formatYear(edu.end_year)}`}
                  description={edu.description}
                  isLast={i === educations.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
