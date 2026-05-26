import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetEducations, adminDeleteEducation } from '../../api/educations'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatYear } from '../../utils/formatDate'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '../../components/ui/DropdownMenu'

export default function EducationsIndex() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetEducations()
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => toast.error('Failed to load educations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteEducation(deleteId)
      toast.success('Education deleted')
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
      key: 'institution', header: 'Institution',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium truncate max-w-[280px]">{row.institution}</p>
          {row.major && (
            <p className="text-xs text-muted-foreground truncate max-w-[280px] mt-0.5">{row.major}</p>
          )}
        </div>
      ),
    },
    {
      key: 'period', header: 'Period',
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatYear(row.start_year)} — {formatYear(row.end_year)}
        </span>
      ),
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
            <DropdownMenuItem onClick={() => navigate(`/educations/${row.id}`)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/educations/${row.id}/edit`)}>
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
        title="Educations"
        description="Schools and degrees."
        action={
          <Button asChild>
            <Link to="/educations/create">
              <Plus className="h-4 w-4" /> Add Education
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No educations yet."
        emptyAction={
          <Button asChild size="sm" variant="outline">
            <Link to="/educations/create"><Plus className="h-3.5 w-3.5" /> Add your first education</Link>
          </Button>
        }
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete education?"
        description="This will permanently remove the education."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
