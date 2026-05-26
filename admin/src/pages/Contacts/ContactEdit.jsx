import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetContact, adminUpdateContact } from '../../api/contacts'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  type: z.string().min(1, 'Type is required'),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  url: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
})

export default function ContactEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetContact(id)
      .then((r) => {
        const d = r.data.data
        reset({
          type: d.type ?? 'email',
          label: d.label ?? '',
          value: d.value ?? '',
          url: d.url ?? '',
          order: d.order ?? 0,
        })
      })
      .catch(() => toast.error('Failed to load contact'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, url: data.url || null }
      await adminUpdateContact(id, payload)
      toast.success('Contact updated')
      navigate(`/contacts/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={`/contacts/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Contact</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type" error={errors.type?.message} required>
              <select {...register('type')} className={errors.type ? inputCls + ' border-destructive' : inputCls}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Display Order" error={errors.order?.message}>
              <input {...register('order')} type="number" className={inputCls} />
            </FormField>
          </div>
          <FormField label="Label" error={errors.label?.message} required>
            <input {...register('label')} className={errors.label ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Value" error={errors.value?.message} required>
            <input {...register('value')} className={errors.value ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="URL" error={errors.url?.message}>
            <input {...register('url')} type="url" className={inputCls} />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/contacts/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
