import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetSkills, adminDeleteSkill, adminReorderSkills } from '../../api/skills'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import IconDisplay from '../../components/ui/IconDisplay'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../components/ui/DropdownMenu'

export default function SkillsIndex() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const load = () => {
    setLoading(true)
    adminGetSkills()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteSkill(deleteId)
      toast.success('Skill deleted')
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
      await adminReorderSkills(payload)
      toast.success('Skills order updated')
    } catch {
      toast.error('Failed to save skills order')
    }
  }

  return (
    <>
      <PageHeader
        title="Skills"
        description="Tech and tools you work with. Drag and drop rows using the handle to reorder."
        action={
          <Button asChild>
            <Link to="/skills/create">
              <Plus className="h-4 w-4" /> Add Skill
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
                <th className="w-[64px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Icon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="w-[48px] px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-4"><Skeleton className="h-5 w-4" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-10 w-10 rounded-lg" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-8 w-8 rounded-full" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                      <p className="text-sm text-muted-foreground">No skills yet.</p>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/skills/create">
                          <Plus className="h-3.5 w-3.5" /> Add your first skill
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
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          <IconDisplay icon={row.icon} className="h-7 w-7" alt={row.name} />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3">
                        {row.category ? (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{row.category}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/skills/${row.id}`)}>
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/skills/${row.id}/edit`)}>
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
        title="Delete skill?"
        description="This will permanently remove the skill."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
