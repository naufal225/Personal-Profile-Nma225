import { useEffect, useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import { adminGetHero, adminUpdateHeroWithFile } from '../../api/hero'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'

const schema = z.object({
  headline: z.string().min(1, 'Headline wajib diisi'),
  subheadline: z.string().min(1, 'Subheadline wajib diisi'),
  available_for_work: z.boolean().default(true),
  resume_url: z.string().optional().default(''),
  photo: z.any().optional(),
})

export default function HeroEditPage() {
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { headline: '', subheadline: '', available_for_work: true, resume_url: '', photo: null },
  })
  const { field: photoField } = useController({ name: 'photo', control, defaultValue: null })

  useEffect(() => {
    adminGetHero()
      .then((r) => {
        const d = r.data.data
        if (d) {
          reset({
            headline: d.headline ?? '',
            subheadline: d.subheadline ?? '',
            available_for_work: d.available_for_work ?? true,
            resume_url: d.resume_url ?? '',
            photo: d.photo_path ? { mode: 'url', url: d.photo_path } : null,
          })
        }
      })
      .catch(() => toast.error('Gagal memuat konten hero'))
      .finally(() => setFetching(false))
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('_method', 'PUT')
      fd.append('headline', data.headline)
      fd.append('subheadline', data.subheadline)
      fd.append('available_for_work', data.available_for_work ? '1' : '0')
      if (data.resume_url) fd.append('resume_url', data.resume_url)
      if (data.photo?.mode === 'file') fd.append('photo_file', data.photo.file)
      else if (data.photo?.mode === 'url') fd.append('photo_url', data.photo.url)

      await adminUpdateHeroWithFile(fd)
      toast.success('Konten hero diperbarui')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal menyimpan')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 360 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Konten Hero"
      subtitle="Bagian pertama yang dilihat pengunjung di portfolio Anda."
      backTo="/dashboard"
      cancelTo="/dashboard"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan"
      dirty={isDirty}
      aside={
        <>
          <AsideCard title="Foto Profil">
            <ImageUpload value={photoField.value} onChange={photoField.onChange} />
          </AsideCard>
          <AsideCard title="Pengaturan">
            <div className="toggle-row">
              <div>
                <div className="tt">Tersedia untuk proyek</div>
                <div className="ts">Tampilkan badge "tersedia" di hero.</div>
              </div>
              <label className="switch">
                <input type="checkbox" {...register('available_for_work')} />
                <span className="track" />
                <span className="knob" />
              </label>
            </div>
          </AsideCard>
        </>
      }
    >
      <FormCard>
        <FormSection icon={Sparkles} title="Konten Hero">
          <FormField className="full" label="Headline" error={errors.headline?.message} required description="Baris peran di bawah nama Anda.">
            <input {...register('headline')} className={inputCls} placeholder="Backend-Focused Full-Stack Developer" />
          </FormField>
          <FormField className="full" label="Subheadline" error={errors.subheadline?.message} required description="Paragraf deskripsi singkat.">
            <textarea {...register('subheadline')} rows={3} className="textarea" placeholder="Saya merancang dan membangun sistem web yang skalabel…" />
          </FormField>
          <FormField className="full" label="Resume URL" error={errors.resume_url?.message} description="Tautan publik ke CV/resume Anda.">
            <input {...register('resume_url')} type="url" className={inputCls} placeholder="https://drive.google.com/..." />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
