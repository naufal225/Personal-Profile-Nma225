import { Children, useEffect, useState } from 'react'

const getItemsPerPage = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 2 : 1

const navBtn =
  'absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-violet-400 dark:hover:border-violet-500/40 hover:text-violet-700 dark:hover:text-white shadow-xl hover:scale-105 flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 dark:disabled:hover:border-white/10 disabled:hover:text-slate-600 dark:disabled:hover:text-zinc-400 disabled:hover:scale-100'

export default function Carousel({ children }) {
  const items = Children.toArray(children)
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => setItemsPerPage(e.matches ? 2 : 1)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  if (items.length === 0) return null

  const safePage = Math.min(currentPage, totalPages - 1)
  const start = safePage * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, items.length)
  const counterLabel =
    start === end ? `${start} / ${items.length}` : `${start}–${end} / ${items.length}`

  const goPrev = () => setCurrentPage(Math.max(0, safePage - 1))
  const goNext = () => setCurrentPage(Math.min(totalPages - 1, safePage + 1))

  const showControls = totalPages > 1

  return (
    <div>
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageItems = items.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
              const padCount = itemsPerPage - pageItems.length
              return (
                <div key={pageIdx} className="flex w-full shrink-0 gap-4 md:gap-6 py-4">
                  {pageItems.map((node, i) => (
                    <div key={i} className="flex-1 min-w-0">
                      {node}
                    </div>
                  ))}
                  {Array.from({ length: padCount }).map((_, i) => (
                    <div key={`pad-${i}`} className="flex-1 min-w-0" aria-hidden="true" />
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {showControls && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={safePage === 0}
              aria-label="Previous slide"
              className={`${navBtn} -left-3 md:-left-5`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={safePage >= totalPages - 1}
              aria-label="Next slide"
              className={`${navBtn} -right-3 md:-right-5`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {showControls && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-500 font-mono tabular-nums">
            {counterLabel}
          </span>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === safePage}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === safePage
                    ? 'w-6 bg-violet-500'
                    : 'w-2 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
