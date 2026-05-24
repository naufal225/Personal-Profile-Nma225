import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminCreateExperience } from '../../api/experiences'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import SkillsSelector from '../../components/ui/SkillsSelector'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  description: z.string().optional().default(''),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().default(''),
})

export default function ExperienceCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', organization: '', description: '', skills: [], start_date: '', end_date: '' },
  })
  const { field: skillsField } = useController({ name: 'skills', control })

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        organization: data.organization,
        description: data.description || null,
        skills: data.skills,
        start_date: data.start_date,
        end_date: data.end_date || null,
      }
      const res = await adminCreateExperience(payload)
      toast.success('Experience created')
      navigate(`/experiences/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create experience')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/experiences"><ArrowLeft className="h-4 w-4" /> Back to experiences</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New Experience</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Title / Position" error={errors.title?.message} required>
            <input {...register('title')} className={errors.title ? inputCls + ' border-destructive' : inputCls} placeholder="Senior Fullstack Engineer" />
          </FormField>
          <FormField label="Organization" error={errors.organization?.message} required>
            <input {...register('organization')} className={errors.organization ? inputCls + ' border-destructive' : inputCls} placeholder="Acme Inc." />
          </FormField>
          <FormField label="Description" error={errors.description?.message} description="What you did, achievements, impact.">
            <textarea {...register('description')} rows={4} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" error={errors.start_date?.message} required>
              <input {...register('start_date')} type="date" className={errors.start_date ? inputCls + ' border-destructive' : inputCls} />
            </FormField>
            <FormField label="End Date" error={errors.end_date?.message} description="Empty = Present.">
              <input {...register('end_date')} type="date" className={inputCls} />
            </FormField>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">Skills Used</p>
          {errors.skills && <p className="text-xs text-destructive mb-2">{errors.skills.message}</p>}
          <SkillsSelector value={skillsField.value} onChange={skillsField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to="/experiences">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Create Experience'}
          </Button>
        </div>
      </form>
    </div>
  )
}
