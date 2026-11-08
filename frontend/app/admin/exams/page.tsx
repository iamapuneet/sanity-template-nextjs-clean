'use client'

import React, { useEffect, useState } from 'react'
import { Icons } from '@/components/admin/Icons'

export default function ExamsManagementPage() {
  const [exams, setExams] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<any>(null)

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active',
    subject_ids: [] as number[],
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [resExams, resSubs] = await Promise.all([
        fetch('/api/admin/exams').then((r) => r.json()),
        fetch('/api/admin/subjects').then((r) => r.json()),
      ])
      if (resExams.success) setExams(resExams.exams)
      if (resSubs.success) setSubjects(resSubs.subjects)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingExam(null)
    setForm({
      name: '',
      code: '',
      description: '',
      status: 'active',
      subject_ids: subjects.map((s) => s.id),
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (exam: any) => {
    setEditingExam(exam)
    setForm({
      name: exam.name,
      code: exam.code,
      description: exam.description || '',
      status: exam.status || 'active',
      subject_ids: subjects.map((s) => s.id),
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/admin/exams'
      const method = editingExam ? 'PUT' : 'POST'
      const payload = editingExam ? { ...form, id: editingExam.id } : form

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setModalOpen(false)
        loadData()
      } else {
        alert(json.error || 'Failed to save exam')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving exam')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exam?')) return
    try {
      const res = await fetch(`/api/admin/exams?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) loadData()
      else alert(json.error || 'Failed to delete exam')
    } catch (err) {
      console.error(err)
    }
  }

  const toggleSubjectSelect = (subId: number) => {
    setForm((prev) => {
      const exists = prev.subject_ids.includes(subId)
      return {
        ...prev,
        subject_ids: exists
          ? prev.subject_ids.filter((id) => id !== subId)
          : [...prev.subject_ids, subId],
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Exam Management</h1>
          <p className="text-sm text-gray-500">
            Define recruitment exams and link syllabus subjects to them.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Icons.Plus size={16} />
          Create Exam
        </button>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400 border border-dashed rounded-xl">
          No exams found. Click "Create Exam" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black transition-all flex flex-col justify-between shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200 font-bold">
                    {exam.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      exam.status === 'active'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-black group-hover:text-black transition-colors mb-1.5">
                  {exam.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                  {exam.description || 'Rajasthan state government informatics assistant competitive exam.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between py-2.5 border-t border-gray-100 text-xs text-gray-600 mb-3">
                  <span>Linked Subjects: <strong>{exam.subjects_count}</strong></span>
                  <span>Mock Tests: <strong>{exam.assessments_count}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(exam)}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icons.Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-700 transition-colors"
                    title="Delete Exam"
                  >
                    <Icons.Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h2 className="text-lg font-bold text-black">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <Icons.Close size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajasthan Informatics Assistant"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Exam Code *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. RAJ_IA_2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Exam description and syllabus coverage..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Assign Subjects ({form.subject_ids.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-gray-200 bg-gray-50/50">
                  {subjects.map((sub) => {
                    const checked = form.subject_ids.includes(sub.id)
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          checked ? 'bg-white border border-black text-black' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSubjectSelect(sub.id)}
                            className="rounded accent-black"
                          />
                          <span>{sub.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">{sub.code}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

