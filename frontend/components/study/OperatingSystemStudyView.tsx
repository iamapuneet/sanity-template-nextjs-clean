'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/admin/Icons'
import { OS_STUDY_UNITS, UnitData, TopicData } from './StudyUnitsData'
import CpuSchedulerSimulator from './CpuSchedulerSimulator'
import BankersAlgorithmSimulator from './BankersAlgorithmSimulator'
import PageReplacementSimulator from './PageReplacementSimulator'
import StudyQuizComponent from './StudyQuizComponent'

interface OperatingSystemStudyViewProps {
  isAdmin?: boolean
}

export default function OperatingSystemStudyView({ isAdmin = false }: OperatingSystemStudyViewProps) {
  const [activeUnit, setActiveUnit] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({})
  const [expandedQAs, setExpandedQAs] = useState<Record<string, boolean>>({})
  const [allExpanded, setAllExpanded] = useState<boolean>(false)
  const [activeTopicId, setActiveTopicId] = useState<string>('')

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('os_study_completed_topics')
      if (saved) {
        setCompletedTopics(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  // Toggle topic completion
  const handleToggleDone = (topicId: string) => {
    const next = { ...completedTopics, [topicId]: !completedTopics[topicId] }
    setCompletedTopics(next)
    try {
      localStorage.setItem('os_study_completed_topics', JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  // Toggle QA item
  const handleToggleQA = (qaKey: string) => {
    setExpandedQAs((prev) => ({ ...prev, [qaKey]: !prev[qaKey] }))
  }

  const handleToggleAllQA = () => {
    const nextState = !allExpanded
    setAllExpanded(nextState)
    const nextQAs: Record<string, boolean> = {}
    OS_STUDY_UNITS.forEach((u) => {
      u.topics.forEach((t) => {
        t.qas.forEach((_, qIdx) => {
          nextQAs[`${t.id}-${qIdx}`] = nextState
        })
      })
    })
    setExpandedQAs(nextQAs)
  }

  // Calculate total topics & progress
  const allTopics = useMemo(() => {
    return OS_STUDY_UNITS.flatMap((u) => u.topics)
  }, [])

  const totalTopicsCount = allTopics.length
  const completedCount = useMemo(() => {
    return Object.values(completedTopics).filter(Boolean).length
  }, [completedTopics])

  const completionPercent = totalTopicsCount > 0
    ? Math.round((completedCount / totalTopicsCount) * 100)
    : 0

  // Filter topics based on active unit and search query
  const displayedUnits = useMemo(() => {
    return OS_STUDY_UNITS.map((unit) => {
      // Check unit filter
      if (activeUnit !== 'all' && activeUnit !== unit.id) {
        return null
      }

      // Check search query
      const matchingTopics = unit.topics.filter((t) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          t.title.toLowerCase().includes(q) ||
          t.html.toLowerCase().includes(q) ||
          t.qas.some((qa) => qa.q.toLowerCase().includes(q) || qa.a.toLowerCase().includes(q))
        )
      })

      if (searchQuery.trim() && matchingTopics.length === 0) {
        return null
      }

      return {
        ...unit,
        topics: matchingTopics,
      }
    }).filter(Boolean) as UnitData[]
  }, [activeUnit, searchQuery])

  return (
    <div className="space-y-6">
      {/* Top Floating Control Bar */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/60">
                RTU KOTA &amp; RAJ_IA_2026
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Topic ID: 540 • 5 Units • Hinglish
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Operating System (OS) Complete Notes &amp; Interactive Lab
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Covers full syllabus theory, CPU scheduling, Banker's algorithm, demand paging, and Linux administration.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleToggleAllQA}
              className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-neutral-300 hover:text-white border border-[#333] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>{allExpanded ? 'Collapse All Q&A' : 'Expand All Q&A'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-neutral-300 hover:text-white border border-[#333] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>🖨️ Print / PDF</span>
            </button>
            <Link
              href={isAdmin ? '/admin/practice-tests' : '/practice'}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Icons.PracticeTests size={14} />
              <span>Take Mock Test</span>
            </Link>
          </div>
        </div>

        {/* Syllabus Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">
              Study Progress: <b className="text-white">{completedCount}</b> of{' '}
              <b className="text-white">{totalTopicsCount}</b> topics completed
            </span>
            <span className="text-emerald-400 font-bold">{completionPercent}%</span>
          </div>
          <div className="w-full bg-[#181818] rounded-full h-2 overflow-hidden border border-[#262626]">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Search & Unit Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#1F1F1F]">
          {/* Unit Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveUnit('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                activeUnit === 'all'
                  ? 'bg-white text-black border-white shadow-xs'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border-[#2A2A2A]'
              }`}
            >
              All Units (38)
            </button>
            {OS_STUDY_UNITS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setActiveUnit(u.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                  activeUnit === u.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-[#181818] text-neutral-400 hover:text-white border-[#2A2A2A]'
                }`}
              >
                Unit {u.number}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Icons.Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search OS topics (deadlock, paging, inode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {displayedUnits.length === 0 ? (
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center text-neutral-400 space-y-3">
          <p className="text-sm font-semibold text-white">No topics match "{searchQuery}"</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-[#202020] text-white text-xs font-semibold hover:bg-[#282828]"
          >
            Clear Search
          </button>
        </div>
      ) : (
        displayedUnits.map((unit) => (
          <div key={unit.id} className="space-y-4">
            {/* Unit Banner */}
            <div className="rounded-2xl bg-linear-to-r from-blue-900/50 via-slate-900/80 to-[#141414] border border-blue-800/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                <span>Unit {unit.number}</span>
                <span>•</span>
                <span>{unit.topics.length} Sections</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{unit.title}</h3>
              <p className="text-xs text-neutral-300 mt-0.5">{unit.desc}</p>
            </div>

            {/* Topics in this unit */}
            {unit.topics.map((topic) => {
              const isDone = Boolean(completedTopics[topic.id])

              return (
                <div
                  key={topic.id}
                  id={topic.id}
                  className={`bg-[#111111] border rounded-2xl p-5 sm:p-6 space-y-5 transition-all ${
                    isDone ? 'border-emerald-900/40 bg-emerald-950/5' : 'border-[#242424]'
                  }`}
                >
                  {/* Topic Header & Done Checkbox */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020] pb-3">
                    <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {topic.title}
                    </h4>

                    <label
                      onClick={() => handleToggleDone(topic.id)}
                      className="inline-flex items-center gap-2 text-xs font-mono cursor-pointer select-none px-3 py-1.5 rounded-xl bg-[#181818] border border-[#2B2B2B] hover:bg-[#202020] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        readOnly
                        className="rounded accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={isDone ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                        {isDone ? 'Completed ✓' : 'Maine padh liya'}
                      </span>
                    </label>
                  </div>

                  {/* Render HTML content with custom styled boxes */}
                  {topic.html && (
                    <div
                      className="study-content-prose text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: topic.html }}
                    />
                  )}

                  {/* Native Simulators embedded seamlessly */}
                  {topic.id === 'u1-cpusched' && (
                    <div className="pt-2">
                      <CpuSchedulerSimulator />
                    </div>
                  )}

                  {topic.id === 'u2-deadlock' && (
                    <div className="pt-2">
                      <BankersAlgorithmSimulator />
                    </div>
                  )}

                  {topic.id === 'u2-vm' && (
                    <div className="pt-2">
                      <PageReplacementSimulator />
                    </div>
                  )}

                  {/* Predicted Questions Accordion */}
                  {topic.qas && topic.qas.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <span>🎯 Predicted Exam Questions ({topic.qas.length})</span>
                      </div>
                      <div className="space-y-2">
                        {topic.qas.map((qa, qIdx) => {
                          const qaKey = `${topic.id}-${qIdx}`
                          const isOpen = Boolean(expandedQAs[qaKey])

                          return (
                            <div
                              key={qIdx}
                              className="rounded-xl border border-[#252525] bg-[#161616] overflow-hidden transition-colors"
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleQA(qaKey)}
                                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/60 shrink-0">
                                    {qa.marks}
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-white">
                                    {qa.q}
                                  </span>
                                </div>
                                <span className="text-neutral-400 text-xs font-mono shrink-0">
                                  {isOpen ? '▲ Hide' : '▼ Answer'}
                                </span>
                              </button>

                              {isOpen && (
                                <div
                                  className="p-3.5 text-xs text-neutral-300 border-t border-[#222] bg-[#121212] leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: qa.a }}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Unit MCQ Quiz Component */}
                  {topic.hasQuiz && unit.quiz && unit.quiz.length > 0 && (
                    <div className="pt-3">
                      <StudyQuizComponent
                        title={`Unit ${unit.number} MCQ Assessment Quiz`}
                        questions={unit.quiz}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      )}

      {/* Scoped CSS styles for original study diagrams & boxes */}
      <style jsx global>{`
        .study-content-prose .def {
          background-color: rgba(30, 58, 138, 0.2);
          border-left: 4px solid #3b82f6;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        .study-content-prose .def b.t {
          display: block;
          color: #60a5fa;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .study-content-prose .imp {
          background-color: rgba(120, 53, 15, 0.2);
          border-left: 4px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        .study-content-prose .imp b.t {
          display: block;
          color: #fbbf24;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .study-content-prose .exam {
          background-color: rgba(6, 78, 59, 0.2);
          border-left: 4px solid #10b981;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        .study-content-prose .exam b.t {
          display: block;
          color: #34d399;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .study-content-prose .ex {
          background-color: rgba(131, 24, 67, 0.2);
          border-left: 4px solid #ec4899;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        .study-content-prose .ex b.t {
          display: block;
          color: #f472b6;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .study-content-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.8rem;
          display: block;
          overflow-x: auto;
        }
        .study-content-prose th,
        .study-content-prose td {
          border: 1px solid #282828;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .study-content-prose th {
          background-color: #1a1a1a;
          color: #f4f4f5;
          font-weight: 600;
        }
        .study-content-prose code {
          font-family: Consolas, monospace;
          background-color: #1a1a1a;
          color: #93c5fd;
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.85em;
        }
        .study-content-prose pre {
          background-color: #0d0d0d;
          border: 1px solid #222;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          color: #e2e8f0;
          font-size: 0.8rem;
        }
        .study-content-prose ul,
        .study-content-prose ol {
          margin-left: 1.25rem;
          margin-top: 0.35rem;
          margin-bottom: 0.5rem;
        }
        .study-content-prose li {
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
        }
        .study-content-prose .fig {
          margin: 1rem 0;
          text-align: center;
        }
        .study-content-prose .fig svg {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          background-color: #141414;
          padding: 0.5rem;
          border: 1px solid #222;
        }
        .study-content-prose .fig .cap {
          font-size: 0.75rem;
          color: #71717a;
          margin-top: 0.35rem;
        }
        .study-content-prose svg text {
          fill: #e2e8f0;
          font-family: inherit;
        }
        .study-content-prose svg .c1 {
          fill: #1e3a8a;
          stroke: #3b82f6;
          stroke-width: 2;
        }
        .study-content-prose svg .c2 {
          fill: #064e3b;
          stroke: #10b981;
          stroke-width: 2;
        }
        .study-content-prose svg .c3 {
          fill: #78350f;
          stroke: #f59e0b;
          stroke-width: 2;
        }
        .study-content-prose svg .c4 {
          fill: #831843;
          stroke: #ec4899;
          stroke-width: 2;
        }
        .study-content-prose svg .c5 {
          fill: #581c87;
          stroke: #a855f7;
          stroke-width: 2;
        }
        .study-content-prose svg .c7 {
          fill: #262626;
          stroke: #52525b;
          stroke-width: 2;
        }
        .study-content-prose svg .ln,
        .study-content-prose svg .ar {
          stroke: #64748b;
          stroke-width: 2;
          fill: none;
        }
      `}</style>
    </div>
  )
}
