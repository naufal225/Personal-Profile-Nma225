import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetCertificate, adminDeleteCertificate } from '../../api/certificates'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'

const TYPE_COLORS = {
  training: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  achievement: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  competition: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

export default function CertificateShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetCertificate(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Failed to load certificate'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteCertificate(id)
      toast.success('Certificate deleted')
      navigate('/certificates')
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
        <p className="text-muted-foreground">Certificate not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/certificates"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/certificates"><ArrowLeft className="h-4 w-4" /> Certificates</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/certificates/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">{item.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{item.issuer} · {item.year}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-md font-semibold uppercase tracking-wide shrink-0 ${TYPE_COLORS[item.type] || 'bg-muted text-muted-foreground'}`}>
            {item.type}
          </span>
        </div>

        {item.credential_url && (
          <div className="pt-3 border-t border-border">
            <a
              href={item.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> View credential
            </a>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete certificate?"
        description={`"${item.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
