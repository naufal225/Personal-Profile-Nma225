import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetService, adminDeleteService } from '../../api/services'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'

export default function ServiceShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetService(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Failed to load service'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteService(id)
      toast.success('Service deleted')
      navigate('/services')
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
        <p className="text-muted-foreground">Service not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/services"><ArrowLeft className="h-4 w-4" /> Back to services</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/services"><ArrowLeft className="h-4 w-4" /> Services</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/services/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
            <span>{item.icon || '–'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">{item.title}</h1>
            <span className="mt-1 inline-block text-xs text-muted-foreground">Order: {item.order ?? 0}</span>
          </div>
        </div>
        {item.description && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete service?"
        description={`"${item.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
