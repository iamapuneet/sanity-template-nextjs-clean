'use client'

import React, { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'
import { useExamStore } from '@/lib/store'
import { Topic, TopicPriority } from '@/lib/exam-types'
import { toast } from 'sonner'

export default function TopicsPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { subjects, topics, addTopic, updateTopic, deleteTopic, questions } = useExamStore()

  // Selected subject for viewing tree
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id || 1)
  const [search, setSearch] = useState('')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [targetParentId, setTargetParentId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form states
  const [topicName, setTopicName] = useState('')
  const [topicCode, setTopicCode] = useState('')
  const [priority, setPriority] = useState<TopicPriority>('medium')

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId)
  const subjectTopics = topics.filter((t) => t.subjectId === selectedSubjectId)

  // Build recursive topic tree for selected subject
  const buildTree = (parentId: number | null = null, depth: number = 0): Array<Topic & { depth: number }> => {
    const directChildren = subjectTopics.filter((t) => (t.parentId === null && parentId === null) || t.parentId === parentId)
    let result: Array<Topic & { depth: number }> = []

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

  // Open modal to add root topic or subtopic
  const handleOpenAdd = (parentId: number | null = null) => {
    setEditingTopic(null)
    setTargetParentId(parentId)
    setTopicName('')
    setTopicCode('')
    setPriority('medium')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t: Topic) => {
    setEditingTopic(t)
    setTargetParentId(t.parentId)
    setTopicName(t.name)
    setTopicCode(t.code || '')
    setPriority(t.priority)
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicName.trim()) {
      toast.error('Topic name is required')
      return
    }

    if (editingTopic) {
      updateTopic(editingTopic.id, {
        name: topicName,
        code: topicCode || undefined,
        priority,
      })
    } else {
      addTopic({
        subjectId: selectedSubjectId,
        parentId: targetParentId,
        name: topicName,
        code: topicCode || undefined,
        priority,
      })
    }
    setIsModalOpen(false)
  }

  const parentTopicName = targetParentId
    ? topics.find((t) => t.id === targetParentId)?.name
    : null

  const getPriorityBadge = (p: TopicPriority) => {
    switch (p) {
      case 'high':
        return 'bg-black text-white border-black'
      case 'medium':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'low':
        return 'bg-white text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Hierarchical Topic Management"
        subtitle="Organize multi-level syllabus trees (Subject → Topic → Sub-topic → Micro-topic)"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Subject selector tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {subjects.map((sub) => {
              const count = topics.filter((t) => t.subjectId === sub.id).length
              const isSelected = sub.id === selectedSubjectId

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600'
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
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Icons.Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search topics in this subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap hidden md:inline">
              Showing <strong>{filteredTree.length}</strong> topic nodes in {currentSubject?.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAdd(null)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <Icons.Plus size={18} />
            <span>Add Root Topic</span>
          </button>
        </div>

        {/* Tree Structure Display */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Icons.Topics size={16} className="text-black" />
              {currentSubject?.name} Topic Hierarchy
            </span>
            <span className="hidden sm:inline">Actions & Sub-Nodes</span>
          </div>

          {filteredTree.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Icons.Topics size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-700">No topics added for this subject yet.</p>
              <p className="text-xs text-gray-400">Click "Add Root Topic" to create the initial syllabus branch.</p>
              <button
                type="button"
                onClick={() => handleOpenAdd(null)}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800"
              >
                <Icons.Plus size={16} /> Add First Root Topic
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTree.map((node) => {
                const qCount = questions.filter((q) => q.topicId === node.id).length
                const indentPadding = Math.min(node.depth * 28, 140)

                return (
                  <div
                    key={node.id}
                    className="p-3.5 sm:p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    style={{ paddingLeft: `${Math.max(16, indentPadding + 16)}px` }}
                  >
                    {/* Node title & depth indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-gray-400">
                        {node.depth > 0 ? (
                          <span className="text-gray-300 font-mono text-sm mr-1">↳</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-black mr-1.5"></span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${node.depth === 0 ? 'text-gray-900 font-bold' : 'text-gray-800'}`}>
                            {node.name}
                          </span>
                          {node.code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {node.code}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(
                              node.priority
                            )}`}
                          >
                            {node.priority} priority
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          Level {node.depth + 1} Node • {qCount} Questions Attached
                        </div>
                      </div>
                    </div>

                    {/* Actions: Add child subtopic, Edit, Delete */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(node.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold transition-colors"
                        title="Add child subtopic under this topic"
                      >
                        <Icons.Plus size={14} />
                        <span>Add Sub-topic</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(node)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                        title="Edit Topic"
                      >
                        <Icons.Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(node.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
      </div>

      {/* Add / Edit Topic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopic ? 'Edit Topic' : parentTopicName ? `Add Sub-topic under "${parentTopicName}"` : `Add Root Topic for ${currentSubject?.name}`}
        subtitle="Manage hierarchical topic properties"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Topic Name *
            </label>
            <input
              type="text"
              required
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Blood Relation, Direct Relationship, Divisibility"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Topic Code (Optional)
            </label>
            <input
              type="text"
              value={topicCode}
              onChange={(e) => setTopicCode(e.target.value)}
              placeholder="e.g. REA-BR-01"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TopicPriority)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="high">High Priority (Frequent in government exams)</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-semibold shadow-xs transition-colors"
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
            Deleting this topic will also remove any nested sub-topics below it. Questions will be unlinked.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteConfirmId) {
                  deleteTopic(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
            >
              Delete Topic
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

