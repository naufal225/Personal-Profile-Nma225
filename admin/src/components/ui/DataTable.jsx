import { useMemo, useState } from 'react'
import { Search, GripVertical, Inbox } from 'lucide-react'
import { usePagination } from '../../hooks/usePagination'
import Pagination from './Pagination'

function matches(row, keys, q) {
  return keys.some((k) => {
    const val = row[k]
    const str = Array.isArray(val) ? val.join(' ') : val == null ? '' : String(val)
    return str.toLowerCase().includes(q)
  })
}

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'Belum ada data.',
  emptyAction,
  searchKeys,
  searchPlaceholder = 'Cari…',
  toolbarExtra,
  itemLabel = 'item',
  pageSize = 10,
  reorderable = false,
  onReorder,
  onReorderEnd,
  skeletonRows = 6,
}) {
  const [q, setQ] = useState('')
  const [draggedLocal, setDraggedLocal] = useState(null)
  const query = q.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!query || !searchKeys) return data
    return data.filter((row) => matches(row, searchKeys, query))
  }, [data, searchKeys, query])

  const { page, setPage, pageCount, total, pageItems, rangeStart, rangeEnd } = usePagination(filtered, pageSize)
  const start = (page - 1) * pageSize
  const dragEnabled = reorderable && !query

  const totalCols = columns.length + (reorderable ? 1 : 0)

  const handleDragStart = (e, localIdx) => {
    if (!dragEnabled) return
    setDraggedLocal(localIdx)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e, localIdx) => {
    if (!dragEnabled || draggedLocal === null) return
    e.preventDefault()
    if (draggedLocal === localIdx) return
    const next = [...data]
    const [moved] = next.splice(start + draggedLocal, 1)
    next.splice(start + localIdx, 0, moved)
    setDraggedLocal(localIdx)
    onReorder?.(next)
  }
  const handleDragEnd = () => {
    if (draggedLocal === null) return
    setDraggedLocal(null)
    onReorderEnd?.()
  }

  const showToolbar = searchKeys || toolbarExtra

  return (
    <>
      {showToolbar && (
        <div className="toolbar">
          {searchKeys && (
            <label className="search">
              <Search />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </label>
          )}
          {toolbarExtra}
        </div>
      )}

      <div className="card table-card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {reorderable && <th style={{ width: 44 }} />}
                {columns.map((col) => (
                  <th key={col.key} style={col.width ? { width: col.width } : undefined} className={col.headerClassName}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: totalCols }).map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 6 }} /></td>
                    ))}
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={totalCols}>
                    <div className="empty">
                      <Inbox />
                      <p>{query ? `Tidak ada hasil untuk "${q}".` : emptyMessage}</p>
                      {!query && emptyAction}
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map((row, localIdx) => (
                  <tr
                    key={row.id ?? localIdx}
                    draggable={dragEnabled}
                    onDragStart={(e) => handleDragStart(e, localIdx)}
                    onDragOver={(e) => handleDragOver(e, localIdx)}
                    onDragEnd={handleDragEnd}
                    className={draggedLocal === localIdx ? 'dragging' : undefined}
                  >
                    {reorderable && (
                      <td>
                        <span className={`drag-h${dragEnabled ? '' : ' disabled'}`} title={dragEnabled ? 'Geser untuk mengurutkan' : 'Hapus pencarian untuk mengurutkan'}>
                          <GripVertical size={16} />
                        </span>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={col.className}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pageItems.length > 0 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onChange={setPage}
            label={itemLabel}
          />
        )}
      </div>
    </>
  )
}
