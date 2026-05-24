import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetProject, adminDeleteProject } from '../../api/projects'
import { Button } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'

export default function ProjectShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    adminGetProject(id)
      .then((r) => setProject(r.data.data))
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteProject(id)
      toast.success('Project deleted')
      navigate('/projects')
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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        </Button>
      </div>
    )
  }

  const techStacks = Array.isArray(project.tech_stacks) ? project.tech_stacks : []

  return (
    <div className="max-w-3xl mx-auto">
      {/* Nav */}
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /> Projects</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/projects/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Thumbnail */}
      {project.thumbnail_path && (
        <div className="rounded-xl overflow-hidden border border-border mb-6 bg-muted">
          <img
            src={project.thumbnail_path}
            alt={project.title}
            className="w-full max-h-72 object-cover"
          />
        </div>
      )}

      {/* Content card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{project.title}</h1>
          <span className="mt-1 inline-block text-xs text-muted-foreground">Order: {project.order}</span>
        </div>

        {project.description && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
        )}

        {techStacks.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tech Stacks</p>
            <div className="flex flex-wrap gap-1.5">
              {techStacks.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.github_url || project.demo_url) && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Github className="h-4 w-4" /> Source Code
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
