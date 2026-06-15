import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetEducations, adminDeleteEducation } from '../../api/educations'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatYear } from '../../utils/formatDate'

export default function EducationsIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetEducations()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat pendidikan'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteEducation(deleteId)
      toast.success('Pendidikan dihapus')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'institution', header: 'Institusi',
      render: (row) => (
        <div style={{ minWidth: 0 }}>
          <div className="cell-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{row.institution}</div>
          {row.major && <div className="cell-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{row.major}</div>}
        </div>
      ),
    },
    {
      key: 'period', header: 'Periode', width: 200,
      render: (row) => <span style={{ color: 'var(--muted)', fontSize: 13 }}>{formatYear(row.start_year)} — {formatYear(row.end_year)}</span>,
    },
    {
      key: 'actions', header: '', width: 96,
      render: (row) => <RowActions editTo={`/educations/${row.id}/edit`} onDelete={() => setDeleteId(row.id)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Educations"
        description="Riwayat sekolah dan gelar."
        action={<Link to="/educations/create" className="btn btn-primary"><Plus /> Tambah Pendidikan</Link>}
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="pendidikan"
        searchKeys={['institution', 'major']}
        searchPlaceholder="Cari pendidikan…"
        emptyMessage="Belum ada pendidikan."
        emptyAction={<Link to="/educations/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah pendidikan pertama</Link>}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus pendidikan?"
        description="Data ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
