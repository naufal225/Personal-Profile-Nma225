import { useState, useEffect } from 'react'

export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1)
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  // Clamp page if the list shrinks (e.g. after filtering or deletion)
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [pageCount, page])

  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    page,
    setPage,
    pageCount,
    total,
    pageSize,
    pageItems,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, total),
  }
}

// Compact page list with ellipsis, e.g. [1, '…', 4, 5, 6, '…', 12]
export function pageList(page, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }
  const pages = new Set([1, pageCount, page, page - 1, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}
