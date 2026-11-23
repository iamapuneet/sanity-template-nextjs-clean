'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Icons } from '@/components/admin/Icons'
import { CardsGridSkeleton } from '@/app/components/Shimmer'

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
  tests_count?: number
}

// Available curated study guide modules
const STUDY_MODULES: Record<number | string, {
  title: string
  subtitle: string
  fileUrl: string
  subjectId: number
  unitsCount: number
  hasSimulators: boolean
  hasQuizzes: boolean
  description: string
  units: { id: string; name: string; tag: string }[]
}> = {
  540: {
    title: 'Operating System (OS) — Complete Notes',
    subtitle: '5 Units • Interactive Gantt Schedulers • Banker\'s Deadlock • Page Replacement',
    fileUrl: '/study/operating-system.html',
    subjectId: 1,
    unitsCount: 5,
    hasSimulators: true,
    hasQuizzes: true,
    description: 'Master Operating Systems for Rajasthan Informatics Assistant & RTU Kota syllabus in Hinglish with visual diagrams and simulators.',
    units: [
      { id: 'u1', name: 'Unit 1: Overview & Structures', tag: 'Fundamentals' },
      { id: 'u2', name: 'Unit 2: CPU Scheduling & Deadlocks', tag: 'Core Theory' },
      { id: 'u3', name: 'Unit 3: Memory & Page Replacement', tag: 'Memory' },
      { id: 'u4', name: 'Unit 4: Linux & Shell Scripting', tag: 'Linux Basics' },
      { id: 'u5', name: 'Unit 5: Linux Admin & Automation', tag: 'Admin' },
      { id: 'sim', name: '⚡ Interactive Simulators', tag: 'Simulators' },
      { id: 'quiz', name: '📝 Exam Practice Quizzes', tag: 'Quizzes' },
    ]
  }
}

function StudyPortalContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialSubject = searchParams.get('subject') ? Number(searchParams.get('subject')) : 1
  const initialTopic = searchParams.get('topic') ? Number(searchParams.get('topic')) : 540

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(initialSubject)
  const [selectedTopicId, setSelectedTopicId] = useState<number>(initialTopic)
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [activeUnitAnchor, setActiveUnitAnchor] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch subjects and topics
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [resSubs, resTops] = await Promise.all([
          fetch('/api/student/subjects').then((r) => r.json()),
          fetch('/api/student/topics').then((r) => r.json()),
        ])
        if (resSubs.success && resSubs.subjects.length > 0) {
          setSubjects(resSubs.subjects)
        }
        if (resTops.success && resTops.topics.length > 0) {
          setTopics(resTops.topics)
        }
      } catch (err) {
        console.error('Failed to load study notes portal data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSelectSubject = (id: number) => {
    setSelectedSubjectId(id)
    const firstTop = topics.find((t) => t.subject_id === id && t.parent_id === null)
    const newTopicId = id === 1 ? 540 : (firstTop ? firstTop.id : 0)
    setSelectedTopicId(newTopicId)
    router.replace(`/study?subject=${id}&topic=${newTopicId}`)
  }

  const handleSelectTopic = (id: number) => {
    setSelectedTopicId(id)
    router.replace(`/study?subject=${selectedSubjectId}&topic=${id}`)
  }

  // Filter topics for the current subject
  const currentSubjectTopics = useMemo(() => {
    return topics.filter((t) => t.subject_id === selectedSubjectId)
  }, [topics, selectedSubjectId])

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId)
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics.find((t) => t.id === 540)

  const activeModule = useMemo(() => {
    if (STUDY_MODULES[selectedTopicId]) return STUDY_MODULES[selectedTopicId]
    const topicObj = topics.find((t) => t.id === selectedTopicId)
    if (topicObj && (topicObj.parent_id === 540 || topicObj.name.toLowerCase().includes('operating system'))) {
      return STUDY_MODULES[540]
    }
    return null
  }, [selectedTopicId, topics])

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return currentSubjectTopics
    return currentSubjectTopics.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentSubjectTopics, searchQuery])

  return (
    <div className="min-h-screen bg-[#090909] text-[#FAFAFA] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-950/60 via-[#121212] to-indigo-950/40 border border-blue-900/30 p-6 sm:p-8">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Icons.BookOpen size={14} />
              <span>Rajasthan Informatics Assistant Study Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Subject Study Notes & Interactive Lab
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Master core exam topics with detailed bilingual Hinglish notes, visual architectural diagrams, step-by-step algorithms, live simulators, and practice questions.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="#study-viewer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <span>Read Operating System Notes</span>
                <span>↓</span>
              </a>
              <Link
                href="/practice"
                className="px-4 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#262626] text-[#FAFAFA] border border-[#333] font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Icons.PracticeTests size={14} />
                <span>Go to Practice Mock Tests</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Subject Picker Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
            Select Subject
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subjects.map((sub) => {
              const isSelected = sub.id === selectedSubjectId
              const hasActiveModule = sub.id === 1

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
                  {hasActiveModule && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Notes
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Study Portal Layout: Topics Sidebar + Viewer */}
        <div id="study-viewer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Topics Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121212] rounded-2xl border border-[#262626] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Icons.Topics size={14} className="text-[#71717A]" />
                  {currentSubject?.name || 'Subject'} Syllabus
                </span>
                <span className="text-[10px] font-mono text-[#71717A]">
                  {filteredTopics.length} topics
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Icons.Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
                />
                <input
                  type="text"
                  placeholder="Filter syllabus topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Topics List */}
              <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="p-4 text-center text-xs text-[#71717A]">Loading syllabus...</div>
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
                            ? 'bg-[#1F1F1F] text-[#FAFAFA] border-blue-500/50 shadow-xs'
                            : 'bg-[#151515] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1B1B1B] border-transparent'
                        }`}
                        style={{ paddingLeft: `${Math.max(12, (topic.level || 0) * 14 + 12)}px` }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {!isRoot && <span className="text-[#52525B] text-[10px] font-mono">↳</span>}
                          <span className={`truncate ${isRoot ? 'font-semibold text-white' : 'font-normal'}`}>
                            {topic.name}
                          </span>
                        </div>

                        {isOperatingSystem && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/50 shrink-0">
                            Notes
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Quick Practice Promo */}
            <div className="bg-[#121212] rounded-2xl border border-[#262626] p-4 text-xs space-y-2.5">
              <div className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                <span>🎯 Test Your Knowledge</span>
              </div>
              <p className="text-[#71717A] text-[11px] leading-relaxed">
                After studying the notes, practice bilingual Rajasthan Informatics Assistant mock tests to boost your score.
              </p>
              <Link
                href="/practice"
                className="w-full py-2 px-3 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#333] text-center font-semibold text-xs block transition-colors"
              >
                Go to Practice Tests ➔
              </Link>
            </div>
          </div>

          {/* Viewer Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeModule ? (
              <div className="bg-[#121212] rounded-2xl border border-[#262626] overflow-hidden flex flex-col shadow-xl">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#161616] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/50">
                          {currentSubject?.code || 'CIT'}
                        </span>
                        <span className="text-[11px] text-[#71717A] font-mono">
                          {currentSubject?.name}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] mt-1">
                        {activeModule.title}
                      </h2>
                      <p className="text-xs text-[#A1A1AA]">{activeModule.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFullscreen(!fullscreen)}
                        className="px-3 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-[#FAFAFA] border border-[#3A3A3A] text-xs font-medium transition-colors"
                      >
                        {fullscreen ? 'Collapse' : 'Fullscreen'}
                      </button>
                      <a
                        href={activeModule.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Open in New Tab</span>
                        <span className="text-[11px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Unit Navigation Shortcuts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                    {activeModule.units.map((unit) => (
                      <a
                        key={unit.id}
                        href={`${activeModule.fileUrl}#${unit.id}`}
                        target="student_study_frame"
                        onClick={() => setActiveUnitAnchor(unit.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors border ${
                          activeUnitAnchor === unit.id
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-[#1C1C1C] text-[#A1A1AA] hover:text-[#FAFAFA] border-[#2C2C2C]'
                        }`}
                      >
                        {unit.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Iframe View */}
                <div className={`w-full bg-[#0B1220] transition-all relative ${fullscreen ? 'fixed inset-0 z-50 p-4 bg-black/95' : 'h-[750px]'}`}>
                  {fullscreen && (
                    <button
                      type="button"
                      onClick={() => setFullscreen(false)}
                      className="absolute top-6 right-6 z-50 px-4 py-2 bg-black/80 hover:bg-black text-white rounded-xl text-xs font-bold border border-white/20 shadow-xl"
                    >
                      ✕ Close Fullscreen
                    </button>
                  )}
                  <iframe
                    name="student_study_frame"
                    id="student_study_frame"
                    src={activeModule.fileUrl}
                    title={activeModule.title}
                    className="w-full h-full border-0 rounded-b-2xl bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] rounded-2xl border border-[#262626] p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#2C2C2C] flex items-center justify-center mx-auto text-[#71717A]">
                  <Icons.BookOpen size={24} />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-[#FAFAFA]">
                    {currentTopic ? currentTopic.name : 'Selected Topic'}
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Interactive study notes for this topic are being updated. You can study the full Operating System notes or take a practice test.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(1)
                      setSelectedTopicId(540)
                      router.replace('/study?subject=1&topic=540')
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Icons.BookOpen size={14} />
                    <span>View Operating System Notes (5 Units)</span>
                  </button>
                  <Link
                    href="/practice"
                    className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-[#FAFAFA] border border-[#333] text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Icons.PracticeTests size={14} />
                    <span>Go to Practice Tests</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudyPage() {
  return (
    <Suspense fallback={<CardsGridSkeleton count={4} />}>
      <StudyPortalContent />
    </Suspense>
  )
}
