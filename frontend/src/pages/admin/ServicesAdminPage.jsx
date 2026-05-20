import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetServices, adminCreateService, adminUpdateService, adminDeleteService } from '../../api/services'
import Button from '../../components/ui/Button'

const empty = { title: '', description: '', icon: '', order: 0 }

export default function ServicesAdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetServices().then((r) => setItems(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateService(editing, form) } else { await adminCreateService(form) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (x) => { setEditing(x.id); setForm({ title: x.title, description: x.description, icon: x.icon, order: x.order }) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    await adminDeleteService(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Services</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input placeholder="Title" className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Description" rows={2} className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Icon (emoji or name)" className={inp} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
            <input placeholder="Order" type="number" className={inp} value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
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
                  <p className="text-white font-medium">{x.icon} {x.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{x.description}</p>
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
