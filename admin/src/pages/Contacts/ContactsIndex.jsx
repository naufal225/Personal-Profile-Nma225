import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetContacts, adminDeleteContact } from '../../api/contacts'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../components/ui/DropdownMenu'

export default function ContactsIndex() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetContacts()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Failed to load contacts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteContact(deleteId)
      toast.success('Contact deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'type', header: 'Type', width: '120px',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wide font-medium">
          {row.type}
        </span>
      ),
    },
    {
      key: 'label', header: 'Label',
      render: (row) => <span className="font-medium">{row.label}</span>,
    },
    {
      key: 'value', header: 'Value',
      render: (row) => (
        <span className="text-sm text-muted-foreground font-mono truncate max-w-[280px] inline-block align-bottom">
          {row.value}
        </span>
      ),
    },
    {
      key: 'url', header: '', width: '40px',
      render: (row) => row.url ? (
        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-primary" onClick={(e) => e.stopPropagation()}>
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null,
    },
    { key: 'order', header: 'Order', className: 'text-muted-foreground w-16 text-right' },
    {
      key: 'actions', header: '', width: '48px', className: 'text-right',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/contacts/${row.id}`)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/contacts/${row.id}/edit`)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => setDeleteId(row.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Contacts"
        description="Ways for people to reach you."
        action={
          <Button asChild>
            <Link to="/contacts/create">
              <Plus className="h-4 w-4" /> Add Contact
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No contacts yet."
        emptyAction={
          <Button asChild size="sm" variant="outline">
            <Link to="/contacts/create"><Plus className="h-3.5 w-3.5" /> Add your first contact</Link>
          </Button>
        }
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete contact?"
        description="This will permanently remove the contact."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
