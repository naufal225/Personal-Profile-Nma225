import Container from '../ui/Container'

export default function HeroSection({ hero }) {
  return (
    <section id="about" className="relative min-h-screen pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 overflow-hidden flex flex-col justify-center">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] max-w-[120vw] rounded-full bg-gradient-to-br from-violet-400/25 via-indigo-400/15 to-transparent dark:from-violet-500/20 dark:via-indigo-500/10 blur-3xl" />
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-light dark:bg-grid opacity-[0.18] dark:opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,_black_25%,_transparent_70%)]" />

      <Container className="relative">
        {!hero ? (
          <div className="animate-pulse space-y-5">
            <div className="h-7 w-40 bg-slate-200 dark:bg-white/[0.05] rounded-full" />
            <div className="h-14 w-3/4 bg-slate-200 dark:bg-white/[0.05] rounded-lg" />
            <div className="h-14 w-2/3 bg-slate-200 dark:bg-white/[0.05] rounded-lg" />
            <div className="h-5 w-1/2 bg-slate-200 dark:bg-white/[0.05] rounded" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[2.14fr_1fr] gap-10 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              {hero.available_for_work && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-400/30 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
                  </span>
                  Available for work
                </span>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-4">
                <span className="text-gradient-accent">Naufal Ma&apos;ruf Ashrori</span>
              </h1>

              <h2 className="text-xl sm:text-2xl font-semibold text-slate-500 dark:text-zinc-400 leading-snug mb-6">
                {hero.headline}
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mb-8">
                {hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {hero.resume_url && (
                  <a
                    href={hero.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                    Download Resume
                  </a>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-white dark:bg-white/[0.03] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
                >
                  Let&apos;s talk
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>

            {/* Decorative right side */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in-up">
              <div className="relative w-full aspect-square max-w-xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/30 via-indigo-400/20 to-transparent dark:from-violet-500/30 dark:via-indigo-500/20 blur-2xl" />
                <div className="relative w-full h-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                  {hero.photo_path ? (
                    <img
                      src={hero.photo_path}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-7xl font-bold text-gradient-accent">
                      N
                    </div>
                  )}
                </div>
                {/* Floating chip */}
                <div className="absolute -bottom-4 -right-4 px-3 py-2 rounded-xl bg-white/95 dark:bg-ink-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl text-xs font-mono text-slate-700 dark:text-zinc-300">
                  <span className="text-violet-600 dark:text-violet-400">{'</>'} </span>
                  full-stack
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
