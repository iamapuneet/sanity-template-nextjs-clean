'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

export default function TopicsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<any>(null)
  const [targetParentId, setTargetParentId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form states
  const [topicName, setTopicName] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const loadData = async () => {
    try {
      setLoading(true)
      const [resSubs, resTops] = await Promise.all([
        fetch('/api/admin/subjects').then((r) => r.json()),
        fetch('/api/admin/topics').then((r) => r.json()),
      ])
      if (resSubs.success && resSubs.subjects.length > 0) {
        setSubjects(resSubs.subjects)
        if (!selectedSubjectId) {
          setSelectedSubjectId(resSubs.subjects[0].id)
        }
      }
      if (resTops.success) {
        setTopics(resTops.topics)
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

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId)
  const subjectTopics = topics.filter((t) => t.subject_id === selectedSubjectId)

  // Build recursive topic tree for selected subject
  const buildTree = (parentId: number | null = null, depth: number = 0): Array<any & { depth: number }> => {
    const directChildren = subjectTopics.filter(
      (t) => (t.parent_id === null && parentId === null) || t.parent_id === parentId
    )
    let result: Array<any & { depth: number }> = []

    for (const child of directChildren) {
      result.push({ ...child, depth })
      const subChildren = buildTree(child.id, depth + 1)
      result = result.concat(subChildren)
    }
    return result
  }

  const flattenedTree = buildTree(null, 0)
  const filteredTree = search
    ? flattenedTree.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : flattenedTree

  const handleOpenAdd = (parentId: number | null = null) => {
    setEditingTopic(null)
    setTargetParentId(parentId)
    setTopicName('')
    setPriority('medium')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t: any) => {
    setEditingTopic(t)
    setTargetParentId(t.parent_id)
    setTopicName(t.name)
    setPriority(t.priority || 'medium')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicName.trim()) return alert('Topic name is required')

    try {
      const method = editingTopic ? 'PUT' : 'POST'
      const payload = editingTopic
        ? {
            id: editingTopic.id,
            subject_id: selectedSubjectId,
            parent_id: targetParentId,
            name: topicName,
            priority,
          }
        : {
            subject_id: selectedSubjectId,
            parent_id: targetParentId,
            name: topicName,
            priority,
          }

      const res = await fetch('/api/admin/topics', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setIsModalOpen(false)
        loadData()
      } else {
        alert(json.error || 'Failed to save topic')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving topic')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/topics?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        loadData()
      } else {
        alert(json.error || 'Failed to delete topic')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const parentTopicName = targetParentId
    ? topics.find((t) => t.id === targetParentId)?.name
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Hierarchical Topic Management
          </h1>
          <p className="text-sm text-gray-500">
            Multi-level syllabus tree structure (Subject → Topic → Sub-topic → Micro-topic).
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAdd(null)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>Add Root Topic</span>
        </button>
      </div>

      {/* Subject Selector Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => {
            const count = topics.filter((t) => t.subject_id === sub.id).length
            const isSelected = sub.id === selectedSubjectId

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tree controls bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Icons.Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search topics in this subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
          />
        </div>
        <div className="text-xs font-bold text-gray-500">
          Showing {filteredTree.length} nodes in {currentSubject?.name}
        </div>
      </div>

      {/* Tree Display */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Icons.Topics size={16} />
            {currentSubject?.name} Syllabus Hierarchy
          </span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading topic hierarchy...</div>
        ) : filteredTree.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <p className="text-sm font-semibold text-gray-700">No topics added for this subject yet.</p>
            <button
              type="button"
              onClick={() => handleOpenAdd(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
            >
              <Icons.Plus size={14} /> Add First Root Topic
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTree.map((node) => {
              const indentPadding = Math.min(node.depth * 28, 140)

              return (
                <div
                  key={node.id}
                  className="p-3.5 sm:p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  style={{ paddingLeft: `${Math.max(16, indentPadding + 16)}px` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-gray-400">
                      {node.depth > 0 ? (
                        <span className="text-gray-400 font-mono text-sm mr-1">↳</span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-black mr-1.5"></span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm ${
                            node.depth === 0 ? 'text-black font-extrabold' : 'text-gray-900 font-semibold'
                          }`}
                        >
                          {node.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            node.priority === 'high'
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {node.priority} priority
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        Level {node.depth + 1} Node • {node.questions_count || 0} Questions Linked
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(node.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-800 text-xs font-semibold transition-colors"
                      title="Add nested subtopic"
                    >
                      <Icons.Plus size={14} />
                      <span>Add Sub-topic</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(node)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                      title="Edit Topic"
                    >
                      <Icons.Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(node.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                      title="Delete Topic"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Topic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingTopic
            ? 'Edit Topic'
            : parentTopicName
            ? `Add Sub-topic under "${parentTopicName}"`
            : `Add Root Topic for ${currentSubject?.name}`
        }
        subtitle="Manage hierarchical topic properties"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Topic Name *
            </label>
            <input
              type="text"
              required
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Blood Relation, Direct Relationship, CPU Architecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Exam Weightage Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black bg-white font-medium"
            >
              <option value="high">High Priority (High frequency in government exams)</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
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
              {editingTopic ? 'Update Topic' : 'Create Topic'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Topic Node"
        subtitle="Are you sure you want to delete this topic?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Deleting this topic node will delete its children subtopics and decouple associated questions. This action is permanent.
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
