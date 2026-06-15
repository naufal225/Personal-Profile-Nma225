import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetCertificates, adminDeleteCertificate, adminReorderCertificates } from '../../api/certificates'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'competition', label: 'Kompetisi' },
  { key: 'training', label: 'Pelatihan' },
  { key: 'achievement', label: 'Prestasi' },
]

export default function CertificatesIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [type, setType] = useState('all')

  const load = () => {
    setLoading(true)
    adminGetCertificates()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat sertifikat'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteCertificate(deleteId)
      toast.success('Sertifikat dihapus')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const persistOrder = async () => {
    try {
      await adminReorderCertificates(items.map((it, i) => ({ id: it.id, order: i + 1 })))
      toast.success('Urutan disimpan')
    } catch {
      toast.error('Gagal menyimpan urutan')
    }
  }

  const visible = useMemo(
    () => (type === 'all' ? items : items.filter((c) => c.type === type)),
    [items, type]
  )

  const columns = [
    {
      key: 'title', header: 'Judul & Penerbit',
      render: (row) => (
        <div style={{ minWidth: 0 }}>
          <div className="cell-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>{row.title}</div>
          <div className="cell-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>{row.issuer}</div>
        </div>
      ),
    },
    {
      key: 'type', header: 'Tipe', width: 130,
      render: (row) => <span className={`badge ${row.type || 'neutral'}`}>{row.type}</span>,
    },
    {
      key: 'year', header: 'Tahun', width: 90,
      render: (row) => <span className="tag-mono">{row.year}</span>,
    },
    {
      key: 'actions', header: '', width: 130,
      render: (row) => (
        <RowActions
          editTo={`/certificates/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
          extra={row.credential_url ? (
            <a className="act-btn" href={row.credential_url} target="_blank" rel="noopener noreferrer" title="Kredensial" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={16} />
            </a>
          ) : null}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Certificates"
        description="Kompetisi, pelatihan, dan prestasi. Geser baris untuk mengurutkan."
        action={<Link to="/certificates/create" className="btn btn-primary"><Plus /> Tambah Sertifikat</Link>}
      />

      <DataTable
        columns={columns}
        data={visible}
        loading={loading}
        itemLabel="sertifikat"
        searchKeys={['title', 'issuer', 'year']}
        searchPlaceholder="Cari sertifikat…"
        reorderable={type === 'all'}
        onReorder={setItems}
        onReorderEnd={persistOrder}
        toolbarExtra={
          <div className="seg">
            {FILTERS.map((f) => (
              <button key={f.key} className={type === f.key ? 'active' : ''} onClick={() => setType(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        }
        emptyMessage="Belum ada sertifikat."
        emptyAction={<Link to="/certificates/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah sertifikat pertama</Link>}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus sertifikat?"
        description="Sertifikat ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
