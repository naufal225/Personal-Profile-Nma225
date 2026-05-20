import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetEducations, adminCreateEducation, adminUpdateEducation, adminDeleteEducation } from '../../api/educations'
import Button from '../../components/ui/Button'

const empty = { institution: '', major: '', description: '', start_year: '', end_year: '' }

export default function EducationsAdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetEducations().then((r) => setItems(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toPayload = (f) => ({ ...f, start_year: +f.start_year, end_year: f.end_year ? +f.end_year : null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateEducation(editing, toPayload(form)) } else { await adminCreateEducation(toPayload(form)) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (x) => {
    setEditing(x.id)
    setForm({ institution: x.institution, major: x.major ?? '', description: x.description ?? '', start_year: String(x.start_year), end_year: x.end_year ? String(x.end_year) : '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education?')) return
    await adminDeleteEducation(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Educations</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input placeholder="Institution" className={inp} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required />
          <input placeholder="Major" className={inp} value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />
          <textarea placeholder="Description" rows={2} className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Start Year (e.g. 2020)" type="number" className={inp} value={form.start_year} onChange={(e) => setForm({ ...form, start_year: e.target.value })} required />
            <input placeholder="End Year (leave empty = Present)" type="number" className={inp} value={form.end_year} onChange={(e) => setForm({ ...form, end_year: e.target.value })} />
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
                  <p className="text-white font-medium">{x.institution}</p>
                  <p className="text-gray-500 text-xs">{x.major} · {x.start_year} – {x.end_year ?? 'Present'}</p>
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
