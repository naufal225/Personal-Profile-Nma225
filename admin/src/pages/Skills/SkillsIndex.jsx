import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetSkills, adminDeleteSkill, adminReorderSkills } from '../../api/skills'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'

export default function SkillsIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetSkills()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat skills'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteSkill(deleteId)
      toast.success('Skill dihapus')
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
      await adminReorderSkills(items.map((it, i) => ({ id: it.id, order: i + 1 })))
      toast.success('Urutan disimpan')
    } catch {
      toast.error('Gagal menyimpan urutan')
    }
  }

  const columns = [
    {
      key: 'icon', header: 'Icon', width: 64,
      render: (row) => (
        <span className="icon-chip">
          {row.icon ? <img src={row.icon} alt="" /> : '—'}
        </span>
      ),
    },
    {
      key: 'name', header: 'Nama',
      render: (row) => <span className="cell-title">{row.name}</span>,
    },
    {
      key: 'category', header: 'Kategori',
      render: (row) => row.category ? <span className="badge neutral">{row.category}</span> : <span style={{ color: 'var(--faint)' }}>—</span>,
    },
    {
      key: 'actions', header: '', width: 96,
      render: (row) => <RowActions editTo={`/skills/${row.id}/edit`} onDelete={() => setDeleteId(row.id)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Skills"
        description="Teknologi dan tools yang Anda kuasai. Geser baris memakai handle untuk mengurutkan."
        action={<Link to="/skills/create" className="btn btn-primary"><Plus /> Tambah Skill</Link>}
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="skill"
        searchKeys={['name', 'category']}
        searchPlaceholder="Cari skill…"
        reorderable
        onReorder={setItems}
        onReorderEnd={persistOrder}
        emptyMessage="Belum ada skill."
        emptyAction={<Link to="/skills/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah skill pertama</Link>}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus skill?"
        description="Skill ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
