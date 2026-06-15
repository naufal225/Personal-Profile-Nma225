import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetProjects, adminDeleteProject, adminReorderProjects } from '../../api/projects'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'

function initials(title) {
  return (title || '?').split(/\s+/).map((w) => w[0]).join('').replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase()
}

export default function ProjectsIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetProjects()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat proyek'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteProject(deleteId)
      toast.success('Proyek dihapus')
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
      await adminReorderProjects(items.map((it, i) => ({ id: it.id, order: i + 1 })))
      toast.success('Urutan disimpan')
    } catch {
      toast.error('Gagal menyimpan urutan')
    }
  }

  const columns = [
    {
      key: 'title', header: 'Proyek',
      render: (row) => {
        const stacks = Array.isArray(row.tech_stacks) ? row.tech_stacks : []
        return (
          <div className="cell-main">
            {row.thumbnail_path ? (
              <img className="thumb-xs" src={row.thumbnail_path} alt={row.title} />
            ) : (
              <span className="thumb-xs ph">{initials(row.title)}</span>
            )}
            <div style={{ minWidth: 0 }}>
              <div className="cell-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{row.title}</div>
              {row.description && <div className="cell-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{row.description}</div>}
              {stacks.length > 0 && (
                <div className="tags-cell" style={{ marginTop: 6 }}>
                  {stacks.slice(0, 3).map((t) => <span key={t} className="tag-mono">{t}</span>)}
                  {stacks.length > 3 && <span className="tag-mono">+{stacks.length - 3}</span>}
                </div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'links', header: 'Tautan', width: 120,
      render: (row) => (
        <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
          {row.github_url && <span className="tag-mono">Git</span>}
          {row.demo_url && <span className="tag-mono">Demo</span>}
          {!row.github_url && !row.demo_url && <span style={{ color: 'var(--faint)' }}>—</span>}
        </div>
      ),
    },
    {
      key: 'actions', header: '', width: 96,
      render: (row) => <RowActions editTo={`/projects/${row.id}/edit`} onDelete={() => setDeleteId(row.id)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Projects"
        description="Kelola proyek portfolio Anda. Geser baris untuk mengurutkan."
        action={<Link to="/projects/create" className="btn btn-primary"><Plus /> Tambah Proyek</Link>}
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="proyek"
        searchKeys={['title', 'description', 'tech_stacks']}
        searchPlaceholder="Cari proyek…"
        reorderable
        onReorder={setItems}
        onReorderEnd={persistOrder}
        emptyMessage="Belum ada proyek."
        emptyAction={<Link to="/projects/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah proyek pertama</Link>}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus proyek?"
        description="Proyek ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
