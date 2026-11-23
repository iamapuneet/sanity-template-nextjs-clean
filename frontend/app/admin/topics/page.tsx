'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'
import { CardsGridSkeleton } from '@/app/components/Shimmer'

export default function TopicsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [completionTab, setCompletionTab] = useState<'all' | 'completed' | 'pending'>('all')
  const [togglingId, setTogglingId] = useState<number | null>(null)

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
  const subjectTopics = useMemo(() => {
    return topics.filter((t) => t.subject_id === selectedSubjectId)
  }, [topics, selectedSubjectId])

  // Aggregate completion stats
  const completedInSubject = useMemo(() => {
    return subjectTopics.filter((t) => t.is_completed).length
  }, [subjectTopics])

  const totalInSubject = subjectTopics.length
  const pendingInSubject = totalInSubject - completedInSubject
  const subjectPercentage = totalInSubject > 0 ? Math.round((completedInSubject / totalInSubject) * 100) : 0

  const totalAllTopics = topics.length
  const completedAllTopics = useMemo(() => {
    return topics.filter((t) => t.is_completed).length
  }, [topics])
  const overallPercentage = totalAllTopics > 0 ? Math.round((completedAllTopics / totalAllTopics) * 100) : 0

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

  const flattenedTree = useMemo(() => buildTree(null, 0), [subjectTopics])

  // Map each topic to its child count
  const childCountMap = useMemo(() => {
    const map = new Map<number, number>()
    topics.forEach((t) => {
      if (t.parent_id) {
        map.set(t.parent_id, (map.get(t.parent_id) || 0) + 1)
      }
    })
    return map
  }, [topics])

  // Map each topic to breadcrumb string
  const breadcrumbMap = useMemo(() => {
    const topicById = new Map<number, any>()
    topics.forEach((t) => topicById.set(t.id, t))

    const map = new Map<number, string>()
    topics.forEach((t) => {
      const parts: string[] = []
      let curr = t.parent_id ? topicById.get(t.parent_id) : null
      while (curr) {
        parts.unshift(curr.name)
        curr = curr.parent_id ? topicById.get(curr.parent_id) : null
      }
      map.set(t.id, parts.join(' › '))
    })
    return map
  }, [topics])

  // Filter based on tab and search
  const displayedTree = useMemo(() => {
    let list = flattenedTree

    if (completionTab === 'completed') {
      list = list.filter((t) => t.is_completed)
    } else if (completionTab === 'pending') {
      list = list.filter((t) => !t.is_completed)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(q))
    }

    return list
  }, [flattenedTree, completionTab, search])

  // Toggle completion handler
  const handleToggleCompletion = async (topic: any, cascade: boolean = false) => {
    const newStatus = !topic.is_completed
    setTogglingId(topic.id)

    // Optimistic UI update
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topic.id) {
          return {
            ...t,
            is_completed: newStatus,
            completed_at: newStatus ? new Date().toISOString() : null,
            status: newStatus ? 'completed' : 'active',
          }
        }
        return t
      })
    )

    try {
      const res = await fetch('/api/admin/topics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: topic.id,
          is_completed: newStatus,
          cascade,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        alert(json.error || 'Failed to update topic completion')
        loadData()
      } else if (cascade) {
        loadData()
      }
    } catch (err) {
      console.error(err)
      loadData()
    } finally {
      setTogglingId(null)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#FAFAFA] tracking-tight">
              Syllabus & Topic Tracker
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1A1A1A] text-[#FAFAFA] border border-[#333]">
              {totalAllTopics} Topics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Track completed topics, syllabus hierarchy, and study progress across all subjects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/study"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#FAFAFA] border border-[#2e2e2e] text-xs font-semibold transition-colors"
          >
            <Icons.BookOpen size={15} />
            <span>Study Notes & Materials</span>
          </Link>
          <button
            type="button"
            onClick={() => handleOpenAdd(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-semibold transition-colors"
          >
            <Icons.Plus size={15} />
            <span>Add Root Topic</span>
          </button>
        </div>
      </div>

      {/* Syllabus Completion Summary Card */}
      <div className="bg-[#111111] rounded-2xl border border-[#262626] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold text-[#FAFAFA]">
                {currentSubject?.name || 'Subject'} Completion Progress
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                {subjectPercentage}% Completed
              </span>
            </div>
            <p className="text-xs text-[#71717A]">
              <span className="text-emerald-400 font-semibold">{completedInSubject}</span> completed •{' '}
              <span className="text-amber-400 font-semibold">{pendingInSubject}</span> pending out of{' '}
              <span className="text-[#FAFAFA] font-semibold">{totalInSubject}</span> topics in this subject.
            </p>
          </div>

          {/* Overall Syllabus Progress Meter */}
          <div className="flex items-center gap-4 bg-[#161616] px-4 py-2.5 rounded-xl border border-[#262626]">
            <div>
              <div className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Overall Syllabus</div>
              <div className="text-xs font-bold font-mono text-[#FAFAFA] mt-0.5">
                {completedAllTopics} / {totalAllTopics} Topics ({overallPercentage}%)
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center text-[11px] font-bold font-mono text-emerald-300">
              {overallPercentage}%
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#181818] rounded-full h-2.5 overflow-hidden border border-[#262626]">
          <div
            className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${subjectPercentage}%` }}
          />
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="bg-[#111111] rounded-2xl border border-[#262626] p-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => {
            const subTopicsList = topics.filter((t) => t.subject_id === sub.id)
            const mainCount = subTopicsList.filter((t) => t.parent_id === null || t.level === 1).length
            const subCompleted = subTopicsList.filter((t) => t.is_completed).length
            const isSelected = sub.id === selectedSubjectId

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#191919] text-[#FAFAFA] border border-[#3F3F46] font-semibold shadow-sm'
                    : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#151515] border border-transparent'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-white text-black' : 'bg-[#181818] text-[#A1A1AA] border border-[#262626]'
                  }`}
                  title={`${mainCount} Main Topics (${subTopicsList.length} total)`}
                >
                  {mainCount}
                </span>
                {subCompleted > 0 && (
                  <span
                    className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                    title={`${subCompleted} completed`}
                  >
                    ✓ {subCompleted}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls & Filter Tab Bar */}
      <div className="bg-[#111111] rounded-2xl border border-[#262626] p-3 sm:p-4 space-y-3">
        {/* Completion Status Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setCompletionTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                completionTab === 'all'
                  ? 'bg-[#202020] text-[#FAFAFA] border border-[#3F3F46] font-semibold'
                  : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#161616] border border-transparent'
              }`}
            >
              <span>All Topics</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#161616] text-[#A1A1AA] border border-[#262626]">
                {totalInSubject}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCompletionTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                completionTab === 'completed'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/60 font-semibold'
                  : 'text-[#71717A] hover:text-emerald-400 hover:bg-[#161616] border border-transparent'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Completed</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  completionTab === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-600/40'
                    : 'bg-[#161616] text-emerald-400/80 border border-[#262626]'
                }`}
              >
                {completedInSubject}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCompletionTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                completionTab === 'pending'
                  ? 'bg-amber-950/50 text-amber-300 border border-amber-600/60 font-semibold'
                  : 'text-[#71717A] hover:text-amber-400 hover:bg-[#161616] border border-transparent'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Pending</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  completionTab === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-600/40'
                    : 'bg-[#161616] text-amber-400/80 border border-[#262626]'
                }`}
              >
                {pendingInSubject}
              </span>
            </button>
          </div>

          <div className="text-xs font-mono font-medium text-[#71717A]">
            Showing {displayedTree.length} {completionTab} nodes in {currentSubject?.name}
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full">
          <Icons.Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]"
          />
          <input
            type="text"
            placeholder={`Search ${completionTab === 'all' ? 'all' : completionTab} topics in ${currentSubject?.name || 'subject'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
          />
        </div>
      </div>

      {/* Tree / List Display */}
      <div className="bg-[#111111] rounded-2xl border border-[#262626] overflow-hidden">
        <div className="p-4 bg-[#151515] border-b border-[#262626] flex items-center justify-between text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Icons.Topics size={15} />
            {currentSubject?.name} •{' '}
            {completionTab === 'all'
              ? 'Syllabus Hierarchy'
              : completionTab === 'completed'
              ? 'Completed Topics'
              : 'Pending Topics to Study'}
          </span>
          <span>Status & Actions</span>
        </div>

        {loading ? (
          <CardsGridSkeleton count={6} />
        ) : displayedTree.length === 0 ? (
          <div className="p-12 text-center text-[#71717A] space-y-3">
            {completionTab === 'completed' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/40">
                  <Icons.Check size={22} />
                </div>
                <p className="text-sm font-semibold text-[#FAFAFA]">No completed topics in this subject yet.</p>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  Click the "Mark Done" button next to any topic in the "All Topics" tab when you finish studying it.
                </p>
                <button
                  type="button"
                  onClick={() => setCompletionTab('all')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#202020] text-[#FAFAFA] border border-[#333] text-xs font-semibold hover:bg-[#282828]"
                >
                  View All Topics
                </button>
              </>
            ) : completionTab === 'pending' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/40">
                  <Icons.Check size={22} />
                </div>
                <p className="text-sm font-semibold text-emerald-300">
                  🎉 All topics in {currentSubject?.name} are completed!
                </p>
                <p className="text-xs text-[#71717A]">
                  You have completed 100% of the topics in this subject. Keep up the great work!
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-[#A1A1AA]">No topics match your search query.</p>
                <button
                  type="button"
                  onClick={() => handleOpenAdd(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAFAFA] text-[#090909] text-xs font-semibold hover:bg-[#E4E4E7]"
                >
                  <Icons.Plus size={14} /> Add First Root Topic
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#1F1F1F]">
            {displayedTree.map((node) => {
              const indentPadding = completionTab === 'all' ? Math.min(node.depth * 28, 140) : 0
              const hasChildren = (childCountMap.get(node.id) || 0) > 0
              const breadcrumb = breadcrumbMap.get(node.id)
              const isToggling = togglingId === node.id

              return (
                <div
                  key={node.id}
                  className={`p-3.5 sm:p-4 hover:bg-[#151515]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    node.is_completed ? 'bg-emerald-950/10' : ''
                  }`}
                  style={{ paddingLeft: `${Math.max(16, indentPadding + 16)}px` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Level / Bullet Icon */}
                    <div className="flex items-center text-[#71717A] shrink-0">
                      {completionTab === 'all' && node.depth > 0 ? (
                        <span className="text-[#52525B] font-mono text-xs mr-1">↳</span>
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            node.is_completed ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-[#FAFAFA]'
                          }`}
                        ></span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      {/* Breadcrumb if in Completed / Pending flat view */}
                      {completionTab !== 'all' && breadcrumb && (
                        <div className="text-[10px] text-[#71717A] truncate font-mono">
                          {breadcrumb}
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm ${
                            node.is_completed
                              ? 'text-emerald-300 font-semibold line-through decoration-emerald-500/50'
                              : node.depth === 0
                              ? 'text-[#FAFAFA] font-bold'
                              : 'text-[#A1A1AA] font-medium'
                          }`}
                        >
                          {node.name}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                            node.priority === 'high'
                              ? 'bg-[#191919] text-[#FAFAFA] border-[#3F3F46]'
                              : 'bg-[#151515] text-[#71717A] border-[#262626]'
                          }`}
                        >
                          {node.priority}
                        </span>

                        {/* Status tag */}
                        {node.is_completed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-700/60">
                            <Icons.Check size={11} className="text-emerald-400 stroke-[3]" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/30 text-amber-400/90 border border-amber-800/30">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-[#71717A] font-mono flex items-center gap-2 flex-wrap">
                        <span>Level {node.depth + 1} Node</span>
                        <span>•</span>
                        <span>{node.questions_count || 0} Questions Linked</span>
                        {node.completed_at && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400/80">
                              Marked done on {new Date(node.completed_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Completion Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* One-Click Completion Toggle Button */}
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleCompletion(node, false)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        node.is_completed
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60 hover:border-emerald-500'
                          : 'bg-[#181818] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#222222] border border-[#262626]'
                      } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
                      title={node.is_completed ? 'Click to mark as pending' : 'Click to mark as completed'}
                    >
                      {node.is_completed ? (
                        <>
                          <Icons.Check size={13} className="text-emerald-400 stroke-[3]" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border border-[#52525B] flex items-center justify-center group-hover:border-[#A1A1AA]" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>

                    {/* Cascade complete children (if node has children) */}
                    {hasChildren && (
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleToggleCompletion(node, true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#262626] text-[11px] font-mono transition-colors"
                        title={
                          node.is_completed
                            ? 'Mark this topic & all subtopics as pending'
                            : 'Mark this topic & all subtopics as completed'
                        }
                      >
                        <span>{node.is_completed ? 'Reset All' : 'All Subtopics Done'}</span>
                      </button>
                    )}

                    {/* Study Notes Jump Button */}
                    <Link
                      href={`/admin/study?subject=${node.subject_id}&topic=${node.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] hover:text-[#FAFAFA] text-[#A1A1AA] border border-[#262626] text-xs font-medium transition-colors"
                      title="Open Study Notes & Materials for this topic"
                    >
                      <Icons.BookOpen size={13} />
                      <span className="hidden md:inline">Notes</span>
                    </Link>

                    {/* Add nested subtopic */}
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(node.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#171717] hover:bg-[#202020] hover:border-[#3F3F46] border border-[#262626] text-[#FAFAFA] text-xs font-medium transition-colors"
                      title="Add nested subtopic"
                    >
                      <Icons.Plus size={13} />
                      <span className="hidden sm:inline">Add Sub-topic</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(node)}
                      className="p-1.5 rounded-xl text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#202020] transition-colors"
                      title="Edit Topic"
                    >
                      <Icons.Edit size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(node.id)}
                      className="p-1.5 rounded-xl text-[#71717A] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Delete Topic"
                    >
                      <Icons.Trash size={14} />
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
            <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
              Topic Name *
            </label>
            <input
              type="text"
              required
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Blood Relation, Direct Relationship, CPU Architecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
              Exam Weightage Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
            >
              <option value="high" className="bg-[#151515] text-[#FAFAFA]">
                High Priority (High frequency in government exams)
              </option>
              <option value="medium" className="bg-[#151515] text-[#FAFAFA]">
                Medium Priority
              </option>
              <option value="low" className="bg-[#151515] text-[#FAFAFA]">
                Low Priority
              </option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:bg-[#202020] hover:text-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-semibold transition-colors"
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
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Deleting this topic node will delete its children subtopics and decouple associated questions. This action is permanent.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:bg-[#202020] hover:text-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-2 rounded-xl bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-900/50 hover:text-red-300 text-xs font-medium transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
