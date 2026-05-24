import React from 'react'

const Card = React.forwardRef(({ children, className = '', hover = true, as: As = 'div', ...props }, ref) => {
  const base =
    'relative rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] backdrop-blur-sm p-6 sm:p-7 transition-all duration-300'
  const hoverCls = hover
    ? 'hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.04] dark:hover:shadow-black/30'
    : ''

  return (
    <As ref={ref} className={`${base} ${hoverCls} ${className}`} {...props}>
      {children}
    </As>
  )
})

Card.displayName = 'Card'
export default Card
