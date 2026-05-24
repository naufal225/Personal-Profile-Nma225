import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, ExternalLink, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetCertificates, adminDeleteCertificate, adminReorderCertificates } from '../../api/certificates'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../components/ui/DropdownMenu'

const TYPE_COLORS = {
  training: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  achievement: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  competition: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

export default function CertificatesIndex() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const load = () => {
    setLoading(true)
    adminGetCertificates()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Failed to load certificates'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteCertificate(deleteId)
      toast.success('Certificate deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setDraggedIndex(index)
    setItems(newItems)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    try {
      const payload = items.map((item, idx) => ({
        id: item.id,
        order: idx + 1,
      }))
      await adminReorderCertificates(payload)
      toast.success('Certificates order updated')
    } catch {
      toast.error('Failed to save certificates order')
    }
  }

  return (
    <>
      <PageHeader
        title="Certificates"
        description="Trainings, achievements, and competitions. Drag and drop rows to reorder."
        action={
          <Button asChild>
            <Link to="/certificates/create">
              <Plus className="h-4 w-4" /> Add Certificate
            </Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-[48px] px-4 py-3"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title & Issuer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Year</th>
                <th className="w-[40px] px-4 py-3 text-center"></th>
                <th className="w-[48px] px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-4"><Skeleton className="h-5 w-4" /></td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-48 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-10" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-4" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-8 w-8 rounded-full" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                      <p className="text-sm text-muted-foreground">No certificates yet.</p>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/certificates/create">
                          <Plus className="h-3.5 w-3.5" /> Add your first certificate
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row, index) => {
                  const isDragging = draggedIndex === index
                  return (
                    <tr
                      key={row.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${
                        isDragging ? 'bg-accent/40 opacity-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors inline-block">
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[280px]">{row.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[280px] mt-0.5">{row.issuer}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium uppercase tracking-wide ${TYPE_COLORS[row.type] || 'bg-muted text-muted-foreground'}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.year}</td>
                      <td className="px-4 py-3 text-center">
                        {row.credential_url ? (
                          <a href={row.credential_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-block" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/certificates/${row.id}`)}>
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/certificates/${row.id}/edit`)}>
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
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete certificate?"
        description="This will permanently remove the certificate."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
