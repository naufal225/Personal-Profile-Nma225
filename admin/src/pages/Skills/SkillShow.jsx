import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetSkill, adminDeleteSkill } from '../../api/skills'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import IconDisplay from '../../components/ui/IconDisplay'

export default function SkillShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetSkill(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Failed to load skill'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteSkill(id)
      toast.success('Skill deleted')
      navigate('/skills')
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
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Skill not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/skills"><ArrowLeft className="h-4 w-4" /> Back to skills</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/skills"><ArrowLeft className="h-4 w-4" /> Skills</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/skills/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
            <IconDisplay icon={item.icon} className="h-10 w-10" alt={item.name} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{item.name}</h1>
            {item.category && (
              <p className="mt-1 inline-block text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{item.category}</p>
            )}
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-border text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</p>
          <p className="text-foreground mt-1">{item.order ?? 0}</p>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete skill?"
        description={`"${item.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
