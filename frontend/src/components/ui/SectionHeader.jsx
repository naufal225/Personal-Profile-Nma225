export default function SectionHeader({ number, title, subtitle, icon }) {
  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-center gap-3 sm:gap-4 mb-3">
        <span className="font-mono text-xs sm:text-sm text-violet-600 dark:text-violet-400/80 font-medium">
          {number}
        </span>
        <div className="h-px flex-1 max-w-[30px] bg-gradient-to-r from-violet-500/40 dark:from-violet-400/40 to-transparent" />
        {icon && <span className="text-violet-600 dark:text-violet-400 shrink-0">{icon}</span>}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent dark:from-white/10 dark:via-white/5" />
      </div>
      {subtitle && (
        <p className={`text-sm sm:text-base text-slate-500 dark:text-zinc-500 max-w-2xl ${icon ? 'md:pl-14' : ''}`}>{subtitle}</p>
      )}
    </div>
  )
}
