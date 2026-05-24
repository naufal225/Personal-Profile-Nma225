import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminCreateContact } from '../../api/contacts'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  type: z.string().min(1, 'Type is required'),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  url: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
})

export default function ContactCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'email', label: '', value: '', url: '', order: 0 },
  })

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, url: data.url || null }
      const res = await adminCreateContact(payload)
      toast.success('Contact created')
      navigate(`/contacts/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create contact')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/contacts"><ArrowLeft className="h-4 w-4" /> Back to contacts</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New Contact</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type" error={errors.type?.message} required description="e.g. email, github, linkedin">
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
              <input {...register('order')} type="number" className={inputCls} placeholder="0" />
            </FormField>
          </div>

          <FormField label="Label" error={errors.label?.message} required description="Friendly name shown to visitors.">
            <input {...register('label')} className={errors.label ? inputCls + ' border-destructive' : inputCls} placeholder="Email" />
          </FormField>

          <FormField label="Value" error={errors.value?.message} required description="The actual contact info (email, username, etc).">
            <input {...register('value')} className={errors.value ? inputCls + ' border-destructive' : inputCls} placeholder="hello@example.com" />
          </FormField>

          <FormField label="URL" error={errors.url?.message} description="Clickable link (mailto:, https://, tel:).">
            <input {...register('url')} type="url" className={inputCls} placeholder="mailto:hello@example.com" />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to="/contacts">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </div>
  )
}
