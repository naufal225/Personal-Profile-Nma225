import { cn } from '../../lib/utils'

export default function IconDisplay({ icon, className, alt = 'icon' }) {
  if (!icon) {
    return <span className={cn('text-muted-foreground text-xs', className)}>–</span>
  }

  const trimmed = icon.trim()

  if (trimmed.startsWith('<svg')) {
    return (
      <div
        className={cn('text-foreground [&_svg]:h-full [&_svg]:w-full', className)}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    )
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return (
      <img
        src={trimmed}
        alt={alt}
        className={cn('object-contain', className)}
      />
    )
  }

  return <span className={cn('text-base', className)}>{trimmed}</span>
}
