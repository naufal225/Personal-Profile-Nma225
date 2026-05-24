import { cn } from '../../lib/utils'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export function SkeletonRow({ cols = 4 }) {
  const widths = ['w-1/4', 'w-2/5', 'w-1/3', 'w-1/5', 'w-1/6', 'w-1/4']
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className={`h-4 ${widths[i % widths.length]}`} />
        </td>
      ))}
    </tr>
  )
}
