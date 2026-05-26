import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminCreateService } from '../../api/services'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon/slug is required'),
  order: z.coerce.number().int().default(0),
})

const DEFAULT_TIER = { name: '', price: '', recommended: false, note: '', features: '' }

export default function ServiceCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', icon: '', order: 0 },
  })
  const [tiers, setTiers] = useState([{ ...DEFAULT_TIER }])

  const addTier = () => setTiers((prev) => [...prev, { ...DEFAULT_TIER }])
  const removeTier = (i) => setTiers((prev) => prev.filter((_, idx) => idx !== i))

  const updateTier = (i, field, value) => {
    setTiers((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  const onSubmit = async (data) => {
    try {
      const metadata = {
        tiers: tiers
          .filter((t) => t.name.trim())
          .map((t) => ({
            name: t.name.trim(),
            price: t.price.trim(),
            recommended: t.recommended,
            note: t.note.trim(),
            features: t.features.split('\n').map((f) => f.trim()).filter(Boolean),
          })),
      }
      const res = await adminCreateService({ ...data, metadata })
      toast.success('Service created')
      navigate(`/services/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create service')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/services"><ArrowLeft className="h-4 w-4" /> Back to services</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New Service</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Title (Category Label)" error={errors.title?.message} required>
            <input {...register('title')} className={errors.title ? inputCls + ' border-destructive' : inputCls} placeholder="Kontraktor" />
          </FormField>
          <FormField label="Description" error={errors.description?.message} required>
            <textarea {...register('description')} rows={2} className={errors.description ? inputCls + ' border-destructive' : inputCls} placeholder="Brief description of this service category." />
          </FormField>
          <FormField label="Icon / Slug" error={errors.icon?.message} required description="Short identifier used as category ID (e.g. kontraktor, klinik).">
            <input {...register('icon')} className={errors.icon ? inputCls + ' border-destructive' : inputCls} placeholder="kontraktor" />
          </FormField>
          <FormField label="Display Order">
            <input {...register('order')} type="number" className={inputCls} style={{ width: '100px' }} placeholder="0" />
          </FormField>
        </div>

        {/* Tiers */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Pricing Tiers</p>
            <Button type="button" variant="outline" size="sm" onClick={addTier}>
              <Plus className="h-3.5 w-3.5" /> Add Tier
            </Button>
          </div>

          {tiers.map((tier, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tier {i + 1}</p>
                {tiers.length > 1 && (
                  <button type="button" onClick={() => removeTier(i)} className="text-destructive hover:text-destructive/80 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Name">
                  <input
                    value={tier.name}
                    onChange={(e) => updateTier(i, 'name', e.target.value)}
                    className={inputCls}
                    placeholder="Basic"
                  />
                </FormField>
                <FormField label="Price">
                  <input
                    value={tier.price}
                    onChange={(e) => updateTier(i, 'price', e.target.value)}
                    className={inputCls}
                    placeholder="Rp3.000.000"
                  />
                </FormField>
              </div>
              <FormField label="Note">
                <input
                  value={tier.note}
                  onChange={(e) => updateTier(i, 'note', e.target.value)}
                  className={inputCls}
                  placeholder="Short description shown under price."
                />
              </FormField>
              <FormField label="Features" description="One feature per line.">
                <textarea
                  value={tier.features}
                  onChange={(e) => updateTier(i, 'features', e.target.value)}
                  rows={4}
                  className={inputCls}
                  placeholder={'Feature 1\nFeature 2\nFeature 3'}
                />
              </FormField>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tier.recommended}
                  onChange={(e) => updateTier(i, 'recommended', e.target.checked)}
                  className="rounded border-input"
                />
                Mark as Recommended
              </label>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to="/services">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  )
}
