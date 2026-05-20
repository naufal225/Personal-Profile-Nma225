import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetExperiences, adminCreateExperience, adminUpdateExperience, adminDeleteExperience } from '../../api/experiences'
import Button from '../../components/ui/Button'

const empty = { title: '', organization: '', description: '', skills: '', start_date: '', end_date: '' }

export default function ExperiencesAdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetExperiences().then((r) => setItems(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toPayload = (f) => ({
    ...f,
    skills: typeof f.skills === 'string' ? f.skills.split(',').map((s) => s.trim()).filter(Boolean) : f.skills,
    end_date: f.end_date || null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateExperience(editing, toPayload(form)) } else { await adminCreateExperience(toPayload(form)) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (x) => {
    setEditing(x.id)
    setForm({ title: x.title, organization: x.organization, description: x.description ?? '', skills: Array.isArray(x.skills) ? x.skills.join(', ') : '', start_date: x.start_date?.slice(0, 10) ?? '', end_date: x.end_date?.slice(0, 10) ?? '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return
    await adminDeleteExperience(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Experiences</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input placeholder="Title" className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Organization" className={inp} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
          <textarea placeholder="Description" rows={2} className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Skills (comma-separated)" className={inp} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500 mb-1 block">Start Date</label><input type="date" className={inp} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">End Date (leave empty = Present)</label><input type="date" className={inp} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(empty) }}>Cancel</Button>}
          </div>
        </form>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="space-y-3">
            {items.map((x) => (
              <div key={x.id} className="flex items-start justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{x.title}</p>
                  <p className="text-gray-500 text-xs">{x.organization} · {x.start_date} – {x.end_date ?? 'Present'}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(x)} className="text-blue-400 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(x.id)} className="text-red-400 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
