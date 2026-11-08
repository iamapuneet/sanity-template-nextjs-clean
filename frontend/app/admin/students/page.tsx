'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    mobile: '',
    state: 'Rajasthan',
    district: 'Jaipur',
    account_status: 'active',
  })

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/students?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setStudents(json.students)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [statusFilter])

  const handleOpenAdd = () => {
    setEditingStudent(null)
    setForm({
      full_name: '',
      email: '',
      mobile: '',
      state: 'Rajasthan',
      district: 'Jaipur',
      account_status: 'active',
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (st: any) => {
    setEditingStudent(st)
    setForm({
      full_name: st.full_name,
      email: st.email,
      mobile: st.mobile || '',
      state: st.state || 'Rajasthan',
      district: st.district || 'Jaipur',
      account_status: st.account_status || 'active',
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email) return alert('Name and email are required')

    try {
      const method = editingStudent ? 'PUT' : 'POST'
      const payload = editingStudent ? { ...form, id: editingStudent.id } : form

      const res = await fetch('/api/admin/students', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setModalOpen(false)
        fetchStudents()
      } else {
        alert(json.error || 'Failed to save student')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving student')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        fetchStudents()
      } else {
        alert(json.error || 'Failed to delete student')
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
          <h1 className="text-2xl font-black text-black tracking-tight">Student Management</h1>
          <p className="text-sm text-gray-500">
            Candidate profiles, activity tracking, and Rajasthan exam test history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Icons.Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search candidate name, email, roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
          >
            <option value="all">All Accounts</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div className="text-xs font-bold text-gray-500 whitespace-nowrap">
            {students.length} Candidates
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading student accounts...</div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No candidates found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Tests Taken</th>
                  <th className="py-3.5 px-4 text-center">Avg Score</th>
                  <th className="py-3.5 px-4 text-center">Accuracy</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {st.full_name ? st.full_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-black">{st.full_name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{st.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{st.district || 'Jaipur'}, {st.state || 'Rajasthan'}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{st.mobile || 'No Mobile'}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-black">
                      {st.attempts_count || 0}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {st.avg_score ? `${Number(st.avg_score).toFixed(0)}%` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {st.avg_accuracy ? `${Number(st.avg_accuracy).toFixed(0)}%` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          st.account_status === 'active'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {st.account_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          title="Edit Profile"
                        >
                          <Icons.Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(st.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          title="Delete Account"
                        >
                          <Icons.Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Candidate Profile' : 'Register New Candidate'}
        subtitle="Manage student account credentials and state details"
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
              placeholder="e.g. Rahul Verma"
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
              disabled={Boolean(editingStudent)}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. rahul@examforge.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-mono font-medium disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                District / City
              </label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="e.g. Jaipur, Jodhpur, Kota"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Account Status
            </label>
            <select
              value={form.account_status}
              onChange={(e) => setForm({ ...form, account_status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
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
              {editingStudent ? 'Update Candidate' : 'Register Candidate'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Candidate Account"
        subtitle="Are you sure you want to delete this student?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            This will permanently remove the student profile and their test attempt records from MySQL.
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
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

