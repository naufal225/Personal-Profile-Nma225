import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from './ConfirmDialog'

export function DetailShell({
  title,
  subtitle,
  backTo,
  backLabel = 'Kembali',
  editTo,
  deleteFn,
  redirectTo,
  deleteTitle = 'Hapus item?',
  deleteDescription = 'Item ini akan dihapus secara permanen.',
  aside,
  children,
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await deleteFn()
      toast.success('Berhasil dihapus')
      navigate(redirectTo)
    } catch {
      toast.error('Gagal menghapus')
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div style={{ minWidth: 0 }}>
          {backTo && <Link to={backTo} className="form-back"><ArrowLeft size={15} /> {backLabel}</Link>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-sub">{subtitle}</p>}
        </div>
        <div className="page-actions">
          {editTo && <Link to={editTo} className="btn btn-ghost"><Pencil size={15} /> Edit</Link>}
          {deleteFn && <button className="btn btn-danger" onClick={() => setOpen(true)}><Trash2 size={15} /> Hapus</button>}
        </div>
      </div>

      <div className={`form-layout${aside ? '' : ' no-aside'}`}>
        <div style={{ minWidth: 0 }}>{children}</div>
        {aside && <div>{aside}</div>}
      </div>

      {deleteFn && (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title={deleteTitle}
          description={deleteDescription}
          onConfirm={handleConfirm}
          loading={deleting}
        />
      )}
    </>
  )
}

export function MetaRow({ k, v }) {
  return (
    <div className="meta-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  )
}

export function DetailBlock({ label, children }) {
  return (
    <div className="detail-block">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  )
}

export function DetailLoading() {
  return <div className="card" style={{ height: 260 }}><div className="skeleton" style={{ height: '100%' }} /></div>
}

export function DetailNotFound({ message, backTo, backLabel = 'Kembali' }) {
  return (
    <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 24px' }}>
      <p style={{ color: 'var(--muted)', marginBottom: 16 }}>{message}</p>
      <Link to={backTo} className="btn btn-ghost" style={{ display: 'inline-flex' }}><ArrowLeft size={15} /> {backLabel}</Link>
    </div>
  )
}
