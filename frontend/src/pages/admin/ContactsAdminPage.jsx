import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetContacts, adminCreateContact, adminUpdateContact, adminDeleteContact } from '../../api/contacts'
import Button from '../../components/ui/Button'

const empty = { type: '', label: '', value: '', url: '', order: 0 }

export default function ContactsAdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetContacts().then((r) => setItems(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toPayload = (f) => ({ ...f, url: f.url || null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateContact(editing, toPayload(form)) } else { await adminCreateContact(toPayload(form)) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (x) => { setEditing(x.id); setForm({ type: x.type, label: x.label, value: x.value, url: x.url ?? '', order: x.order }) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    await adminDeleteContact(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Contacts</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Type (e.g. email)" className={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
            <input placeholder="Label (e.g. Email)" className={inp} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <input placeholder="Value" className={inp} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <input placeholder="URL (optional)" className={inp} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input placeholder="Order" type="number" className={inp} value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
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
                  <p className="text-white font-medium">{x.label}: {x.value}</p>
                  <p className="text-gray-500 text-xs">{x.type} · order {x.order}</p>
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
