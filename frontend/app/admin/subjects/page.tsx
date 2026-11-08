'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<any>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/subjects')
      const json = await res.json()
      if (json.success) {
        setSubjects(json.subjects)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenAdd = () => {
    setEditingSubject(null)
    setName('')
    setCode(`SUB_0${subjects.length + 1}`)
    setDescription('')
    setStatus('active')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (sub: any) => {
    setEditingSubject(sub)
    setName(sub.name)
    setCode(sub.code)
    setDescription(sub.description || '')
    setStatus(sub.status)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert('Subject name is required')
    if (!code.trim()) return alert('Subject code is required')

    try {
      const method = editingSubject ? 'PUT' : 'POST'
      const payload = editingSubject
        ? { id: editingSubject.id, name, code, description, status }
        : { name, code, description, status }

      const res = await fetch('/api/admin/subjects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setIsModalOpen(false)
        fetchSubjects()
      } else {
        alert(json.error || 'Failed to save subject')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving subject')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/subjects?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        fetchSubjects()
      } else {
        alert(json.error || 'Failed to delete subject')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Subject Management</h1>
          <p className="text-sm text-gray-500">
            Configure Rajasthan Informatics Assistant exam syllabus subjects and view question counts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Action bar: Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Icons.Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search subjects by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
          />
        </div>
        <div className="text-xs font-bold text-gray-500">
          Total: {filteredSubjects.length} subjects
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading subjects from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-black transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">
                    {sub.code ? sub.code.substring(0, 3) : 'SUB'}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'active'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-black group-hover:text-black transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-gray-500 mt-0.5">
                    {sub.code}
                  </p>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {sub.description || 'Core syllabus module for Rajasthan IA exam preparation.'}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-semibold text-gray-600">
                  <span><strong>{sub.topics_count || 0}</strong> Topics</span>
                  <span>•</span>
                  <span><strong>{sub.questions_count || 0}</strong> Questions</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                    title="Edit Subject"
                  >
                    <Icons.Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(sub.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                    title="Delete Subject"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
        subtitle="Manage exam syllabus subject details in MySQL"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science, Reasoning, Hindi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Subject Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. COMPUTER, REASONING"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-mono font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the topics covered in this subject..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black bg-white font-medium"
            >
              <option value="active">Active (Visible in Question Bank & Tests)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Subject"
        subtitle="Confirm subject removal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Deleting this subject will remove its database entry and linked topics. This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
