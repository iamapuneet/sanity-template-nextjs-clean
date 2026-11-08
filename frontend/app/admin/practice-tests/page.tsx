'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

function PracticeTestsContent() {
  const searchParams = useSearchParams()

  const [tests, setTests] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [approvedQuestions, setApprovedQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Builder modal
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assessmentType, setAssessmentType] = useState<
    'mock' | 'sectional' | 'topic_test' | 'full_length' | 'practice'
  >('mock')
  const [durationMinutes, setDurationMinutes] = useState<number>(60)
  const [passingPercentage, setPassingPercentage] = useState<number>(40)
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(1.0)
  const [negativeMarksPerQuestion, setNegativeMarksPerQuestion] = useState<number>(0.25)

  // Question filter inside builder
  const [builderSubjectId, setBuilderSubjectId] = useState<string>('all')
  const [builderTopicId, setBuilderTopicId] = useState<string>('all')
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [resTests, resSubs, resTops, resQs] = await Promise.all([
        fetch('/api/admin/mock-tests').then((r) => r.json()),
        fetch('/api/admin/subjects').then((r) => r.json()),
        fetch('/api/admin/topics').then((r) => r.json()),
        fetch('/api/admin/questions?status=approved&limit=200').then((r) => r.json()),
      ])
      if (resTests.success) setTests(resTests.tests)
      if (resSubs.success) setSubjects(resSubs.subjects)
      if (resTops.success) setTopics(resTops.topics)
      if (resQs.success) setApprovedQuestions(resQs.questions)
    } catch (err) {
      console.error(err)
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

  const handleOpenCreate = () => {
    setTitle('')
    setDescription('')
    setAssessmentType('mock')
    setDurationMinutes(60)
    setPassingPercentage(40)
    setMarksPerQuestion(1.0)
    setNegativeMarksPerQuestion(0.25)
    setBuilderSubjectId('all')
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

  const totalCalculatedMarks = (selectedQuestionIds.length * marksPerQuestion).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Mock Tests & Practice Builder</h1>
          <p className="text-sm text-gray-500">
            Build full-length mock drills, sectional tests, and practice papers with checkbox question curation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-black font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Icons.CandidatePortal size={16} />
            Try Student View
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs flex items-center gap-2"
          >
            <Icons.Plus size={16} />
            <span>Create Test</span>
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading assessments from MySQL...</div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-3">
          <p className="text-sm font-semibold text-gray-700">No mock tests created yet.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
          >
            <Icons.Plus size={14} /> Create First Practice Drill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => (
            <div
              key={test.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black transition-all flex flex-col justify-between shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200 font-mono">
                    {test.assessment_type}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black text-white">
                    {test.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-black group-hover:text-black transition-colors mb-1.5">
                  {test.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                  {test.description || 'Practice test with selected syllabus questions.'}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-gray-100 text-center text-xs text-gray-600 mb-3 bg-gray-50/50 rounded-xl p-2">
                  <div>
                    <div className="font-mono font-bold text-black">{test.actual_question_count || test.total_questions}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Questions</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-black">{test.duration_minutes}m</div>
                    <div className="text-[10px] text-gray-400 uppercase">Duration</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-black">{Number(test.total_marks || 0).toFixed(0)}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Marks</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Student Attempts: <strong>{test.attempts_count || 0}</strong></span>
                  <span>Pass: <strong>{test.passing_percentage}%</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/practice/${test.id}`}
                    target="_blank"
                    className="flex-1 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Test ↗</span>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(test.id)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-neutral-200 text-gray-700 transition-colors"
                    title="Delete Test"
                  >
                    <Icons.Trash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Builder Modal */}
      <Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Practice Test Builder"
        subtitle="Select questions using checkboxes and configure test parameters"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveTest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Test Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rajasthan IA Full-Length Mock Drill 02"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Assessment Type *
              </label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                <option value="mock">Full-Length Mock</option>
                <option value="sectional">Sectional Test</option>
                <option value="topic_test">Topic Test</option>
                <option value="practice">Practice Drill</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Marks / Question
              </label>
              <input
                type="number"
                step="0.25"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(parseFloat(e.target.value) || 1.0)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Negative Marks
              </label>
              <input
                type="number"
                step="0.05"
                value={negativeMarksPerQuestion}
                onChange={(e) => setNegativeMarksPerQuestion(parseFloat(e.target.value) || 0.25)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Pass Percentage
              </label>
              <input
                type="number"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
          </div>

          {/* Question Filter & Selection Section */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-black uppercase">
                Select Questions ({selectedQuestionIds.length} Selected • {totalCalculatedMarks} Total Marks)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllEligible}
                  className="px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-semibold hover:bg-neutral-800"
                >
                  Select All Visible
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuestionIds([])}
                  className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-800 text-[11px] font-semibold hover:bg-gray-300"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={builderSubjectId}
                onChange={(e) => setBuilderSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                <option value="all">Filter by Subject (All)</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={builderTopicId}
                onChange={(e) => setBuilderTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                <option value="all">Filter by Topic (All)</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox list of questions */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {eligibleQuestions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No approved questions matching filters.
                </div>
              ) : (
                eligibleQuestions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id)
                  return (
                    <label
                      key={q.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked ? 'bg-white border-black shadow-xs' : 'bg-white/80 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="mt-1 accent-black w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-gray-500">#{q.id}</span>
                          <span className="text-[10px] font-bold text-black">{q.subject_name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                            {q.language_code || 'en'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-900 font-medium line-clamp-2">
                          {q.question_text}
                        </p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
            >
              Save & Publish Test
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Mock Test"
        subtitle="Confirm test removal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Are you sure you want to delete this test? Student attempts for this test will be removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteConfirmId && handleDeleteTest(deleteConfirmId)}
              className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function PracticeTestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Loading Practice Tests...</div>}>
      <PracticeTestsContent />
    </Suspense>
  )
}
