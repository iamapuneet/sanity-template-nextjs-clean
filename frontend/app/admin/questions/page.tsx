'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

function QuestionsContent() {
  const searchParams = useSearchParams()

  const [questions, setQuestions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')

  // Expanded question for detailed view
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Form states
  const [formSubjectId, setFormSubjectId] = useState<number | ''>('')
  const [formTopicId, setFormTopicId] = useState<number | ''>('')
  const [questionText, setQuestionText] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [status, setStatus] = useState<'draft' | 'pending' | 'approved' | 'rejected'>('approved')
  const [languageCode, setLanguageCode] = useState<'hi' | 'en'>('hi')
  const [defaultMarks, setDefaultMarks] = useState<number>(1.0)
  const [defaultNegativeMarks, setDefaultNegativeMarks] = useState<number>(0.25)
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState([
    { key: 'A', text: '', isCorrect: true },
    { key: 'B', text: '', isCorrect: false },
    { key: 'C', text: '', isCorrect: false },
    { key: 'D', text: '', isCorrect: false },
  ])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedSubject !== 'all') params.append('subject_id', selectedSubject)
      if (selectedTopic !== 'all') params.append('topic_id', selectedTopic)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage)
      if (search.trim()) params.append('search', search.trim())

      const res = await fetch(`/api/admin/questions?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setQuestions(json.questions)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadFilterData = async () => {
    try {
      const [resSubs, resTops] = await Promise.all([
        fetch('/api/admin/subjects').then((r) => r.json()),
        fetch('/api/admin/topics').then((r) => r.json()),
      ])
      if (resSubs.success) setSubjects(resSubs.subjects)
      if (resTops.success) setTopics(resTops.topics)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadFilterData()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [selectedSubject, selectedTopic, selectedDifficulty, selectedStatus, selectedLanguage])

  // Trigger modal if ?action=new is in query string
  useEffect(() => {
    if (searchParams.get('action') === 'new' && subjects.length > 0) {
      handleOpenAdd()
    }
  }, [searchParams, subjects])

  const handleOpenAdd = () => {
    setEditingQuestion(null)
    const firstSubId = subjects[0]?.id || 1
    setFormSubjectId(firstSubId)
    const subTopics = topics.filter((t) => t.subject_id === firstSubId)
    setFormTopicId(subTopics[0]?.id || '')
    setQuestionText('')
    setDifficulty('medium')
    setStatus('approved')
    setLanguageCode('hi')
    setDefaultMarks(1.0)
    setDefaultNegativeMarks(0.25)
    setExplanation('')
    setOptions([
      { key: 'A', text: '', isCorrect: true },
      { key: 'B', text: '', isCorrect: false },
      { key: 'C', text: '', isCorrect: false },
      { key: 'D', text: '', isCorrect: false },
    ])
    setIsModalOpen(true)
  }

  const handleOpenEdit = (q: any) => {
    setEditingQuestion(q)
    setFormSubjectId(q.subject_id)
    setFormTopicId(q.topic_id)
    setQuestionText(q.question_text)
    setDifficulty(q.difficulty || 'medium')
    setStatus(q.status || 'approved')
    setLanguageCode(q.language_code || 'en')
    setDefaultMarks(Number(q.default_marks || 1.0))
    setDefaultNegativeMarks(Number(q.default_negative_marks || 0.25))
    setExplanation(q.explanation || '')
    setOptions(
      q.options && q.options.length > 0
        ? q.options.map((o: any) => ({
            key: o.key,
            text: o.text,
            isCorrect: Boolean(o.isCorrect),
          }))
        : [
            { key: 'A', text: '', isCorrect: true },
            { key: 'B', text: '', isCorrect: false },
            { key: 'C', text: '', isCorrect: false },
            { key: 'D', text: '', isCorrect: false },
          ]
    )
    setIsModalOpen(true)
  }

  const handleCorrectOptionChange = (key: string) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.key === key,
      }))
    )
  }

  const handleOptionTextChange = (key: string, text: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.key === key ? { ...opt, text } : opt))
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formSubjectId || !formTopicId || !questionText.trim()) {
      return alert('Subject, topic, and question text are required.')
    }

    const hasEmptyOption = options.some((o) => !o.text.trim())
    if (hasEmptyOption) {
      return alert('All 4 option choices must have text filled in.')
    }

    try {
      const payload = {
        subject_id: formSubjectId,
        topic_id: formTopicId,
        question_text: questionText,
        difficulty,
        status,
        language_code: languageCode,
        default_marks: defaultMarks,
        default_negative_marks: defaultNegativeMarks,
        explanation,
        options,
      }

      const method = editingQuestion ? 'PUT' : 'POST'
      const url = '/api/admin/questions'
      const body = editingQuestion ? { ...payload, id: editingQuestion.id } : payload

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (json.success) {
        setIsModalOpen(false)
        fetchQuestions()
      } else {
        alert(json.error || 'Failed to save question')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving question')
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        fetchQuestions()
      } else {
        alert(json.error || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteConfirmId(null)
        fetchQuestions()
      } else {
        alert(json.error || 'Failed to delete question')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filterTopics =
    selectedSubject === 'all'
      ? topics
      : topics.filter((t) => t.subject_id === Number(selectedSubject))

  const formTopics =
    formSubjectId === ''
      ? []
      : topics.filter((t) => t.subject_id === Number(formSubjectId))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Question Bank</h1>
          <p className="text-sm text-gray-500">
            Curated Rajasthan Informatics Assistant MCQ repository with bilingual support (Hindi & English).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Icons.Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search question statement or explanation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value)
                setSelectedTopic('all')
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-semibold text-gray-800"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-semibold text-gray-800"
            >
              <option value="all">All Topics</option>
              {filterTopics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-semibold text-gray-800"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-semibold text-gray-800"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold uppercase text-[10px]">Status:</span>
            {['all', 'approved', 'pending', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] transition-colors ${
                  selectedStatus === st
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <div className="font-bold text-gray-600">{questions.length} questions loaded</div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading question bank...</div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-3">
          <p className="text-sm font-semibold text-gray-700">No questions found matching your filter criteria.</p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
          >
            <Icons.Plus size={14} /> Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedId === q.id
            const isApproved = q.status === 'approved'

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black transition-all shadow-xs"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-black">Q#{q.id}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-bold text-gray-800">{q.subject_name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{q.topic_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200">
                      {q.language_code === 'hi' ? 'हिंदी (HI)' : 'ENG (EN)'}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {q.difficulty}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        q.status === 'approved'
                          ? 'bg-black text-white'
                          : q.status === 'pending'
                          ? 'bg-neutral-200 text-black'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-relaxed mb-4">
                  {q.question_text}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {q.options?.map((opt: any) => (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-neutral-100 border-black text-black font-bold'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                            opt.isCorrect ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black text-white">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation accordion */}
                {isExpanded && q.explanation && (
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 mb-4 space-y-1">
                    <span className="font-bold text-black uppercase text-[10px] block">
                      Explanation / व्याख्या:
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="text-gray-600 hover:text-black font-semibold flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Explanation' : 'View Explanation'}</span>
                    <Icons.ChevronDown
                      size={14}
                      className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div className="flex items-center gap-2">
                    {!isApproved ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(q.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
                      >
                        Approve Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(q.id, 'pending')}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
                      >
                        Mark Pending
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                      title="Edit Question"
                    >
                      <Icons.Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                      title="Delete Question"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add Question to Bank'}
        subtitle="Specify question statement, options, correct answer, and explanation"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Subject *
              </label>
              <select
                required
                value={formSubjectId}
                onChange={(e) => {
                  const sId = Number(e.target.value)
                  setFormSubjectId(sId)
                  const subTopics = topics.filter((t) => t.subject_id === sId)
                  setFormTopicId(subTopics[0]?.id || '')
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Topic *
              </label>
              <select
                required
                value={formTopicId}
                onChange={(e) => setFormTopicId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                {formTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Language *
              </label>
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value as 'hi' | 'en')}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                <option value="hi">Hindi (हिंदी)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Question Statement *
            </label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the full question text here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* 4 MCQ Options */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              4 Selectable Options (Radio Select Correct Answer) *
            </label>
            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.key}
                  className={`flex items-center gap-3 p-2 rounded-xl border ${
                    opt.isCorrect ? 'border-black bg-neutral-50' : 'border-gray-200'
                  }`}
                >
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0 font-bold text-xs">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectOptionChange(opt.key)}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span>Option {opt.key}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(opt.key, e.target.value)}
                    placeholder={`Enter text for Option ${opt.key}...`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Marks & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-black font-medium"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Positive Marks
              </label>
              <input
                type="number"
                step="0.25"
                value={defaultMarks}
                onChange={(e) => setDefaultMarks(parseFloat(e.target.value))}
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
                value={defaultNegativeMarks}
                onChange={(e) => setDefaultNegativeMarks(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Detailed Solution & Explanation (व्याख्या)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Step-by-step reasoning or formula breakdown..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
            >
              {editingQuestion ? 'Update Question' : 'Save to Bank'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Question"
        subtitle="Confirm question removal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Are you sure you want to delete this question? It will be removed from future tests.
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
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
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

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Loading Question Bank...</div>}>
      <QuestionsContent />
    </Suspense>
  )
}
