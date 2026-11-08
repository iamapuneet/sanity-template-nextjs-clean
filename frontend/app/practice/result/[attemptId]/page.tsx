'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/admin/Icons'

export default function ExamResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Expandable question solutions
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/student/attempts/${attemptId}`)
        const json = await res.json()
        if (json.success) {
          setData(json)
          // Default all explanations to open
          const defaultOpen: Record<number, boolean> = {}
          json.answers?.forEach((a: any) => {
            defaultOpen[a.question_id] = true
          })
          setExpandedSolutions(defaultOpen)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [attemptId])

  const toggleSolution = (qId: number) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }))
  }

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '0s'
    const m = Math.floor(sec / 60)
    const s = sec % 60
    if (m === 0) return `${s}s`
    return `${m}m ${s}s`
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Calculating score and per-question timing analytics...
          </p>
        </div>
      </div>
    )
  }

  const { attempt, answers = [] } = data

  // Time Analysis metrics
  const timesArray = answers.map((a: any) => Number(a.time_spent_seconds || 0))
  const maxTime = Math.max(...timesArray, 1)
  const minTime = Math.min(...timesArray)
  const avgTime = timesArray.length > 0 ? Math.round(timesArray.reduce((a: number, b: number) => a + b, 0) / timesArray.length) : 0

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black text-white px-4 md:px-8 py-3.5 border-b border-neutral-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-xs">
            EF
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base leading-tight">
              Test Performance & Time Analysis
            </h1>
            <div className="text-[10px] text-neutral-400 font-mono">
              Attempt #{attempt.id} • Candidate: {attempt.student_name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
          >
            Practice Portal
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Top Scorecard Banner */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                attempt.passed ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {attempt.passed ? '✓ PASSED EXAMINATION' : '⚠ RETAKE RECOMMENDED'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
              {attempt.assessment_title}
            </h2>
            <p className="text-xs text-gray-600">
              ExamForge Automated Server-Side Scoring & Question-Level Timing Breakdown.
            </p>
          </div>

          {/* Large Score Metric */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 shrink-0">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black font-mono text-black">
                {Number(attempt.obtained_marks).toFixed(2)}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                Marks out of {Number(attempt.total_marks).toFixed(0)}
              </div>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black font-mono text-black">
                {Number(attempt.percentage).toFixed(0)}%
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                Percentage
              </div>
            </div>
          </div>
        </div>

        {/* Detailed KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase">Correct Answers</div>
            <div className="text-2xl font-black font-mono text-black mt-1">
              {attempt.correct_answers}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">+{attempt.correct_answers * 1.0} Marks</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase">Wrong Answers</div>
            <div className="text-2xl font-black font-mono text-black mt-1">
              {attempt.incorrect_answers}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              -{Number(attempt.incorrect_answers * 0.25).toFixed(2)} Penalty
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase">Accuracy</div>
            <div className="text-2xl font-black font-mono text-black mt-1">
              {Number(attempt.accuracy || 0).toFixed(0)}%
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Correct / Attempted</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase">Total Test Time</div>
            <div className="text-2xl font-black font-mono text-black mt-1">
              {formatSeconds(attempt.time_taken_seconds)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Avg: {formatSeconds(avgTime)} / Question</div>
          </div>
        </div>

        {/* Per-Question Time Analysis Highlights */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Icons.Clock size={18} />
                Question Time Tracking & Speed Breakdown
              </h3>
              <p className="text-xs text-gray-500">
                Detailed measurement of seconds spent by the student on each question.
              </p>
            </div>
            <div className="text-xs font-mono text-gray-600">
              Fastest: <strong>{formatSeconds(minTime)}</strong> • Slowest: <strong>{formatSeconds(maxTime)}</strong>
            </div>
          </div>

          {/* Quick horizontal bars comparing time spent */}
          <div className="space-y-2 pt-1">
            {answers.map((ans: any, idx: number) => {
              const sec = Number(ans.time_spent_seconds || 0)
              const pct = maxTime > 0 ? Math.max(10, Math.round((sec / maxTime) * 100)) : 10

              return (
                <div key={ans.answer_id} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-mono font-bold text-gray-600 shrink-0">
                    Q#{idx + 1}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ans.is_correct === 1 ? 'bg-black' : 'bg-gray-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-black shrink-0">
                    {formatSeconds(sec)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Solutions & Step-by-Step Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black tracking-tight">
            Detailed Solutions & Explanations (व्याख्या)
          </h3>

          <div className="space-y-4">
            {answers.map((ans: any, idx: number) => {
              const isExpanded = expandedSolutions[ans.question_id]
              const isCorrect = ans.is_correct === 1
              const isUnanswered = !ans.selected_option_key

              let statusBadge = 'bg-black text-white'
              let statusText = 'Correct (+1.00)'
              if (isUnanswered) {
                statusBadge = 'bg-gray-100 text-gray-600 border border-gray-300'
                statusText = 'Unanswered (0.00)'
              } else if (!isCorrect) {
                statusBadge = 'bg-gray-200 text-gray-900 border border-gray-400'
                statusText = 'Incorrect (-0.25)'
              }

              return (
                <div
                  key={ans.answer_id}
                  className="rounded-2xl bg-white border border-gray-200 p-5 md:p-6 shadow-xs space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-black text-white font-mono font-bold text-xs">
                        Question {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-black">{ans.subject_name}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{ans.topic_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Exact Time Badge */}
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-black border border-gray-200 flex items-center gap-1">
                        <Icons.Clock size={12} />
                        Time Spent: {formatSeconds(ans.time_spent_seconds)}
                      </span>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${statusBadge}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Question Statement */}
                  <h4 className="text-base font-bold text-gray-900 leading-relaxed">
                    {ans.question_text}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ans.options?.map((opt: any) => {
                      const isSelectedByStudent = ans.selected_option_key === opt.key
                      const isOptionCorrect = Boolean(opt.isCorrect)

                      let optStyle = 'border-gray-200 bg-white text-gray-700'
                      if (isOptionCorrect) {
                        optStyle = 'border-black bg-neutral-100 text-black font-bold ring-1 ring-black'
                      } else if (isSelectedByStudent && !isOptionCorrect) {
                        optStyle = 'border-gray-400 bg-gray-50 text-gray-900 line-through'
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                isOptionCorrect ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                            {isOptionCorrect && (
                              <span className="px-1.5 py-0.2 rounded bg-black text-white">
                                Correct Answer
                              </span>
                            )}
                            {isSelectedByStudent && (
                              <span className="px-1.5 py-0.2 rounded bg-gray-200 text-gray-800">
                                Your Choice
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation Block */}
                  {ans.explanation && (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 space-y-1">
                      <span className="font-bold text-black uppercase text-[10px] block">
                        Detailed Explanation / व्याख्या:
                      </span>
                      <p className="leading-relaxed">{ans.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/practice"
            className="px-6 py-3 rounded-2xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Take Another Practice Test
          </Link>
          <Link
            href="/admin/results"
            className="px-6 py-3 rounded-2xl bg-white border border-gray-300 text-black font-bold text-xs hover:bg-gray-100 transition-colors"
          >
            Open Admin Analytics
          </Link>
        </div>
      </div>
    </div>
  )
}

