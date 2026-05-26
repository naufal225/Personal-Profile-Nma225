import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetExperiences, adminDeleteExperience } from '../../api/experiences'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDate } from '../../utils/formatDate'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../components/ui/DropdownMenu'

export default function ExperiencesIndex() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetExperiences()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Failed to load experiences'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteExperience(deleteId)
      toast.success('Experience deleted')
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
      key: 'title', header: 'Position',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium truncate max-w-[260px]">{row.title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[260px] mt-0.5">{row.organization}</p>
        </div>
      ),
    },
    {
      key: 'period', header: 'Period',
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.start_date)} — {formatDate(row.end_date)}
        </span>
      ),
    },
    {
      key: 'skills', header: 'Skills',
      render: (row) => {
        const skills = Array.isArray(row.skills) ? row.skills : []
        const shown = skills.slice(0, 3)
        const rest = skills.length - 3
        return (
          <div className="flex flex-wrap gap-1">
            {shown.map((t) => (
              <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                {t}
              </span>
            ))}
            {rest > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">+{rest}</span>
            )}
          </div>
        )
      },
    },
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
            <DropdownMenuItem onClick={() => navigate(`/experiences/${row.id}`)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/experiences/${row.id}/edit`)}>
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
        title="Experiences"
        description="Your work history and positions."
        action={
          <Button asChild>
            <Link to="/experiences/create">
              <Plus className="h-4 w-4" /> Add Experience
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No experiences yet."
        emptyAction={
          <Button asChild size="sm" variant="outline">
            <Link to="/experiences/create"><Plus className="h-3.5 w-3.5" /> Add your first experience</Link>
          </Button>
        }
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete experience?"
        description="This will permanently remove the experience."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
