export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  href,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-ink-950'

  const variants = {
    primary:
      'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5',
    ghost:
      'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 dark:bg-white/[0.03] dark:text-zinc-200 dark:border-white/10 dark:hover:bg-white/[0.07] dark:hover:border-white/20',
    outline:
      'bg-transparent text-slate-800 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 dark:text-zinc-200 dark:border-white/15 dark:hover:bg-white/[0.04] dark:hover:border-white/30',
  }

  const cls = `${base} ${variants[variant] ?? variants.primary} ${className}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}
