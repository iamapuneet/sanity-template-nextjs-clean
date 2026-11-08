'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    role_id: 2,
    status: 'active',
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/admins')
      const json = await res.json()
      if (json.success) {
        setAdmins(json.admins)
        setRoles(json.roles)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email) return alert('Name and email are required')

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        setModalOpen(false)
        loadData()
      } else {
        alert(json.error || 'Failed to save admin user')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating admin')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        loadData()
      } else {
        alert(json.error || 'Failed to delete admin')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Admin & Role Management</h1>
          <p className="text-sm text-gray-500">
            Control platform administrative access, roles, and content permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm({ full_name: '', email: '', role_id: 2, status: 'active' })
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Role Definitions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {roles.map((r) => (
          <div key={r.id} className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="text-xs font-black font-mono text-black uppercase">{r.name}</div>
            <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">{r.description}</div>
          </div>
        ))}
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
          <span>Active Staff & Content Administrators</span>
          <span>{admins.length} accounts</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading admin users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Added Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {admins.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          {u.full_name ? u.full_name.charAt(0) : 'A'}
                        </div>
                        <div>
                          <div className="font-bold text-black">{u.full_name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200">
                        {u.role_name || 'admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'active' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'System'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.id !== 1 && (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                          title="Revoke Admin Access"
                        >
                          <Icons.Trash size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Admin User"
        subtitle="Create an internal account and assign permission roles"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. ramesh@examforge.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-mono font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Administrative Role
            </label>
            <select
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.description}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
            >
              Grant Access
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Revoke Admin Access"
        subtitle="Confirm removal of administrator account"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            This will immediately revoke all administrative privileges for this account.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold"
            >
              Confirm Revoke
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

