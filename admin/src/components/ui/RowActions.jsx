import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'

export default function RowActions({ editTo, onDelete, extra }) {
  return (
    <div className="row-actions">
      {extra}
      <Link className="act-btn" to={editTo} title="Edit" aria-label="Edit">
        <Pencil size={16} />
      </Link>
      <button className="act-btn del" onClick={onDelete} title="Hapus" aria-label="Hapus">
        <Trash2 size={16} />
      </button>
    </div>
  )
}
