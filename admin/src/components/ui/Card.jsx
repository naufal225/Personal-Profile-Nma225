import React from 'react'

const Card = React.forwardRef(({ children, className = '', hover = false, as: As = 'div', ...props }, ref) => {
  const base = 'relative rounded-[14px] border bg-card text-card-foreground p-6 transition-colors duration-200'
  const hoverCls = hover ? 'hover:border-[var(--border-strong)]' : ''

  return (
    <As ref={ref} className={`${base} ${hoverCls} ${className}`} {...props}>
      {children}
    </As>
  )
})

Card.displayName = 'Card'
export default Card
