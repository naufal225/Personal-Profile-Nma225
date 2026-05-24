export default function Badge({ children, variant = 'tech', href, className = '' }) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide transition-all duration-200'

  const variants = {
    tech: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 dark:bg-white/[0.04] dark:text-zinc-300 dark:border-white/10 dark:hover:bg-white/[0.07] dark:hover:border-white/20',
    link: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 cursor-pointer dark:bg-white/[0.04] dark:text-zinc-200 dark:border-white/10 dark:hover:bg-violet-500/10 dark:hover:border-violet-400/40 dark:hover:text-violet-200',
    accent: 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-400/30',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/30',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/30',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/30',
  }

  const cls = `${base} ${variants[variant] ?? variants.tech} ${className}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }

  return <span className={cls}>{children}</span>
}
