import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetExperiences, adminDeleteExperience } from '../../api/experiences'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDate } from '../../utils/formatDate'

export default function ExperiencesIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetExperiences()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat pengalaman'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteExperience(deleteId)
      toast.success('Pengalaman dihapus')
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
      key: 'title', header: 'Posisi',
      render: (row) => (
        <div style={{ minWidth: 0 }}>
          <div className="cell-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{row.title}</div>
          <div className="cell-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{row.organization}</div>
        </div>
      ),
    },
    {
      key: 'period', header: 'Periode', width: 200,
      render: (row) => <span style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(row.start_date)} — {formatDate(row.end_date)}</span>,
    },
    {
      key: 'skills', header: 'Skills',
      render: (row) => {
        const skills = Array.isArray(row.skills) ? row.skills : []
        return (
          <div className="tags-cell">
            {skills.slice(0, 3).map((t) => <span key={t} className="tag-mono">{t}</span>)}
            {skills.length > 3 && <span className="tag-mono">+{skills.length - 3}</span>}
          </div>
        )
      },
    },
    {
      key: 'actions', header: '', width: 96,
      render: (row) => <RowActions editTo={`/experiences/${row.id}/edit`} onDelete={() => setDeleteId(row.id)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Experiences"
        description="Riwayat pekerjaan dan posisi Anda."
        action={<Link to="/experiences/create" className="btn btn-primary"><Plus /> Tambah Pengalaman</Link>}
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="pengalaman"
        searchKeys={['title', 'organization', 'skills']}
        searchPlaceholder="Cari pengalaman…"
        emptyMessage="Belum ada pengalaman."
        emptyAction={<Link to="/experiences/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah pengalaman pertama</Link>}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus pengalaman?"
        description="Data ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
