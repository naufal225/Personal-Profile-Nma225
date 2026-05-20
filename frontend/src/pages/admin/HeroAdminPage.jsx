import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetHero, adminUpdateHero } from '../../api/hero'
import Button from '../../components/ui/Button'

export default function HeroAdminPage() {
  const [form, setForm] = useState({ headline: '', subheadline: '', available_for_work: true, resume_url: '', photo_path: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    adminGetHero().then((res) => {
      const d = res.data.data
      if (d) setForm({ headline: d.headline ?? '', subheadline: d.subheadline ?? '', available_for_work: d.available_for_work ?? true, resume_url: d.resume_url ?? '', photo_path: d.photo_path ?? '' })
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminUpdateHero({
        ...form,
        photo_path: form.photo_path || null,
        resume_url: form.resume_url || null,
      })
      setMessage('Saved successfully.')
    } catch {
      setMessage('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Hero Content</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Headline">
            <input className={inputCls} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} required />
          </Field>
          <Field label="Subheadline">
            <textarea className={inputCls} rows={4} value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} required />
          </Field>
          <Field label="Profile Photo URL">
            <input className={inputCls} value={form.photo_path} onChange={(e) => setForm({ ...form, photo_path: e.target.value })} />
          </Field>
          <Field label="Resume URL">
            <input className={inputCls} value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.available_for_work} onChange={(e) => setForm({ ...form, available_for_work: e.target.checked })} />
            Available for work
          </label>
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
function Field({ label, children }) {
  return <div><label className="block text-sm text-gray-400 mb-1">{label}</label>{children}</div>
}
