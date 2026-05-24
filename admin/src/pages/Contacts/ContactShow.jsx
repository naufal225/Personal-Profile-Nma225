import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetContact, adminDeleteContact } from '../../api/contacts'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'

export default function ContactShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetContact(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Failed to load contact'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteContact(id)
      toast.success('Contact deleted')
      navigate('/contacts')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Contact not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/contacts"><ArrowLeft className="h-4 w-4" /> Back to contacts</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/contacts"><ArrowLeft className="h-4 w-4" /> Contacts</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/contacts/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground uppercase tracking-wide font-semibold">
            {item.type}
          </span>
          <h1 className="text-2xl font-semibold text-foreground">{item.label}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Value</p>
            <p className="text-sm text-foreground mt-1 font-mono break-all">{item.value}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</p>
            <p className="text-sm text-foreground mt-1">{item.order ?? 0}</p>
          </div>
        </div>

        {item.url && (
          <div className="pt-3 border-t border-border">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Open link
            </a>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete contact?"
        description={`"${item.label}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
