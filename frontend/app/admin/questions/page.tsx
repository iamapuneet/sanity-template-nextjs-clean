'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'
import { useExamStore } from '@/lib/store'
import { Question, QuestionOption, DifficultyLevel, ApprovalStatus } from '@/lib/exam-types'
import { toast } from 'sonner'

function QuestionsContent() {
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    subjects,
    topics,
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    approveQuestion,
    rejectQuestion,
  } = useExamStore()

  // Filter states
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Expanded question for detailed view
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form states
  const [formSubjectId, setFormSubjectId] = useState<number>(subjects[0]?.id || 1)
  const [formTopicId, setFormTopicId] = useState<number>(topics[0]?.id || 101)
  const [questionText, setQuestionText] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium')
  const [status, setStatus] = useState<ApprovalStatus>('pending')
  const [marks, setMarks] = useState<number>(1.0)
  const [negativeMarks, setNegativeMarks] = useState<number>(0.25)
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState<QuestionOption[]>([
    { key: 'A', text: '', isCorrect: true },
    { key: 'B', text: '', isCorrect: false },
    { key: 'C', text: '', isCorrect: false },
    { key: 'D', text: '', isCorrect: false },
  ])

  // Check URL query param ?action=new to trigger add modal
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenAdd()
    }
  }, [searchParams])

  // Available topics for form subject
  const formAvailableTopics = topics.filter((t) => t.subjectId === formSubjectId)

  // Available topics for filter
  const filterAvailableTopics =
    selectedSubject === 'all'
      ? topics
      : topics.filter((t) => t.subjectId === Number(selectedSubject))

  const handleOpenAdd = () => {
    setEditingQuestion(null)
    setFormSubjectId(subjects[0]?.id || 1)
    const initialTopics = topics.filter((t) => t.subjectId === (subjects[0]?.id || 1))
    setFormTopicId(initialTopics[0]?.id || 101)
    setQuestionText('')
    setDifficulty('medium')
    setStatus('pending')
    setMarks(1.0)
    setNegativeMarks(0.25)
    setExplanation('')
    setOptions([
      { key: 'A', text: '', isCorrect: true },
      { key: 'B', text: '', isCorrect: false },
      { key: 'C', text: '', isCorrect: false },
      { key: 'D', text: '', isCorrect: false },
    ])
    setIsModalOpen(true)
  }

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q)
    setFormSubjectId(q.subjectId)
    setFormTopicId(q.topicId)
    setQuestionText(q.questionText)
    setDifficulty(q.difficulty)
    setStatus(q.status)
    setMarks(q.marks)
    setNegativeMarks(q.negativeMarks)
    setExplanation(q.explanation)
    setOptions(JSON.parse(JSON.stringify(q.options)))
    setIsModalOpen(true)
  }

  const handleOptionTextChange = (index: number, text: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, text } : opt))
    )
  }

  const handleCorrectOptionSelect = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, isCorrect: i === index }))
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error('Question text is required')
      return
    }
    const hasEmptyOption = options.some((opt) => !opt.text.trim())
    if (hasEmptyOption) {
      toast.error('All 4 MCQ options must have text')
      return
    }
    const hasCorrectOption = options.some((opt) => opt.isCorrect)
    if (!hasCorrectOption) {
      toast.error('Please select one correct answer')
      return
    }

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, {
        subjectId: formSubjectId,
        topicId: formTopicId,
        questionText,
        options,
        difficulty,
        status,
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        explanation,
      })
    } else {
      addQuestion({
        subjectId: formSubjectId,
        topicId: formTopicId,
        questionText,
        options,
        difficulty,
        status,
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        explanation,
      })
    }
    setIsModalOpen(false)
  }

  // Filter question list
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.explanation.toLowerCase().includes(search.toLowerCase())
    const matchesSubject =
      selectedSubject === 'all' || q.subjectId === Number(selectedSubject)
    const matchesTopic =
      selectedTopic === 'all' || q.topicId === Number(selectedTopic)
    const matchesDifficulty =
      selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    const matchesStatus =
      selectedStatus === 'all' || q.status === selectedStatus

    return (
      matchesSearch &&
      matchesSubject &&
      matchesTopic &&
      matchesDifficulty &&
      matchesStatus
    )
  })

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Question Bank Repository"
        subtitle="Manage, filter, approve, and curate Government Exam Multiple Choice Questions"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Action bar with search & add */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Icons.Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search questions by keyword or formula..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
            >
              <Icons.Plus size={18} />
              <span>Create Question</span>
            </button>
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-xs">
            {/* Subject filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  setSelectedTopic('all')
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Subjects ({questions.length})</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Topics</option>
                {filterAvailableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Approval Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>
              Showing <strong>{filteredQuestions.length}</strong> questions
            </span>
            <span>Click any question to view options & explanation</span>
          </div>

          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id
            const sub = subjects.find((s) => s.id === q.subjectId)
            const top = topics.find((t) => t.id === q.topicId)

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-blue-200 transition-all space-y-4"
              >
                {/* Header row: Subject, Topic, Difficulty, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {sub?.name || 'General'}
                    </span>
                    <span className="text-gray-400">›</span>
                    <span className="font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {top?.name || 'General Topic'}
                    </span>
                    <span
                      className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                        q.difficulty === 'hard'
                          ? 'bg-rose-100 text-rose-800'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        q.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : q.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <p className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed">
                    {q.questionText}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-3">
                    <span>Marks: +{q.marks}</span>
                    <span>•</span>
                    <span>Negative: -{q.negativeMarks}</span>
                    <span>•</span>
                    <span>Added: {q.createdAt}</span>
                    <span className="text-blue-600 font-medium ml-auto flex items-center gap-1">
                      {isExpanded ? 'Collapse' : 'Show Options'}
                      <Icons.ChevronDown
                        size={14}
                        className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </div>
                </div>

                {/* Collapsible Options & Explanation Section */}
                {isExpanded && (
                  <div className="pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                            opt.isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium ring-1 ring-emerald-300'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="flex-1 mt-0.5">{opt.text}</span>
                          {opt.isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs space-y-1">
                        <span className="font-bold text-blue-900 block">Explanation:</span>
                        <p className="text-blue-800 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Card footer actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {q.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => approveQuestion(q.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        <Icons.Check size={14} />
                        <span>Approve Question</span>
                      </button>
                    )}
                    {q.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => rejectQuestion(q.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-medium transition-colors"
                      >
                        <Icons.Close size={14} />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Question"
                    >
                      <Icons.Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Question"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredQuestions.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Icons.Questions size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-700">No questions found matching your filter criteria.</p>
              <p className="text-xs text-gray-400">Try resetting filters or adding a new MCQ question.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit MCQ Question' : 'Create New MCQ Question'}
        subtitle="Specify question content, 4 options, correct answer, and explanation"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Subject & Topic Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subject *
              </label>
              <select
                value={formSubjectId}
                onChange={(e) => {
                  const newSubId = Number(e.target.value)
                  setFormSubjectId(newSubId)
                  const subTopics = topics.filter((t) => t.subjectId === newSubId)
                  if (subTopics.length > 0) {
                    setFormTopicId(subTopics[0].id)
                  }
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Topic *
              </label>
              <select
                value={formTopicId}
                onChange={(e) => setFormTopicId(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {formAvailableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question statement clearly..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* 4 Options with Radio Button */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Multiple Choice Options (Select the correct answer) *
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div
                  key={opt.key}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                    opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700 pl-1">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectOptionSelect(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Option {opt.key}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    placeholder={`Enter text for option ${opt.key}...`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                  {opt.isCorrect && (
                    <span className="text-[11px] font-bold text-emerald-700 pr-2">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Marks & Difficulty row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Marks (+)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={marks}
                onChange={(e) => setMarks(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Negative (-)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApprovalStatus)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Detailed Solution & Explanation
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Step-by-step reasoning or formula derivation..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              {editingQuestion ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Question"
        subtitle="Are you sure you want to delete this question?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            This question will be removed from the question bank repository and excluded from upcoming tests.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteConfirmId) {
                  deleteQuestion(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
            >
              Delete Question
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-400">
          Loading Question Bank...
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  )
}

