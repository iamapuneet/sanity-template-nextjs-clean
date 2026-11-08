'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'
import { useExamStore } from '@/lib/store'
import { PracticeTest } from '@/lib/exam-types'
import { toast } from 'sonner'

function PracticeTestsContent() {
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    tests,
    subjects,
    topics,
    questions,
    addPracticeTest,
    deletePracticeTest,
  } = useExamStore()

  // Modal / Builder state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Builder form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number>(60)
  const [passingPercentage, setPassingPercentage] = useState<number>(40)
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | 'all'>('all')
  const [selectedTopicId, setSelectedTopicId] = useState<number | 'all'>('all')

  // Checkbox selection of questions
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreate()
    }
  }, [searchParams])

  const handleOpenCreate = () => {
    setTitle('')
    setDescription('')
    setDurationMinutes(60)
    setPassingPercentage(40)
    setSelectedSubjectId('all')
    setSelectedTopicId('all')
    setSelectedQuestionIds([])
    setIsBuilderOpen(true)
  }

  // Filter approved questions eligible for practice test
  const eligibleQuestions = questions.filter((q) => {
    const isApproved = q.status === 'approved'
    const matchesSubject =
      selectedSubjectId === 'all' || q.subjectId === Number(selectedSubjectId)
    const matchesTopic =
      selectedTopicId === 'all' || q.topicId === Number(selectedTopicId)
    return isApproved && matchesSubject && matchesTopic
  })

  // Toggle single question checkbox
  const toggleQuestionSelection = (qId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    )
  }

  // Select all visible questions
  const selectAllEligible = () => {
    const ids = eligibleQuestions.map((q) => q.id)
    setSelectedQuestionIds((prev) => Array.from(new Set([...prev, ...ids])))
  }

  // Clear selections
  const clearSelection = () => {
    setSelectedQuestionIds([])
  }

  // Calculate total marks of selected questions
  const calculatedTotalMarks = selectedQuestionIds.reduce((sum, qId) => {
    const q = questions.find((item) => item.id === qId)
    return sum + (q?.marks || 1)
  }, 0)

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Test title is required')
      return
    }
    if (selectedQuestionIds.length === 0) {
      toast.error('Please select at least 1 question for the practice test')
      return
    }

    addPracticeTest({
      title,
      description,
      subjectId: selectedSubjectId === 'all' ? undefined : Number(selectedSubjectId),
      topicId: selectedTopicId === 'all' ? undefined : Number(selectedTopicId),
      durationMinutes: Number(durationMinutes),
      totalMarks: calculatedTotalMarks,
      passingPercentage: Number(passingPercentage),
      questionIds: selectedQuestionIds,
      status: 'published',
    })

    setIsBuilderOpen(false)
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Practice Test Builder"
        subtitle="Curate timed mock tests and practice papers using verified question bank MCQs"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Action Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Configured Mock Tests
            </h3>
            <p className="text-xs text-gray-500">
              Tests available for candidates in the practice examination portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <Icons.Plus size={18} />
            <span>Build New Practice Test</span>
          </button>
        </div>

        {/* Existing Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => {
            const sub = subjects.find((s) => s.id === test.subjectId)

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-gray-100 text-black border border-gray-200">
                      {sub?.name || 'Full Syllabus Mock'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        test.status === 'published'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-gray-900 line-clamp-1">
                      {test.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {test.description || 'Standard government exam practice drill.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-gray-400">Questions</span>
                      <strong className="text-sm font-bold text-gray-800">{test.questionIds.length}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-gray-400">Duration</span>
                      <strong className="text-sm font-bold text-gray-800">{test.durationMinutes}m</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-gray-400">Marks</span>
                      <strong className="text-sm font-bold text-black">{test.totalMarks}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Pass: {test.passingPercentage}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(test.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Test"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {tests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <Icons.PracticeTests size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-700">No practice tests built yet.</p>
            <p className="text-xs text-gray-400">Click "Build New Practice Test" to pick approved questions and set duration.</p>
          </div>
        )}
      </div>

      {/* Practice Test Builder Modal with Checkbox Selection */}
      <Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Build Practice Test with Checkbox Selection"
        subtitle="Specify test parameters and select approved questions from repository"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveTest} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Title & Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Test Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SSC CGL Reasoning & Math Speed Drill"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions or exam pattern details for candidates..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Test Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                max="240"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Passing Percentage (%) *
              </label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(parseFloat(e.target.value) || 40)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>
          </div>

          {/* Checkbox Question Selector Section */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Select Questions from Repository ({selectedQuestionIds.length} Selected)
                </label>
                <p className="text-[11px] text-gray-500">
                  Only approved questions are listed below
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllEligible}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                >
                  Select All Visible
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Filter bar for questions */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Filter by Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Filter by Topic</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                >
                  <option value="all">All Topics</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions Checkbox List */}
            <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {eligibleQuestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No approved questions match the selected filter.
                </div>
              ) : (
                eligibleQuestions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id)
                  const sub = subjects.find((s) => s.id === q.subjectId)

                  return (
                    <label
                      key={q.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer text-xs transition-colors ${
                        isChecked ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="w-4 h-4 mt-0.5 text-black rounded border-gray-300 focus:ring-black cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-200 text-[10px]">
                            {sub?.name || 'General'}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            Marks: +{q.marks}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-black">
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-800 line-clamp-2">{q.questionText}</p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>

            {/* Total calculated marks summary banner */}
            <div className="p-3.5 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-between text-xs text-black font-medium">
              <span>
                Selected: <strong>{selectedQuestionIds.length}</strong> questions
              </span>
              <span>
                Total Marks: <strong className="text-sm font-bold text-black">{calculatedTotalMarks}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              Save & Publish Test
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Test Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Practice Test"
        subtitle="Are you sure you want to remove this test?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            This test will no longer appear in the candidate practice dashboard.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteConfirmId) {
                  deletePracticeTest(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
            >
              Delete Test
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function PracticeTestsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-400">
          Loading Practice Tests...
        </div>
      }
    >
      <PracticeTestsContent />
    </Suspense>
  )
}

