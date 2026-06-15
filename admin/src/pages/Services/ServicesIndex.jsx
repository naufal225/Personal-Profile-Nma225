import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetServices, adminDeleteService, adminReorderServices } from '../../api/services'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'

export default function ServicesIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetServices()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat layanan'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteService(deleteId)
      toast.success('Layanan dihapus')
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
      await adminReorderServices(items.map((it, i) => ({ id: it.id, order: i + 1 })))
      toast.success('Urutan disimpan')
    } catch {
      toast.error('Gagal menyimpan urutan')
    }
  }

  const columns = [
    {
      key: 'title', header: 'Layanan',
      render: (row) => {
        const tiers = row.metadata?.tiers?.length ?? 0
        return (
          <div className="cell-main">
            <span className="icon-chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
              {(row.icon || row.title || '?').slice(0, 2).toUpperCase()}
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="cell-title">{row.title}</div>
              {row.description && <div className="cell-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>{row.description}</div>}
              {tiers > 0 && <div className="cell-sub">{tiers} paket</div>}
            </div>
          </div>
        )
      },
    },
    {
      key: 'actions', header: '', width: 96,
      render: (row) => <RowActions editTo={`/services/${row.id}/edit`} onDelete={() => setDeleteId(row.id)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Services"
        description="Paket layanan yang Anda tawarkan. Geser baris untuk mengurutkan."
        action={<Link to="/services/create" className="btn btn-primary"><Plus /> Tambah Layanan</Link>}
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="layanan"
        searchKeys={['title', 'description']}
        searchPlaceholder="Cari layanan…"
        reorderable
        onReorder={setItems}
        onReorderEnd={persistOrder}
        emptyMessage="Belum ada layanan."
        emptyAction={<Link to="/services/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah layanan pertama</Link>}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus layanan?"
        description="Layanan ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
