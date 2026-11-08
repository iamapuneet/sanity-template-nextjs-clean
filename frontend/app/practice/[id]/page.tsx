'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
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

interface StudentSession {
  id: number
  full_name: string
  username?: string
  email?: string
}

export default function ExamLiveInterface({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  // State: 'loading' | 'auth_required' | 'instructions' | 'live'
  const [examPhase, setExamPhase] = useState<'loading' | 'auth_required' | 'instructions' | 'live'>('loading')
  const [student, setStudent] = useState<StudentSession | null>(null)
  const [availableStudents, setAvailableStudents] = useState<any[]>([])

  const [assessment, setAssessment] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attemptId, setAttemptId] = useState<number | null>(null)

  // Instruction agreement
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [startingAttempt, setStartingAttempt] = useState(false)

  // Current active question index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Student Responses State: question_id -> option_key ('A', 'B', 'C', 'D' or null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({})

  // Question Status State: 'answered' | 'marked_for_review' | 'visited_unanswered' | 'not_visited'
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, string>>({})

  // Per-Question Time Tracking State
  const [perQuestionSeconds, setPerQuestionSeconds] = useState<Record<number, number>>({})
  const questionStartTimeRef = useRef<number>(Date.now())

  // Overall test countdown timer
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1200)
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0)
  const [currentQSeconds, setCurrentQSeconds] = useState<number>(0)

  // Modals
  const [showExitModal, setShowExitModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Quick candidate name for login fallback
  const [quickName, setQuickName] = useState('')

  // 1. Initial Load: Strip URL params and verify Student Session
  useEffect(() => {
    // Strip query parameters to ensure clean URL
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }

    const checkSessionAndFetch = async () => {
      try {
        setExamPhase('loading')

        // Fetch Assessment Details
        const resTest = await fetch(`/api/student/assessments/${id}`)
        const jsonTest = await resTest.json()

        if (!jsonTest.success) {
          alert(jsonTest.error || 'Failed to load test.')
          router.push('/practice')
          return
        }

        setAssessment(jsonTest.assessment)
        setQuestions(jsonTest.questions)
        const durationSec = (jsonTest.assessment.duration_minutes || 20) * 60
        setRemainingSeconds(durationSec)

        // Check Local Storage for Verified Candidate Session
        let activeStudent: StudentSession | null = null
        const saved = localStorage.getItem('examforge_current_student')

        if (saved) {
          try {
            activeStudent = JSON.parse(saved)
          } catch {
            activeStudent = null
          }
        }

        // Fetch student profiles to validate or provide selection
        const resProfiles = await fetch('/api/student/profile').then((r) => r.json())
        if (resProfiles.success && resProfiles.students) {
          setAvailableStudents(resProfiles.students)
          if (!activeStudent && resProfiles.students.length > 0) {
            // Default to Puneet if available
            activeStudent = resProfiles.students[0]
            localStorage.setItem('examforge_current_student', JSON.stringify(activeStudent))
          }
        }

        if (activeStudent && activeStudent.id) {
          setStudent(activeStudent)
          setExamPhase('instructions') // Ready at instructions gatekeeper
        } else {
          setExamPhase('auth_required')
        }

        // Initialize question statuses
        const initialStatus: Record<number, string> = {}
        const initialTimes: Record<number, number> = {}
        jsonTest.questions.forEach((q: Question, idx: number) => {
          initialStatus[q.question_id] = idx === 0 ? 'visited_unanswered' : 'not_visited'
          initialTimes[q.question_id] = 0
        })
        setQuestionStatuses(initialStatus)
        setPerQuestionSeconds(initialTimes)
      } catch (err) {
        console.error('Failed to initialize:', err)
        router.push('/practice')
      }
    }

    checkSessionAndFetch()
  }, [id, router])

  // 2. Start Official Exam Attempt (Only on user clicking "Start Assessment")
  const handleStartExam = async () => {
    if (!agreedToTerms) {
      alert('कृपया परीक्षा नियम स्वीकारने के लिए चेकबॉक्स पर टिक करें।')
      return
    }

    if (!student || !student.id) {
      setExamPhase('auth_required')
      return
    }

    try {
      setStartingAttempt(true)
      const resAttempt = await fetch('/api/student/attempts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: Number(id),
          student_id: student.id,
        }),
      })

      const jsonAttempt = await resAttempt.json()
      if (jsonAttempt.success) {
        setAttemptId(jsonAttempt.attemptId)
        questionStartTimeRef.current = Date.now()
        setExamPhase('live')
      } else {
        alert(jsonAttempt.error || 'Failed to start official attempt.')
      }
    } catch (err) {
      console.error('Error starting attempt:', err)
      alert('Network error while starting attempt.')
    } finally {
      setStartingAttempt(false)
    }
  }

  // 3. Quick Login / Select Candidate
  const handleSelectStudent = (st: StudentSession) => {
    setStudent(st)
    localStorage.setItem('examforge_current_student', JSON.stringify(st))
    setExamPhase('instructions')
  }

  const handleCreateQuickStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickName.trim()) return

    try {
      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: quickName.trim() }),
      })
      const json = await res.json()
      if (json.success && json.student) {
        handleSelectStudent(json.student)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 4. Timer Ticker (Only runs when examPhase === 'live')
  useEffect(() => {
    if (examPhase !== 'live' || !assessment) return

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
  }, [examPhase, assessment])

  // 5. Browser Navigation Protection (Prevent accidental exit / reload)
  useEffect(() => {
    if (examPhase !== 'live') return

    // Prevent tab close or refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitting) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Intercept browser back button
    window.history.pushState(null, '', window.location.pathname)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.pathname)
      setShowExitModal(true)
    }
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [examPhase, submitting])

  // Time tracking helper for active question
  const recordCurrentQuestionTime = () => {
    const q = questions[currentIndex]
    if (!q) return

    const elapsed = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000))
    setPerQuestionSeconds((prev) => ({
      ...prev,
      [q.question_id]: (prev[q.question_id] || 0) + elapsed,
    }))
    questionStartTimeRef.current = Date.now()
    setCurrentQSeconds(0)
  }

  // Question navigation
  const goToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length) return
    recordCurrentQuestionTime()
    setCurrentIndex(targetIndex)

    const targetQ = questions[targetIndex]
    if (targetQ) {
      const curStatus = questionStatuses[targetQ.question_id]
      if (curStatus === 'not_visited' || !curStatus) {
        setQuestionStatuses((prev) => ({
          ...prev,
          [targetQ.question_id]: 'visited_unanswered',
        }))
      }
    }
  }

  // Option selection
  const handleSelectOption = (key: string) => {
    const q = questions[currentIndex]
    if (!q) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [q.question_id]: key,
    }))

    if (questionStatuses[q.question_id] !== 'marked_for_review') {
      setQuestionStatuses((prev) => ({
        ...prev,
        [q.question_id]: 'answered',
      }))
    }
  }

  // Clear response
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

  // Save & Next
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

  // Mark for Review & Next
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

  // Final Submit
  const handleFinalSubmit = async (isAuto = false) => {
    if (submitting) return
    setSubmitting(true)

    recordCurrentQuestionTime()

    const activeQ = questions[currentIndex]
    const activeElapsed = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000))
    const finalTimes = {
      ...perQuestionSeconds,
      ...(activeQ ? { [activeQ.question_id]: (perQuestionSeconds[activeQ.question_id] || 0) + activeElapsed } : {}),
    }

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
        alert(json.error || 'Submission failed.')
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

  // -------------------------------------------------------------
  // PHASE 1: Loading
  // -------------------------------------------------------------
  if (examPhase === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider uppercase font-mono text-neutral-300">
          Loading Examination Portal...
        </p>
      </div>
    )
  }

  // -------------------------------------------------------------
  // PHASE 2: Candidate Authentication Required Gatekeeper
  // -------------------------------------------------------------
  if (examPhase === 'auth_required') {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-black border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-lg mx-auto flex items-center justify-center">
              EF
            </div>
            <h2 className="text-xl font-black text-white">Candidate Verification Required</h2>
            <p className="text-xs text-neutral-400">
              परीक्षा में सम्मिलित होने के लिए कृपया अपना Candidate Profile चुनें।
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              Choose Registered Candidate:
            </span>
            {availableStudents.map((st) => (
              <button
                key={st.id}
                onClick={() => handleSelectStudent(st)}
                className="w-full p-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-white text-sm">{st.full_name}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Candidate #{st.id} • {st.email}</div>
                </div>
                <Icons.ChevronRight size={16} className="text-neutral-400" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <form onSubmit={handleCreateQuickStudent} className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                Or Enter New Candidate Name:
              </span>
              <input
                type="text"
                placeholder="Full Name (e.g. Puneet)"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
              >
                Continue as Candidate
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link href="/practice" className="text-xs text-neutral-400 hover:text-white underline">
              Return to Practice Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // PHASE 3: Official Verification & Instructions Screen (Pre-Exam)
  // -------------------------------------------------------------
  if (examPhase === 'instructions') {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
        {/* Top Minimal Bar */}
        <header className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-black font-black text-xs flex items-center justify-center">
              EF
            </div>
            <span className="font-bold text-sm tracking-tight">ExamForge Candidate Gatekeeper</span>
          </div>
          <Link
            href="/practice"
            className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Portal</span>
            <Icons.Close size={14} />
          </Link>
        </header>

        {/* Center Container */}
        <div className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center space-y-6">
          <div className="bg-black border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-neutral-900 text-neutral-300 border border-neutral-800 mb-3">
                <span>Official Assessment Verification</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {assessment?.title}
              </h1>
              <p className="text-xs md:text-sm text-neutral-400 mt-1">
                Rajasthan Informatics Assistant (सूचना सहायक) Online Test Series
              </p>
            </div>

            {/* Candidate Identity Card */}
            <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-base flex items-center justify-center">
                  {student?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Authenticated Candidate:</div>
                  <div className="font-extrabold text-base text-white">{student?.full_name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Roll ID: #{student?.id} • {student?.email}</div>
                </div>
              </div>

              <button
                onClick={() => setExamPhase('auth_required')}
                className="text-[11px] text-neutral-300 underline hover:text-white font-semibold"
              >
                Change Candidate
              </button>
            </div>

            {/* Assessment Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3">
                <div className="text-lg font-black font-mono text-white">{questions.length}</div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Questions</div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3">
                <div className="text-lg font-black font-mono text-white">{assessment?.duration_minutes}m</div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Duration</div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3">
                <div className="text-lg font-black font-mono text-white">+{Number(questions[0]?.marks || 1).toFixed(0)}</div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Right Mark</div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3">
                <div className="text-lg font-black font-mono text-white">-{Number(questions[0]?.negative_marks || 0.25).toFixed(2)}</div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Negative</div>
              </div>
            </div>

            {/* Exam Rules & Instructions */}
            <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800/80 p-5 space-y-2.5 text-xs text-neutral-300 leading-relaxed">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                महत्वपूर्ण परीक्षा निर्देश (Important Examination Rules):
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-neutral-300">
                <li>
                  जैसे ही आप <strong>"Start Assessment"</strong> बटन दबाएंगे, आपका लाइव टाइमर शुरू हो जाएगा।
                </li>
                <li>
                  प्रत्येक प्रश्न को हल करने में लगा समय अलग से रिकॉर्ड किया जाएगा (Per-Question Time Analysis)।
                </li>
                <li>
                  परीक्षा के दौरान पेज रिफ्रेश (F5) या बैक बटन न दबाएं। बाहर निकलने के लिए <strong>Exit</strong> बटन पर पुष्टि अनिवार्य है।
                </li>
                <li>
                  समय समाप्त होने पर आपका टेस्ट स्वतः (Auto-Submit) हो जाएगा।
                </li>
              </ul>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-white cursor-pointer"
              />
              <span className="text-xs text-white font-medium">
                मैंने सभी नियम व निर्देश ध्यानपूर्वक पढ़ लिए हैं और मैं परीक्षा शुरू करने के लिए तैयार हूँ।
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/practice"
                className="flex-1 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-bold text-xs text-center transition-colors"
              >
                रद्द करें (Cancel)
              </Link>
              <button
                type="button"
                disabled={!agreedToTerms || startingAttempt}
                onClick={handleStartExam}
                className={`flex-2 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  agreedToTerms && !startingAttempt
                    ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                {startingAttempt ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Initializing Test...</span>
                  </>
                ) : (
                  <>
                    <span>परीक्षा आरंभ करें (Start Live Exam)</span>
                    <Icons.ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // PHASE 4: Live Exam (Laser-Focused, Distraction-Free UI/UX)
  // -------------------------------------------------------------
  const currentQ = questions[currentIndex]
  const currentSelectedOption = selectedAnswers[currentQ?.question_id] || null

  // Palette counts
  const answeredCount = Object.values(questionStatuses).filter((s) => s === 'answered').length
  const reviewCount = Object.values(questionStatuses).filter((s) => s === 'marked_for_review').length
  const unansweredCount = questions.length - answeredCount - reviewCount

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col font-sans select-none">
      {/* 1. High-Contrast Distraction-Free Header */}
      <header className="sticky top-0 z-40 bg-black text-white px-4 md:px-8 py-3.5 border-b border-neutral-800 flex items-center justify-between shadow-md">
        {/* Left: Test info & Candidate */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-xs">
            EF
          </div>
          <div>
            <h1 className="font-extrabold text-xs md:text-sm leading-tight text-white truncate max-w-xs md:max-w-md">
              {assessment.title}
            </h1>
            <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-2">
              <span>Candidate: <strong className="text-white">{student?.full_name}</strong></span>
              <span>•</span>
              <span>Q {currentIndex + 1} of {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Right: Timers, Exit Button, Submit Button */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Per-Question Live Ticker */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-neutral-400 text-[11px]">This Q:</span>
            <span className="font-mono font-bold text-white">
              {formatTimer(currentQSeconds + (perQuestionSeconds[currentQ?.question_id] || 0))}
            </span>
          </div>

          {/* Overall Countdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs md:text-sm">
            <Icons.Clock size={15} className="text-white" />
            <span className="font-mono font-black text-white tracking-wider">
              {formatTimer(remainingSeconds)}
            </span>
          </div>

          {/* Exit Exam Trigger Button */}
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Icons.Close size={13} />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>

          {/* Submit Test Trigger Button */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-xs"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* 2. Main Focused Examination Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Active Question Statement & Options (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-3xl bg-white border border-gray-200 p-5 md:p-8 shadow-xs">
          <div>
            {/* Question Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-black text-white font-mono font-black text-xs">
                  Question {currentIndex + 1}
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

            {/* Question Statement (High Legibility Devanagari Hindi font) */}
            <div className="text-lg md:text-xl font-bold text-black leading-relaxed mb-8">
              {currentQ?.question_text}
            </div>

            {/* 4 Clean MCQ Option Cards */}
            <div className="space-y-3.5">
              {currentQ?.options?.map((opt) => {
                const isSelected = currentSelectedOption === opt.key
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-black bg-neutral-50 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Letter badge / Radio Indicator */}
                      <div
                        className={`w-9 h-9 rounded-xl font-mono font-bold text-sm flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {opt.key}
                      </div>

                      {/* Option Text */}
                      <span className={`text-base font-semibold ${isSelected ? 'text-black font-bold' : 'text-gray-800'}`}>
                        {opt.text}
                      </span>
                    </div>

                    {/* Radio Dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-black bg-black' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearResponse}
                disabled={!currentSelectedOption}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Clear Response
              </button>

              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2.5 rounded-xl border border-gray-400 bg-gray-50 hover:bg-gray-100 text-black text-xs font-bold transition-colors"
              >
                Mark for Review & Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <Icons.ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Save & Next</span>
                <Icons.ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Navigation Grid (1 Col) */}
        <div className="flex flex-col rounded-3xl bg-white border border-gray-200 p-5 shadow-xs space-y-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-black">
              Question Palette
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Quick jump to any question</p>
          </div>

          {/* Status Counts Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
              <span className="w-3.5 h-3.5 rounded-md bg-black"></span>
              <span className="text-gray-700 text-[11px]">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
              <span className="w-3.5 h-3.5 rounded-md bg-gray-300"></span>
              <span className="text-gray-700 text-[11px]">Unanswered ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 col-span-2">
              <span className="w-3.5 h-3.5 rounded-md border-2 border-black bg-white"></span>
              <span className="text-gray-700 text-[11px]">Marked for Review ({reviewCount})</span>
            </div>
          </div>

          {/* Numbered Palette Grid */}
          <div className="flex-1 max-h-72 overflow-y-auto pr-1">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex
                const status = questionStatuses[q.question_id]
                const isAnswered = status === 'answered'
                const isReview = status === 'marked_for_review'

                return (
                  <button
                    key={q.question_id}
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-black ring-offset-2 font-black'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-black text-white'
                        : isReview
                        ? 'bg-white border-2 border-black text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Trigger inside Palette */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Submit Entire Assessment
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: Exit Confirmation Alert Window                       */}
      {/* ------------------------------------------------------------- */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black mx-auto flex items-center justify-center text-xl font-bold">
                ⚠️
              </div>
              <h3 className="text-xl font-black text-black">
                क्या आप वाकई परीक्षा छोड़ना चाहते हैं?
              </h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to quit the examination?
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-gray-200 p-4 text-xs text-gray-700 space-y-2">
              <div className="font-semibold text-black">
                ⚠️ महत्वपूर्ण चेतावनी (Critical Warning):
              </div>
              <p>
                यदि आप अभी परीक्षा छोड़ते हैं, तो आपका यह टेस्ट अपूर्ण (Incomplete) रहेगा और आपका परिणाम दर्ज नहीं होगा।
              </p>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-mono font-bold text-black">
                <span>उत्तर दिए गए प्रश्न:</span>
                <span>{answeredCount} / {questions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                परीक्षा जारी रखें (Stay in Exam)
              </button>
              <button
                type="button"
                onClick={() => router.push('/practice')}
                className="py-3 px-4 rounded-xl border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 font-semibold text-xs transition-colors"
              >
                हाँ, परीक्षा छोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: Final Submit Confirmation Window                     */}
      {/* ------------------------------------------------------------- */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-black text-white mx-auto flex items-center justify-center">
                <Icons.Check size={24} />
              </div>
              <h3 className="text-xl font-black text-black">Submit Assessment?</h3>
              <p className="text-xs text-gray-500">
                Are you ready to submit your exam and view instant analytics?
              </p>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-lg font-black font-mono text-black">{answeredCount}</div>
                <div className="text-[10px] uppercase font-bold text-gray-500">Answered</div>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-lg font-black font-mono text-black">{reviewCount}</div>
                <div className="text-[10px] uppercase font-bold text-gray-500">Review</div>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-lg font-black font-mono text-black">{unansweredCount}</div>
                <div className="text-[10px] uppercase font-bold text-gray-500">Skipped</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs transition-colors"
              >
                Resume Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit(false)}
                className="flex-1 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
