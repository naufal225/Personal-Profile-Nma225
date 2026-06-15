import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetContacts, adminDeleteContact } from '../../api/contacts'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import RowActions from '../../components/ui/RowActions'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function ContactsIndex() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetContacts()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat kontak'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteContact(deleteId)
      toast.success('Kontak dihapus')
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
      key: 'type', header: 'Tipe', width: 130,
      render: (row) => <span className="badge neutral">{row.type}</span>,
    },
    {
      key: 'label', header: 'Label',
      render: (row) => <span className="cell-title">{row.label}</span>,
    },
    {
      key: 'value', header: 'Nilai',
      render: (row) => <span className="tag-mono" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'bottom' }}>{row.value}</span>,
    },
    {
      key: 'actions', header: '', width: 130,
      render: (row) => (
        <RowActions
          editTo={`/contacts/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
          extra={row.url ? (
            <a className="act-btn" href={row.url} target="_blank" rel="noopener noreferrer" title="Buka" onClick={(e) => e.stopPropagation()}>
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
        title="Contacts"
        description="Cara orang menghubungi Anda."
        action={<Link to="/contacts/create" className="btn btn-primary"><Plus /> Tambah Kontak</Link>}
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        itemLabel="kontak"
        searchKeys={['type', 'label', 'value']}
        searchPlaceholder="Cari kontak…"
        emptyMessage="Belum ada kontak."
        emptyAction={<Link to="/contacts/create" className="btn btn-ghost btn-sm"><Plus size={15} /> Tambah kontak pertama</Link>}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Hapus kontak?"
        description="Kontak ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
