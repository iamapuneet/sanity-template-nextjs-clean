'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/admin/Icons'

interface Option {
  id: number
  key: string
  text: string
}

interface Question {
  assessment_question_id: number
  question_id: number
  order_index: number
  marks: string | number
  negative_marks: string | number
  question_text: string
  question_type: string
  difficulty: string
  language_code: string
  subject_name: string
  topic_name: string
  options: Option[]
}

export default function ExamLiveInterface({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('student_id') || '1'

  const [assessment, setAssessment] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Current active question index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Student Responses State:
  // Map of question_id -> selected_option_key ('A', 'B', 'C', 'D' or null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({})

  // Question Status State:
  // Map of question_id -> 'answered' | 'marked_for_review' | 'visited_unanswered' | 'not_visited'
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, string>>({})

  // Per-Question Time Tracking State:
  // Map of question_id -> total seconds spent on this question
  const [perQuestionSeconds, setPerQuestionSeconds] = useState<Record<number, number>>({})

  // Active question start timestamp to record time accurately
  const questionStartTimeRef = useRef<number>(Date.now())

  // Overall test countdown timer
  const [remainingSeconds, setRemainingSeconds] = useState<number>(3600)
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0)

  // Live seconds ticking on current question
  const [currentQSeconds, setCurrentQSeconds] = useState<number>(0)

  // Confirm Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 1. Initialize Test & Attempt
  useEffect(() => {
    const initTest = async () => {
      try {
        setLoading(true)

        // Fetch assessment questions
        const resTest = await fetch(`/api/student/assessments/${id}`)
        const jsonTest = await resTest.json()

        if (!jsonTest.success) {
          alert(jsonTest.error || 'Failed to load test')
          router.push('/practice')
          return
        }

        setAssessment(jsonTest.assessment)
        setQuestions(jsonTest.questions)
        const durationSec = (jsonTest.assessment.duration_minutes || 60) * 60
        setRemainingSeconds(durationSec)

        // Initialize question statuses
        const initialStatus: Record<number, string> = {}
        const initialTimes: Record<number, number> = {}
        jsonTest.questions.forEach((q: Question, idx: number) => {
          initialStatus[q.question_id] = idx === 0 ? 'visited_unanswered' : 'not_visited'
          initialTimes[q.question_id] = 0
        })
        setQuestionStatuses(initialStatus)
        setPerQuestionSeconds(initialTimes)

        // Start Attempt in DB
        const resAttempt = await fetch('/api/student/attempts/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessment_id: Number(id),
            student_id: Number(studentId),
          }),
        })
        const jsonAttempt = await resAttempt.json()
        if (jsonAttempt.success) {
          setAttemptId(jsonAttempt.attemptId)
        }

        questionStartTimeRef.current = Date.now()
      } catch (err) {
        console.error('Failed to init test:', err)
      } finally {
        setLoading(false)
      }
    }

    initTest()
  }, [id, studentId])

  // 2. Global Countdown & Current Question Timer Ticker
  useEffect(() => {
    if (loading || !assessment) return

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleFinalSubmit(true) // Auto-submit on time expiry
          return 0
        }
        return prev - 1
      })

      setTotalElapsedSeconds((prev) => prev + 1)
      setCurrentQSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [loading, assessment])

  // 3. Accumulate Time on Current Question before switching
  const recordCurrentQuestionTime = () => {
    const activeQ = questions[currentIndex]
    if (!activeQ) return

    const now = Date.now()
    const elapsedSeconds = Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000))

    setPerQuestionSeconds((prev) => ({
      ...prev,
      [activeQ.question_id]: (prev[activeQ.question_id] || 0) + elapsedSeconds,
    }))

    // Reset current question timer
    questionStartTimeRef.current = Date.now()
    setCurrentQSeconds(0)
  }

  // Switch to another question index
  const goToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length) return

    recordCurrentQuestionTime()

    // Mark target as visited if not yet answered/reviewed
    const targetQ = questions[targetIndex]
    if (targetQ) {
      setQuestionStatuses((prev) => {
        const currentStatus = prev[targetQ.question_id]
        if (currentStatus === 'not_visited') {
          return { ...prev, [targetQ.question_id]: 'visited_unanswered' }
        }
        return prev
      })
    }

    setCurrentIndex(targetIndex)
  }

  // Select Option
  const handleSelectOption = (key: string) => {
    const q = questions[currentIndex]
    if (!q) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [q.question_id]: key,
    }))
  }

  // Clear Response
  const handleClearResponse = () => {
    const q = questions[currentIndex]
    if (!q) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [q.question_id]: null,
    }))

    setQuestionStatuses((prev) => ({
      ...prev,
      [q.question_id]: 'visited_unanswered',
    }))
  }

  // Save & Next Action
  const handleSaveAndNext = () => {
    const q = questions[currentIndex]
    if (!q) return

    const chosen = selectedAnswers[q.question_id]
    setQuestionStatuses((prev) => ({
      ...prev,
      [q.question_id]: chosen ? 'answered' : 'visited_unanswered',
    }))

    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1)
    }
  }

  // Mark for Review & Next Action
  const handleMarkForReviewAndNext = () => {
    const q = questions[currentIndex]
    if (!q) return

    setQuestionStatuses((prev) => ({
      ...prev,
      [q.question_id]: 'marked_for_review',
    }))

    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1)
    }
  }

  // Final Submit Handler
  const handleFinalSubmit = async (isAuto = false) => {
    if (submitting) return
    setSubmitting(true)

    // Save final question's elapsed time
    recordCurrentQuestionTime()

    const activeQ = questions[currentIndex]
    const activeElapsed = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000))
    const finalTimes = {
      ...perQuestionSeconds,
      ...(activeQ ? { [activeQ.question_id]: (perQuestionSeconds[activeQ.question_id] || 0) + activeElapsed } : {}),
    }

    // Format answers array
    const answersPayload = questions.map((q) => {
      const selectedKey = selectedAnswers[q.question_id] || null
      const st = questionStatuses[q.question_id] || (selectedKey ? 'answered' : 'unanswered')
      const timeSpent = finalTimes[q.question_id] || 0

      return {
        question_id: q.question_id,
        selected_option_key: selectedKey,
        answer_status: st,
        time_spent_seconds: timeSpent,
      }
    })

    try {
      const res = await fetch('/api/student/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptId,
          time_taken_seconds: totalElapsedSeconds,
          answers: answersPayload,
        }),
      })

      const json = await res.json()
      if (json.success) {
        router.push(`/practice/result/${attemptId}`)
      } else {
        alert(json.error || 'Submission failed')
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting test:', err)
      setSubmitting(false)
    }
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading || !assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider uppercase font-mono">
          Initializing Secure Examination Sandbox...
        </p>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const currentSelectedOption = selectedAnswers[currentQ?.question_id] || null

  // Palette counts
  const answeredCount = Object.values(questionStatuses).filter((s) => s === 'answered').length
  const reviewCount = Object.values(questionStatuses).filter((s) => s === 'marked_for_review').length
  const unansweredCount = questions.length - answeredCount - reviewCount

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col font-sans select-none">
      {/* High-Contrast Examination Header */}
      <header className="bg-black text-white px-4 md:px-8 py-3.5 border-b border-neutral-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-xs">
            EF
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base leading-tight truncate max-w-xs md:max-w-md">
              {assessment.title}
            </h1>
            <div className="text-[10px] text-neutral-400 font-mono">
              Rajasthan Informatics Assistant • Total Qs: {questions.length} • Max Marks: {Number(assessment.total_marks || 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Timers & Submit Button */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Per-Question Live Ticker */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-neutral-400 text-[11px]">This Question:</span>
            <span className="font-mono font-bold text-white">
              {formatTimer(currentQSeconds + (perQuestionSeconds[currentQ?.question_id] || 0))}
            </span>
          </div>

          {/* Overall Countdown */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs md:text-sm">
            <Icons.Clock size={16} className="text-white" />
            <span className="font-mono font-black text-white tracking-wider">
              {formatTimer(remainingSeconds)}
            </span>
          </div>

          {/* Submit Test Trigger */}
          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-xs"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Active Question & Options (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-3xl bg-white border border-gray-200 p-5 md:p-8 shadow-xs">
          <div>
            {/* Question Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-black text-white font-mono font-black text-xs">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-gray-800">{currentQ?.subject_name}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">{currentQ?.topic_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200">
                  {currentQ?.language_code === 'hi' ? 'हिंदी' : 'English'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  +{Number(currentQ?.marks || 1).toFixed(1)} / -{Number(currentQ?.negative_marks || 0.25).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="text-base md:text-lg font-bold text-gray-950 leading-relaxed mb-8">
              {currentQ?.question_text}
            </div>

            {/* 4 MCQ Options */}
            <div className="space-y-3">
              {currentQ?.options?.map((opt) => {
                const isSelected = currentSelectedOption === opt.key
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-black bg-neutral-50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                          isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className={`text-sm md:text-base ${isSelected ? 'font-bold text-black' : 'font-medium text-gray-800'}`}>
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-black' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleClearResponse}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-neutral-200 text-gray-900 text-xs font-bold transition-colors"
              >
                Mark for Review & Next
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                {currentIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Live Timing Summary (1 Col) */}
        <div className="space-y-5">
          {/* Palette Box */}
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-xs">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Question Palette
            </h2>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {questions.map((q, idx) => {
                const st = questionStatuses[q.question_id]
                const isActive = idx === currentIndex

                let badgeStyle = 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                if (st === 'answered') {
                  badgeStyle = 'bg-black text-white border-black font-black'
                } else if (st === 'marked_for_review') {
                  badgeStyle = 'bg-neutral-200 border-2 border-dashed border-black text-black font-black'
                } else if (st === 'visited_unanswered') {
                  badgeStyle = 'bg-gray-100 text-gray-900 border-gray-300 font-bold'
                }

                return (
                  <button
                    key={q.question_id}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl font-mono text-xs flex items-center justify-center border transition-all ${badgeStyle} ${
                      isActive ? 'ring-2 ring-black ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Status Legend */}
            <div className="space-y-2 border-t border-gray-100 pt-3 text-[11px] text-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-black"></span>
                  <span>Answered</span>
                </div>
                <strong className="text-black font-mono">{answeredCount}</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-neutral-200 border border-dashed border-black"></span>
                  <span>Marked for Review</span>
                </div>
                <strong className="text-black font-mono">{reviewCount}</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gray-100 border border-gray-300"></span>
                  <span>Unanswered / Visited</span>
                </div>
                <strong className="text-black font-mono">{unansweredCount}</strong>
              </div>
            </div>
          </div>

          {/* Candidate Info Card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-xs text-xs space-y-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Candidate Info</div>
            <div className="font-bold text-black text-sm">ExamForge Candidate</div>
            <div className="text-gray-500 font-mono text-[11px]">Roll: EF-IA-{studentId.padStart(4, '0')}</div>
            <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500">
              Exam: Rajasthan IA Practice Drill 2026
            </div>
          </div>
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-black">Submit Practice Test?</h3>
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <Icons.Close size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Please review your question attempts before final submission. Your per-question time tracking will be processed immediately.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div>
                <div className="font-mono font-black text-base text-black">{answeredCount}</div>
                <div className="text-[10px] text-gray-500 uppercase mt-0.5">Answered</div>
              </div>
              <div>
                <div className="font-mono font-black text-base text-black">{reviewCount}</div>
                <div className="text-[10px] text-gray-500 uppercase mt-0.5">Review</div>
              </div>
              <div>
                <div className="font-mono font-black text-base text-black">{unansweredCount}</div>
                <div className="text-[10px] text-gray-500 uppercase mt-0.5">Unanswered</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Back to Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

