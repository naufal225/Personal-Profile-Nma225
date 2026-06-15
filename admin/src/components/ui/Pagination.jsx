import { ChevronLeft, ChevronRight } from 'lucide-react'
import { pageList } from '../../hooks/usePagination'

export default function Pagination({ page, pageCount, total, rangeStart, rangeEnd, onChange, label = 'items' }) {
  if (pageCount <= 1) {
    return (
      <div className="pagination">
        <span className="p-info"><b>{total}</b> {label}</span>
      </div>
    )
  }

  const pages = pageList(page, pageCount)

  return (
    <div className="pagination">
      <span className="p-info">
        Showing <b>{rangeStart}</b>–<b>{rangeEnd}</b> of <b>{total}</b> {label}
      </span>
      <div className="p-controls">
        <button className="page-btn" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ChevronLeft />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button className="page-btn" onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
