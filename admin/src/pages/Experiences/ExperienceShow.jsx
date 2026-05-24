import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetExperience, adminDeleteExperience } from '../../api/experiences'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../utils/formatDate'

export default function ExperienceShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetExperience(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Failed to load experience'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteExperience(id)
      toast.success('Experience deleted')
      navigate('/experiences')
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
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Experience not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/experiences"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </div>
    )
  }

  const skills = Array.isArray(item.skills) ? item.skills : []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/experiences"><ArrowLeft className="h-4 w-4" /> Experiences</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/experiences/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{item.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{item.organization}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(item.start_date)} — {formatDate(item.end_date)}
          </p>
        </div>

        {item.description && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete experience?"
        description={`"${item.title}" at ${item.organization} will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
