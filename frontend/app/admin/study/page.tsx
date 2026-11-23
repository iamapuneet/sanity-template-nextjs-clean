'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Icons } from '@/components/admin/Icons'
import { CardsGridSkeleton } from '@/app/components/Shimmer'
import OperatingSystemStudyView from '@/components/study/OperatingSystemStudyView'

interface Subject {
  id: number
  name: string
  code: string
  description?: string
  icon?: string
}

interface Topic {
  id: number
  subject_id: number
  parent_id: number | null
  name: string
  level: number
  order_index?: number
  priority?: string
  is_completed?: boolean
}

function AdminStudyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialSubject = searchParams.get('subject') ? Number(searchParams.get('subject')) : 1
  const initialTopic = searchParams.get('topic') ? Number(searchParams.get('topic')) : 540

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(initialSubject)
  const [selectedTopicId, setSelectedTopicId] = useState<number>(initialTopic)
  const [loading, setLoading] = useState(true)
  const [searchTopic, setSearchTopic] = useState('')

  // Load subjects and topics from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [resSubs, resTops] = await Promise.all([
          fetch('/api/admin/subjects').then((r) => r.json()),
          fetch('/api/admin/topics').then((r) => r.json()),
        ])
        if (resSubs.success && resSubs.subjects.length > 0) {
          setSubjects(resSubs.subjects)
        }
        if (resTops.success && resTops.topics.length > 0) {
          setTopics(resTops.topics)
        }
      } catch (err) {
        console.error('Failed to load study data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Update query params when subject or topic changes
  const handleSelectSubject = (id: number) => {
    setSelectedSubjectId(id)
    const firstTop = topics.find((t) => t.subject_id === id && t.parent_id === null)
    const newTopicId = id === 1 ? 540 : (firstTop ? firstTop.id : 0)
    setSelectedTopicId(newTopicId)
    router.replace(`/admin/study?subject=${id}&topic=${newTopicId}`)
  }

  const handleSelectTopic = (id: number) => {
    setSelectedTopicId(id)
    router.replace(`/admin/study?subject=${selectedSubjectId}&topic=${id}`)
  }

  // Filter topics for the current subject
  const currentSubjectTopics = useMemo(() => {
    return topics.filter((t) => t.subject_id === selectedSubjectId)
  }, [topics, selectedSubjectId])

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId)
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics.find((t) => t.id === 540)

  // Is this topic or its ancestor Operating System?
  const isOperatingSystemModule = useMemo(() => {
    if (selectedTopicId === 540) return true
    const topicObj = topics.find((t) => t.id === selectedTopicId)
    if (topicObj && (topicObj.parent_id === 540 || topicObj.name.toLowerCase().includes('operating system'))) {
      return true
    }
    return false
  }, [selectedTopicId, topics])

  const filteredTopics = useMemo(() => {
    if (!searchTopic.trim()) return currentSubjectTopics
    return currentSubjectTopics.filter((t) =>
      t.name.toLowerCase().includes(searchTopic.toLowerCase())
    )
  }, [currentSubjectTopics, searchTopic])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] mb-1">
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/topics" className="hover:text-white transition-colors">Topics</Link>
            <span>/</span>
            <span className="text-[#FAFAFA]">Study Notes & Materials</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA] flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Icons.BookOpen size={20} />
            </span>
            Study Notes & Topic Guides
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            100% Native Next.js study guides with real-time simulators, interactive quizzes, and syllabus alignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/study"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#FAFAFA] border border-[#2e2e2e] text-xs font-semibold transition-colors"
          >
            <span>🌐 Student Portal View</span>
            <span className="text-[10px] text-[#71717A]">↗</span>
          </Link>
          <Link
            href="/admin/topics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#FAFAFA] border border-[#2e2e2e] text-xs font-semibold transition-colors"
          >
            <Icons.Topics size={14} />
            <span>Topic Hierarchy</span>
          </Link>
          <Link
            href="/admin/practice-tests"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#090909] text-xs font-semibold transition-colors"
          >
            <Icons.PracticeTests size={14} />
            <span>Practice Tests</span>
          </Link>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
          Select Study Subject
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId
            const topicCount = topics.filter((t) => t.subject_id === sub.id).length
            const hasActiveModule = sub.id === 1 // Computer Knowledge has OS notes

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSelectSubject(sub.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FAFAFA] text-[#090909] border-[#FAFAFA] shadow-md'
                    : 'bg-[#141414] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] border-[#262626]'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-black/10 text-black font-bold' : 'bg-[#202020] text-[#71717A]'
                  }`}
                >
                  {topicCount} Topics
                </span>
                {hasActiveModule && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Native Study Notes Available" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Grid: Topic Selector + Native Study Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#111111] rounded-2xl border border-[#262626] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAFAFA] flex items-center gap-1.5">
                <Icons.Topics size={14} className="text-[#71717A]" />
                {currentSubject?.name || 'Subject'} Topics
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {filteredTopics.length} available
              </span>
            </div>

            {/* Topic Search */}
            <div className="relative">
              <Icons.Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="w-full bg-[#181818] border border-[#262626] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-hidden focus:border-[#52525B]"
              />
            </div>

            {/* Topics List Scrollable */}
            <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-4 text-center text-xs text-[#71717A]">Loading topics...</div>
              ) : filteredTopics.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#71717A]">No topics found.</div>
              ) : (
                filteredTopics.map((topic) => {
                  const isSelected = topic.id === selectedTopicId
                  const isOperatingSystem = topic.id === 540 || topic.parent_id === 540
                  const isRoot = topic.parent_id === null

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border ${
                        isSelected
                          ? 'bg-[#1E1E1E] text-[#FAFAFA] border-blue-500/50 shadow-xs'
                          : 'bg-[#141414] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#181818] border-transparent'
                      }`}
                      style={{ paddingLeft: `${Math.max(12, (topic.level || 0) * 14 + 12)}px` }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {!isRoot && <span className="text-[#52525B] text-[10px] font-mono">↳</span>}
                        <span className={`truncate ${isRoot ? 'font-semibold text-white' : 'font-normal'}`}>
                          {topic.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isOperatingSystem && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/50">
                            Notes
                          </span>
                        )}
                        {topic.is_completed && (
                          <span className="text-emerald-400 text-[10px]" title="Completed">✓</span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#111111] rounded-2xl border border-[#262626] p-4 text-xs space-y-2.5">
            <div className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
              <span>💡 100% Native Next.js Components</span>
            </div>
            <p className="text-[#71717A] text-[11px] leading-relaxed">
              All 5 units, CPU Gantt scheduler, Banker's Algorithm safety tester, and Page Replacement simulators run smoothly as native React components with zero iframes.
            </p>
          </div>
        </div>

        {/* Right Column: Native Study Material Viewer (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {isOperatingSystemModule ? (
            <OperatingSystemStudyView isAdmin={true} />
          ) : (
            /* Fallback for topics without dedicated module yet */
            <div className="bg-[#111111] rounded-2xl border border-[#262626] p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mx-auto text-[#71717A]">
                <Icons.BookOpen size={24} />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-bold text-[#FAFAFA]">
                  {currentTopic ? currentTopic.name : 'Selected Topic'}
                </h3>
                <p className="text-xs text-[#71717A]">
                  Dedicated interactive simulator notes for this topic are currently being prepared. You can explore the completed Operating System notes module or practice tests.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubjectId(1)
                    setSelectedTopicId(540)
                    router.replace('/admin/study?subject=1&topic=540')
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Icons.BookOpen size={14} />
                  <span>View Operating System Notes (5 Units)</span>
                </button>
                <Link
                  href="/admin/practice-tests"
                  className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-[#FAFAFA] border border-[#333] text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Icons.PracticeTests size={14} />
                  <span>Practice Tests</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminStudyPage() {
  return (
    <Suspense fallback={<CardsGridSkeleton count={4} />}>
      <AdminStudyContent />
    </Suspense>
  )
}
