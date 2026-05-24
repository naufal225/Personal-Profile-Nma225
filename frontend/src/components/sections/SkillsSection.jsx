import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'
import IconDisplay from '../ui/IconDisplay'

export default function SkillsSection({ skills }) {
  return (
    <section id="skills" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="02"
          title="Skills"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>}
          subtitle="Tools and technologies I use to build performant, maintainable web applications."
        />

        {!skills ? (
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-32 bg-slate-200 dark:bg-white/[0.05] rounded" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-8 w-24 bg-slate-200 dark:bg-white/[0.05] rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SkillsGrouped skills={skills} />
        )}
      </Container>
    </section>
  )
}

function SkillsGrouped({ skills }) {
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-50 dark:hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
            <h3 className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-widest">
              {category}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.05] hover:bg-violet-50 dark:hover:bg-violet-500/[0.06] hover:border-violet-300 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/10 group-hover:border-violet-300 dark:group-hover:border-violet-400/20 group-hover:scale-105 transition-all duration-300">
                  <IconDisplay icon={s.icon} name={s.name} size={18} />
                </div>
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
