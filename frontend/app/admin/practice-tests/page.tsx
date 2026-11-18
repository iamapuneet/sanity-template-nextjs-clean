'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'
import { TableSkeleton } from '@/app/components/Shimmer'

interface MockTest {
  id: number
  title: string
  slug: string
  description: string | null
  exam_id: number | null
  subject_id: number | null
  topic_id: number | null
  assessment_type: string
  duration_minutes: number
  total_questions: number
  total_marks: number
  passing_percentage: number
  difficulty_level: 'low' | 'medium' | 'high'
  status: string
  created_at: string
  exam_name?: string
  subject_name?: string
  subject_code?: string
  topic_name?: string
  main_topic_id?: number
  main_topic_name?: string
  actual_question_count?: number
  attempts_count?: number
  assigned_students_count?: number
  avg_score?: number
}

interface Subject {
  id: number
  name: string
  code: string
}

interface Topic {
  id: number
  subject_id: number
  parent_id: number | null
  name: string
  level: number
  parent_name?: string
}

function PracticeTestsContent() {
  const searchParams = useSearchParams()

  const [tests, setTests] = useState<MockTest[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [approvedQuestions, setApprovedQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all')
  const [selectedMainTopic, setSelectedMainTopic] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped')
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({})

  // Builder Modal (Create)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assessmentType, setAssessmentType] = useState<'mock' | 'sectional' | 'topic_test' | 'practice'>('mock')
  const [difficultyLevel, setDifficultyLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [durationMinutes, setDurationMinutes] = useState<number>(60)
  const [passingPercentage, setPassingPercentage] = useState<number>(40)
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(1.0)
  const [negativeMarksPerQuestion, setNegativeMarksPerQuestion] = useState<number>(0.25)
  const [builderSubjectId, setBuilderSubjectId] = useState<string>('all')
  const [builderTopicId, setBuilderTopicId] = useState<string>('all')
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])

  // Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<MockTest | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSubjectId, setEditSubjectId] = useState<string>('')
  const [editTopicId, setEditTopicId] = useState<string>('')
  const [editDuration, setEditDuration] = useState<number>(60)
  const [editPassingPct, setEditPassingPct] = useState<number>(40)
  const [editDifficulty, setEditDifficulty] = useState<'low' | 'medium' | 'high'>('medium')
  const [editStatus, setEditStatus] = useState<string>('published')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const loadAll = async () => {
    try {
      setLoading(true)
      const [resTests, resSubs, resTops, resQs] = await Promise.all([
        fetch('/api/admin/mock-tests').then((r) => r.json()),
        fetch('/api/admin/subjects').then((r) => r.json()),
        fetch('/api/admin/topics').then((r) => r.json()),
        fetch('/api/admin/questions?status=approved&limit=250').then((r) => r.json()),
      ])
      if (resTests.success) setTests(resTests.tests || [])
      if (resSubs.success) setSubjects(resSubs.subjects || [])
      if (resTops.success) setTopics(resTops.topics || [])
      if (resQs.success) setApprovedQuestions(resQs.questions || [])
    } catch (err) {
      console.error('Failed to load mock tests data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreate()
    }
  }, [searchParams])

  // Derive level 1 (Main Topics) grouped by subject
  const mainTopicsBySubject = useMemo(() => {
    const map: Record<number, Topic[]> = {}
    for (const t of topics) {
      if (t.level === 1 || !t.parent_id) {
        if (!map[t.subject_id]) map[t.subject_id] = []
        map[t.subject_id].push(t)
      }
    }
    return map
  }, [topics])

  // Get active list of main topics for current filter
  const currentSubjectMainTopics = useMemo(() => {
    if (selectedSubjectId === 'all') {
      // Return all unique main topics that have tests or exist
      const list: { name: string; count: number; subject_name: string }[] = []
      const topicCounts: Record<string, { count: number; subject_name: string }> = {}
      for (const t of tests) {
        const key = t.main_topic_name || 'General Drill'
        if (!topicCounts[key]) {
          topicCounts[key] = { count: 0, subject_name: t.subject_name || 'General' }
        }
        topicCounts[key].count++
      }
      for (const [name, meta] of Object.entries(topicCounts)) {
        list.push({ name, count: meta.count, subject_name: meta.subject_name })
      }
      return list.sort((a, b) => b.count - a.count)
    }

    const subId = Number(selectedSubjectId)
    const list: { name: string; count: number; subject_name: string }[] = []
    const mains = mainTopicsBySubject[subId] || []
    const subObj = subjects.find((s) => s.id === subId)
    const subName = subObj ? subObj.name : ''

    // Count tests per main topic in this subject
    const counts: Record<string, number> = {}
    for (const t of tests) {
      if (t.subject_id === subId) {
        const key = t.main_topic_name || 'General Drill'
        counts[key] = (counts[key] || 0) + 1
      }
    }

    for (const m of mains) {
      list.push({
        name: m.name,
        count: counts[m.name] || 0,
        subject_name: subName,
      })
    }

    // Also include any topic names from tests that might not be in mains
    for (const [name, cnt] of Object.entries(counts)) {
      if (!list.some((item) => item.name === name)) {
        list.push({ name, count: cnt, subject_name: subName })
      }
    }

    return list.sort((a, b) => b.count - a.count)
  }, [selectedSubjectId, tests, mainTopicsBySubject, subjects])

  // Filtered mock tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Subject filter
      if (selectedSubjectId !== 'all' && test.subject_id !== Number(selectedSubjectId)) {
        return false
      }
      // Main topic filter
      if (selectedMainTopic !== 'all' && (test.main_topic_name || 'General Drill') !== selectedMainTopic) {
        return false
      }
      // Difficulty filter
      if (filterDifficulty !== 'all' && test.difficulty_level !== filterDifficulty) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = test.title.toLowerCase().includes(q)
        const matchSub = (test.subject_name || '').toLowerCase().includes(q)
        const matchTopic = (test.topic_name || '').toLowerCase().includes(q)
        const matchMain = (test.main_topic_name || '').toLowerCase().includes(q)
        const matchDesc = (test.description || '').toLowerCase().includes(q)
        if (!matchTitle && !matchSub && !matchTopic && !matchMain && !matchDesc) {
          return false
        }
      }
      return true
    })
  }, [tests, selectedSubjectId, selectedMainTopic, filterDifficulty, searchQuery])

  // Group tests by Subject -> Main Topic
  const testsGroupedBySubjectAndTopic = useMemo(() => {
    const groups: {
      subject_id: number | null
      subject_name: string
      subject_code: string
      topics: {
        topic_name: string
        tests: MockTest[]
      }[]
    }[] = []

    const subMap: Record<string, { subject_id: number | null; subject_name: string; subject_code: string; topics: Record<string, MockTest[]> }> = {}

    for (const t of filteredTests) {
      const subKey = t.subject_name || 'General / Mixed'
      if (!subMap[subKey]) {
        subMap[subKey] = {
          subject_id: t.subject_id,
          subject_name: subKey,
          subject_code: t.subject_code || 'MIX',
          topics: {},
        }
      }
      const topicKey = t.main_topic_name || 'General Mock Tests'
      if (!subMap[subKey].topics[topicKey]) {
        subMap[subKey].topics[topicKey] = []
      }
      subMap[subKey].topics[topicKey].push(t)
    }

    for (const subKey of Object.keys(subMap)) {
      const sub = subMap[subKey]
      const topicList = Object.keys(sub.topics).map((topicName) => ({
        topic_name: topicName,
        tests: sub.topics[topicName],
      }))
      groups.push({
        subject_id: sub.subject_id,
        subject_name: sub.subject_name,
        subject_code: sub.subject_code,
        topics: topicList,
      })
    }

    return groups
  }, [filteredTests])

  // Handlers for Create Modal
  const handleOpenCreate = () => {
    setTitle('')
    setDescription('')
    setAssessmentType('mock')
    setDifficultyLevel('medium')
    setDurationMinutes(60)
    setPassingPercentage(40)
    setMarksPerQuestion(1.0)
    setNegativeMarksPerQuestion(0.25)
    setBuilderSubjectId(selectedSubjectId !== 'all' ? selectedSubjectId : 'all')
    setBuilderTopicId('all')
    setSelectedQuestionIds([])
    setIsBuilderOpen(true)
  }

  const toggleQuestionSelection = (qId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    )
  }

  const eligibleQuestions = approvedQuestions.filter((q) => {
    const matchSub = builderSubjectId === 'all' || q.subject_id === Number(builderSubjectId)
    const matchTop = builderTopicId === 'all' || q.topic_id === Number(builderTopicId)
    return matchSub && matchTop
  })

  const selectAllEligible = () => {
    const ids = eligibleQuestions.map((q) => q.id)
    setSelectedQuestionIds((prev) => Array.from(new Set([...prev, ...ids])))
  }

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return alert('Test title is required')
    if (selectedQuestionIds.length === 0) {
      return alert('Please select at least 1 question for this test.')
    }

    try {
      const payload = {
        title,
        description,
        assessment_type: assessmentType,
        difficulty_level: difficultyLevel,
        subject_id: builderSubjectId !== 'all' ? Number(builderSubjectId) : null,
        topic_id: builderTopicId !== 'all' ? Number(builderTopicId) : null,
        duration_minutes: durationMinutes,
        passing_percentage: passingPercentage,
        selected_question_ids: selectedQuestionIds,
        marks_per_question: marksPerQuestion,
        negative_marks_per_question: negativeMarksPerQuestion,
        status: 'published',
      }

      const res = await fetch('/api/admin/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        setIsBuilderOpen(false)
        loadAll()
      } else {
        alert(json.error || 'Failed to create assessment')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating assessment')
    }
  }

  // Handlers for Edit Modal
  const handleOpenEdit = (test: MockTest) => {
    setEditingTest(test)
    setEditTitle(test.title || '')
    setEditDescription(test.description || '')
    setEditSubjectId(test.subject_id ? String(test.subject_id) : '')
    setEditTopicId(test.topic_id ? String(test.topic_id) : '')
    setEditDuration(test.duration_minutes || 60)
    setEditPassingPct(test.passing_percentage || 40)
    setEditDifficulty(test.difficulty_level || 'medium')
    setEditStatus(test.status || 'published')
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTest) return

    try {
      setIsSavingEdit(true)
      const payload = {
        id: editingTest.id,
        title: editTitle,
        description: editDescription,
        subject_id: editSubjectId ? Number(editSubjectId) : null,
        topic_id: editTopicId ? Number(editTopicId) : null,
        duration_minutes: Number(editDuration),
        passing_percentage: Number(editPassingPct),
        difficulty_level: editDifficulty,
        status: editStatus,
      }

      const res = await fetch('/api/admin/mock-tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        setIsEditOpen(false)
        setEditingTest(null)
        loadAll()
      } else {
        alert(json.error || 'Failed to update mock test')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating mock test')
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleDeleteTest = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/mock-tests?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        loadAll()
      } else {
        alert(json.error || 'Failed to delete test')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleTopicCollapse = (topicKey: string) => {
    setCollapsedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }))
  }

  const totalCalculatedMarks = (selectedQuestionIds.length * marksPerQuestion).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              Mock Test Manager
            </span>
            <span className="text-xs text-[#71717A]">• Subject & Topic Hierarchical View</span>
          </div>
          <h1 className="text-2xl font-black text-[#FAFAFA] tracking-tight">
            Mock Tests & Practice Papers
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
            Manage practice drills categorized by Subject and Main Topics (e.g. Reasoning → Blood Relations).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/import-mock"
            className="px-3 py-2 rounded-xl bg-[#171717] border border-[#262626] hover:bg-[#202020] text-[#FAFAFA] font-medium text-xs transition-colors flex items-center gap-2"
          >
            <Icons.Plus size={14} />
            <span>AI / JSON Import</span>
          </Link>
          <Link
            href="/practice"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] hover:bg-[#202020] hover:border-[#3F3F46] text-[#FAFAFA] font-medium text-xs transition-colors flex items-center gap-2"
          >
            <Icons.CandidatePortal size={15} />
            <span>Student View ↗</span>
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Icons.Plus size={15} />
            <span>Create Test</span>
          </button>
        </div>
      </div>

      {/* Top Subject Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId('all')
              setSelectedMainTopic('all')
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#151515] border border-[#262626] text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Icons.Subjects size={14} />
            <span>All Subjects</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedSubjectId === 'all' ? 'bg-black/10 text-black' : 'bg-[#202020] text-[#71717A]'
              }`}
            >
              {tests.length}
            </span>
          </button>

          {subjects.map((sub) => {
            const count = tests.filter((t) => t.subject_id === sub.id).length
            const isSelected = selectedSubjectId === String(sub.id)
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setSelectedSubjectId(String(sub.id))
                  setSelectedMainTopic('all')
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#151515] border border-[#262626] text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-[#202020] text-[#71717A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Secondary Main Topic Filter Pills */}
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase flex items-center gap-1.5">
              <Icons.Topics size={13} />
              Main Topics Filter
            </span>
            {selectedMainTopic !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedMainTopic('all')}
                className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                Reset Topic Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedMainTopic('all')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedMainTopic === 'all'
                  ? 'bg-[#2A2A2A] text-white border border-[#404040]'
                  : 'bg-[#161616] text-[#A1A1AA] hover:text-white border border-[#222222]'
              }`}
            >
              <span>All Topics</span>
              <span className="text-[10px] font-mono text-[#71717A]">
                ({selectedSubjectId === 'all' ? tests.length : tests.filter((t) => t.subject_id === Number(selectedSubjectId)).length})
              </span>
            </button>

            {currentSubjectMainTopics.map((top) => {
              const isSelected = selectedMainTopic === top.name
              return (
                <button
                  key={top.name}
                  type="button"
                  onClick={() => setSelectedMainTopic(top.name)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                      : 'bg-[#161616] text-[#A1A1AA] hover:text-white border border-[#222222]'
                  }`}
                >
                  <span>{top.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? 'bg-amber-400/30 text-amber-200' : 'bg-[#202020] text-[#71717A]'
                    }`}
                  >
                    {top.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search & Layout View Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111111] p-3 rounded-2xl border border-[#262626]">
        <div className="flex flex-1 items-center gap-2.5">
          <div className="relative flex-1 max-w-md">
            <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" size={15} />
            <input
              type="text"
              placeholder="Search tests, topics, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#262626] bg-[#161616] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#262626] bg-[#161616] text-xs text-[#FAFAFA] focus:outline-none focus:border-[#52525B]"
          >
            <option value="all">All Difficulties</option>
            <option value="low">Low (सरल)</option>
            <option value="medium">Medium (मध्यम)</option>
            <option value="high">High (कठिन)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#71717A]">
            Showing <strong>{filteredTests.length}</strong> tests
          </span>
          <div className="flex items-center p-0.5 rounded-xl bg-[#161616] border border-[#262626]">
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grouped' ? 'bg-[#2A2A2A] text-white' : 'text-[#71717A] hover:text-white'
              }`}
              title="Group by Subject & Topic"
            >
              <Icons.Folder size={13} />
              <span>By Topic</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#2A2A2A] text-white' : 'text-[#71717A] hover:text-white'
              }`}
              title="All Grid View"
            >
              <Icons.Dashboard size={13} />
              <span>All Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <TableSkeleton cols={6} rows={5} />
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center text-[#71717A] bg-[#111111] rounded-2xl border border-[#262626] space-y-3">
          <p className="text-xs font-semibold text-[#A1A1AA]">No mock tests match your active filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId('all')
              setSelectedMainTopic('all')
              setSearchQuery('')
              setFilterDifficulty('all')
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#202020] text-white text-xs font-medium hover:bg-[#2A2A2A]"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        /* HIERARCHICAL SUBJECT -> TOPIC GROUPED VIEW */
        <div className="space-y-8">
          {testsGroupedBySubjectAndTopic.map((subGroup) => (
            <div key={subGroup.subject_name} className="space-y-4">
              {/* Subject Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-white">
                    <Icons.Subjects size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#FAFAFA] flex items-center gap-2">
                      <span>{subGroup.subject_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1A1A1A] text-[#A1A1AA] border border-[#2E2E2E]">
                        {subGroup.subject_code}
                      </span>
                    </h2>
                    <span className="text-[11px] text-[#71717A] font-mono">
                      {subGroup.topics.reduce((acc, t) => acc + t.tests.length, 0)} Tests in {subGroup.topics.length} Main Topics
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Topics Cards */}
              <div className="space-y-5">
                {subGroup.topics.map((topicItem) => {
                  const topicKey = `${subGroup.subject_name}-${topicItem.topic_name}`
                  const isCollapsed = collapsedTopics[topicKey] || false
                  return (
                    <div
                      key={topicItem.topic_name}
                      className="rounded-2xl bg-[#0D0D0D] border border-[#222222] overflow-hidden"
                    >
                      {/* Topic Card Header */}
                      <div
                        onClick={() => toggleTopicCollapse(topicKey)}
                        className="px-5 py-3.5 bg-[#141414] border-b border-[#222222] flex items-center justify-between cursor-pointer hover:bg-[#181818] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center">
                            <Icons.Folder size={14} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white tracking-tight">
                                {topicItem.topic_name}
                              </h3>
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#202020] text-[#A1A1AA] border border-[#2A2A2A]">
                                {topicItem.tests.length} {topicItem.tests.length === 1 ? 'Test' : 'Tests'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#71717A]">
                              Categorized drill papers under {subGroup.subject_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenCreate()
                              if (subGroup.subject_id) setBuilderSubjectId(String(subGroup.subject_id))
                            }}
                            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-[#FAFAFA] text-[11px] font-medium border border-[#2E2E2E]"
                          >
                            <Icons.Plus size={12} /> Add Test
                          </button>
                          <div className="text-[#71717A]">
                            {isCollapsed ? <Icons.ChevronDown size={16} /> : <Icons.ChevronUp size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Mock Tests Grid Under This Topic */}
                      {!isCollapsed && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {topicItem.tests.map((test) => (
                            <MockTestCard
                              key={test.id}
                              test={test}
                              onEdit={() => handleOpenEdit(test)}
                              onDelete={() => setDeleteConfirmId(test.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* FLAT GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <MockTestCard
              key={test.id}
              test={test}
              onEdit={() => handleOpenEdit(test)}
              onDelete={() => setDeleteConfirmId(test.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Mock Test Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setEditingTest(null)
        }}
        title="Edit Mock Test Details"
        subtitle="Manage test categorization, subject, topic, and parameters"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
              Test Title *
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Assigned Subject *
              </label>
              <select
                value={editSubjectId}
                onChange={(e) => {
                  setEditSubjectId(e.target.value)
                  setEditTopicId('')
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Assigned Topic / Subtopic
              </label>
              <select
                value={editTopicId}
                onChange={(e) => setEditTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="">Select Topic (Optional)</option>
                {topics
                  .filter((t) => !editSubjectId || t.subject_id === Number(editSubjectId))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.level === 1 ? `[Main] ${t.name}` : `↳ ${t.name}`}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                value={editDuration}
                onChange={(e) => setEditDuration(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B] font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Pass Percentage
              </label>
              <input
                type="number"
                value={editPassingPct}
                onChange={(e) => setEditPassingPct(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B] font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Difficulty
              </label>
              <select
                value={editDifficulty}
                onChange={(e) => setEditDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="low">Low Level (सरल)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="high">High (कठिन)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
              Publication Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
            >
              <option value="published">Published (Available for Assignment)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={() => {
                setIsEditOpen(false)
                setEditingTest(null)
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:bg-[#202020] hover:text-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingEdit}
              className="px-5 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isSavingEdit ? 'Saving...' : 'Update Mock Test'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Test Builder Modal (Create) */}
      <Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Practice Test Builder"
        subtitle="Select questions using checkboxes and configure test parameters"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveTest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Test Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reasoning — Blood Relations Mock Drill 03"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs placeholder-[#71717A] focus:outline-none focus:border-[#52525B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Assessment Type *
              </label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="mock">Full-Length Mock</option>
                <option value="sectional">Sectional Test</option>
                <option value="topic_test">Topic Test</option>
                <option value="practice">Practice Drill</option>
              </select>
            </div>
          </div>

          {/* Subject and Topic Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#141414] border border-[#262626]">
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Subject Classification *
              </label>
              <select
                value={builderSubjectId}
                onChange={(e) => {
                  setBuilderSubjectId(e.target.value)
                  setBuilderTopicId('all')
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#191919] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Topic Classification
              </label>
              <select
                value={builderTopicId}
                onChange={(e) => setBuilderTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#191919] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="all">All Topics</option>
                {topics
                  .filter((t) => builderSubjectId === 'all' || t.subject_id === Number(builderSubjectId))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.level === 1 ? `[Main Topic] ${t.name}` : `↳ ${t.name}`}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Difficulty
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B]"
              >
                <option value="low">Low (सरल)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="high">High (कठिन)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B] font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Marks / Q
              </label>
              <input
                type="number"
                step="0.25"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(parseFloat(e.target.value) || 1.0)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B] font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-medium text-[#71717A] uppercase mb-1">
                Negative Marks
              </label>
              <input
                type="number"
                step="0.05"
                value={negativeMarksPerQuestion}
                onChange={(e) => setNegativeMarksPerQuestion(parseFloat(e.target.value) || 0.25)}
                className="w-full px-3 py-2 rounded-xl border border-[#262626] bg-[#151515] text-[#FAFAFA] text-xs focus:outline-none focus:border-[#52525B] font-mono"
              />
            </div>
          </div>

          {/* Question Filter & Selection Section */}
          <div className="border border-[#262626] rounded-2xl p-4 bg-[#151515] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] font-mono font-bold text-[#FAFAFA] uppercase">
                Select Questions ({selectedQuestionIds.length} Selected • {totalCalculatedMarks} Total Marks)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllEligible}
                  className="px-2.5 py-1 rounded-lg bg-[#FAFAFA] text-[#090909] text-[11px] font-semibold hover:bg-[#E4E4E7]"
                >
                  Select All Visible ({eligibleQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuestionIds([])}
                  className="px-2.5 py-1 rounded-lg bg-[#202020] border border-[#262626] text-[#A1A1AA] text-[11px] font-medium hover:text-[#FAFAFA]"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Checkbox list of questions */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {eligibleQuestions.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#71717A]">
                  No approved questions matching selected filters.
                </div>
              ) : (
                eligibleQuestions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id)
                  return (
                    <label
                      key={q.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#191919] border-[#3F3F46]'
                          : 'bg-[#111111] border-[#262626] hover:border-[#3F3F46]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="mt-1 accent-white w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#71717A]">#{q.id}</span>
                          <span className="text-[10px] font-bold text-[#FAFAFA]">{q.subject_name}</span>
                          {q.topic_name && (
                            <span className="text-[10px] text-amber-300 font-mono">
                              • {q.topic_name}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#151515] text-[#A1A1AA] border border-[#262626]">
                            {q.language_code || 'en'}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] font-medium line-clamp-2 leading-relaxed">
                          {q.question_text}
                        </p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:bg-[#202020] hover:text-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-semibold transition-colors"
            >
              Save & Publish Test
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Mock Test"
        subtitle="Confirm mock test removal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Are you sure you want to delete this test? Student attempts and student assignments for this test will also be removed.
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
              onClick={() => deleteConfirmId && handleDeleteTest(deleteConfirmId)}
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

function MockTestCard({
  test,
  onEdit,
  onDelete,
}: {
  test: MockTest
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#3F3F46] transition-all flex flex-col justify-between group">
      <div>
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#171717] text-[#FAFAFA] border border-[#2E2E2E]">
              {test.assessment_type}
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                test.difficulty_level === 'high'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                  : test.difficulty_level === 'low'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              }`}
            >
              {test.difficulty_level || 'medium'}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
              test.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {test.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#FAFAFA] mb-1.5 leading-snug group-hover:text-amber-300 transition-colors">
          {test.title}
        </h3>

        {/* Category Pills (Subject & Subtopic) */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {test.subject_name && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#181818] text-[#D4D4D8] border border-[#2A2A2A]">
              {test.subject_name}
            </span>
          )}
          {test.topic_name && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 truncate max-w-[180px]">
              {test.topic_name}
            </span>
          )}
        </div>

        <p className="text-xs text-[#A1A1AA] line-clamp-2 mb-4 leading-relaxed">
          {test.description || 'Practice test with selected syllabus questions.'}
        </p>
      </div>

      <div>
        {/* Metric Triplet */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-[#1F1F1F] text-center text-xs text-[#71717A] mb-3 bg-[#151515] border border-[#262626] rounded-xl p-2 font-mono">
          <div>
            <div className="font-bold text-[#FAFAFA] text-xs">
              {test.actual_question_count || test.total_questions}
            </div>
            <div className="text-[9px] text-[#71717A] uppercase">Questions</div>
          </div>
          <div>
            <div className="font-bold text-[#FAFAFA] text-xs">{test.duration_minutes}m</div>
            <div className="text-[9px] text-[#71717A] uppercase">Duration</div>
          </div>
          <div>
            <div className="font-bold text-[#FAFAFA] text-xs">
              {Number(test.total_marks || 0).toFixed(0)}
            </div>
            <div className="text-[9px] text-[#71717A] uppercase">Marks</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#71717A] mb-3 font-mono text-[11px]">
          <span>
            Assigned: <strong className="text-emerald-400">{test.assigned_students_count || 0} students</strong>
          </span>
          <span>
            Attempts: <strong className="text-[#FAFAFA]">{test.attempts_count || 0}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Link
            href={`/practice/${test.id}`}
            target="_blank"
            className="flex-1 py-1.5 px-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            <span>Preview ↗</span>
          </Link>

          <Link
            href={`/admin/assignments`}
            className="py-1.5 px-2.5 rounded-xl bg-[#181818] border border-[#2E2E2E] hover:bg-[#222222] text-[#FAFAFA] text-xs font-medium transition-colors"
            title="Assign test to students"
          >
            <Icons.Assignments size={14} />
          </Link>

          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-xl bg-[#181818] border border-[#2E2E2E] hover:bg-[#222222] text-[#A1A1AA] hover:text-white transition-colors"
            title="Edit Test Details"
          >
            <Icons.Edit size={14} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-xl bg-[#181818] border border-[#2E2E2E] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900/40 text-[#71717A] transition-colors"
            title="Delete Test"
          >
            <Icons.Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PracticeTestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#71717A]">Loading Practice Tests...</div>}>
      <PracticeTestsContent />
    </Suspense>
  )
}
