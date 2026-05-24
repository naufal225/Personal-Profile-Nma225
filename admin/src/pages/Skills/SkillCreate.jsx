import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminCreateSkillWithFile } from '../../api/skills'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import IconInput from '../../components/ui/IconInput'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
  icon: z.any().refine((v) => v && (v.mode === 'file' || (v.mode === 'svg' && v.svg?.trim())), {
    message: 'Icon is required (upload an image or paste SVG code)',
  }),
})

export default function SkillCreate() {
  const navigate = useNavigate()
  const {
    register, handleSubmit, control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', category: '', order: 0, icon: null },
  })
  const { field: iconField } = useController({ name: 'icon', control })

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      if (data.category) fd.append('category', data.category)
      fd.append('order', data.order ?? 0)
      if (data.icon?.mode === 'file') fd.append('icon_file', data.icon.file)
      else if (data.icon?.mode === 'svg') fd.append('icon_svg', data.icon.svg)

      const res = await adminCreateSkillWithFile(fd)
      toast.success('Skill created')
      navigate(`/skills/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create skill')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/skills"><ArrowLeft className="h-4 w-4" /> Back to skills</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New Skill</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Name" error={errors.name?.message} required>
            <input {...register('name')} className={errors.name ? inputCls + ' border-destructive' : inputCls} placeholder="React" />
          </FormField>

          <FormField label="Category" error={errors.category?.message} description="Optional grouping (e.g. Frontend, Backend).">
            <input {...register('category')} className={inputCls} placeholder="Frontend" />
          </FormField>

          <FormField label="Display Order" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} style={{ width: '100px' }} placeholder="0" />
          </FormField>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Icon</p>
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>
          <IconInput value={iconField.value} onChange={iconField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to="/skills">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Create Skill'}
          </Button>
        </div>
      </form>
    </div>
  )
}
