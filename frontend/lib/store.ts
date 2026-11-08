'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Subject, Topic, Question, PracticeTest, DashboardSummary } from './exam-types'
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_TESTS } from './mock-data'
import { toast } from 'sonner'

interface ExamStoreContextType {
  subjects: Subject[]
  topics: Topic[]
  questions: Question[]
  tests: PracticeTest[]
  summary: DashboardSummary
  addSubject: (subject: Omit<Subject, 'id' | 'questionCount' | 'topicCount' | 'createdAt'>) => void
  updateSubject: (id: number, updates: Partial<Subject>) => void
  deleteSubject: (id: number) => void
  addTopic: (topic: Omit<Topic, 'id' | 'questionCount'>) => void
  updateTopic: (id: number, updates: Partial<Topic>) => void
  deleteTopic: (id: number) => void
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void
  updateQuestion: (id: number, updates: Partial<Question>) => void
  deleteQuestion: (id: number) => void
  approveQuestion: (id: number) => void
  rejectQuestion: (id: number) => void
  addPracticeTest: (test: Omit<PracticeTest, 'id' | 'createdAt'>) => void
  updatePracticeTest: (id: number, updates: Partial<PracticeTest>) => void
  deletePracticeTest: (id: number) => void
  getSubjectById: (id: number) => Subject | undefined
  getTopicById: (id: number) => Topic | undefined
  getTopicsBySubject: (subjectId: number) => Topic[]
}

const ExamStoreContext = createContext<ExamStoreContextType | null>(null)

export function ExamStoreProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS)
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [tests, setTests] = useState<PracticeTest[]>(INITIAL_TESTS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on client side mount
  useEffect(() => {
    try {
      const storedSubs = localStorage.getItem('examforge_subjects')
      const storedTops = localStorage.getItem('examforge_topics')
      const storedQs = localStorage.getItem('examforge_questions')
      const storedTests = localStorage.getItem('examforge_tests')

      if (storedSubs) setSubjects(JSON.parse(storedSubs))
      if (storedTops) setTopics(JSON.parse(storedTops))
      if (storedQs) setQuestions(JSON.parse(storedQs))
      if (storedTests) setTests(JSON.parse(storedTests))
    } catch {
      // Use defaults if storage unavailable
    }
    setIsLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem('examforge_subjects', JSON.stringify(subjects))
      localStorage.setItem('examforge_topics', JSON.stringify(topics))
      localStorage.setItem('examforge_questions', JSON.stringify(questions))
      localStorage.setItem('examforge_tests', JSON.stringify(tests))
    } catch {
      // Ignore write errors
    }
  }, [subjects, topics, questions, tests, isLoaded])

  // Subjects CRUD
  const addSubject = (data: Omit<Subject, 'id' | 'questionCount' | 'topicCount' | 'createdAt'>) => {
    const newSub: Subject = {
      ...data,
      id: Date.now(),
      questionCount: 0,
      topicCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setSubjects((prev) => [newSub, ...prev])
    toast.success(`Subject "${data.name}" added successfully!`)
  }

  const updateSubject = (id: number, updates: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
    toast.success('Subject updated successfully!')
  }

  const deleteSubject = (id: number) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    toast.info('Subject deleted successfully.')
  }

  // Topics CRUD
  const addTopic = (data: Omit<Topic, 'id' | 'questionCount'>) => {
    const newTopic: Topic = {
      ...data,
      id: Date.now(),
      questionCount: 0,
    }
    setTopics((prev) => [...prev, newTopic])
    // Update topic count in subject
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === data.subjectId ? { ...s, topicCount: (s.topicCount || 0) + 1 } : s
      )
    )
    toast.success(`Topic "${data.name}" added successfully!`)
  }

  const updateTopic = (id: number, updates: Partial<Topic>) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
    toast.success('Topic updated successfully!')
  }

  const deleteTopic = (id: number) => {
    const topicToDelete = topics.find((t) => t.id === id)
    setTopics((prev) => prev.filter((t) => t.id !== id && t.parentId !== id))
    if (topicToDelete) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === topicToDelete.subjectId
            ? { ...s, topicCount: Math.max(0, (s.topicCount || 1) - 1) }
            : s
        )
      )
    }
    toast.info('Topic and sub-topics removed.')
  }

  // Questions CRUD & Approval
  const addQuestion = (data: Omit<Question, 'id' | 'createdAt'>) => {
    const newQ: Question = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setQuestions((prev) => [newQ, ...prev])
    // Increment question count in subject & topic
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === data.subjectId ? { ...s, questionCount: (s.questionCount || 0) + 1 } : s
      )
    )
    setTopics((prev) =>
      prev.map((t) =>
        t.id === data.topicId ? { ...t, questionCount: (t.questionCount || 0) + 1 } : t
      )
    )
    toast.success('Question added to question bank!')
  }

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
    toast.success('Question updated successfully!')
  }

  const deleteQuestion = (id: number) => {
    const q = questions.find((item) => item.id === id)
    setQuestions((prev) => prev.filter((item) => item.id !== id))
    if (q) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === q.subjectId
            ? { ...s, questionCount: Math.max(0, (s.questionCount || 1) - 1) }
            : s
        )
      )
    }
    toast.info('Question removed from question bank.')
  }

  const approveQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'approved' } : q))
    )
    toast.success('Question approved and ready for tests!')
  }

  const rejectQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'rejected' } : q))
    )
    toast.warning('Question marked as rejected.')
  }

  // Tests CRUD
  const addPracticeTest = (data: Omit<PracticeTest, 'id' | 'createdAt'>) => {
    const newTest: PracticeTest = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setTests((prev) => [newTest, ...prev])
    toast.success(`Practice Test "${data.title}" created successfully!`)
  }

  const updatePracticeTest = (id: number, updates: Partial<PracticeTest>) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
    toast.success('Practice test updated successfully!')
  }

  const deletePracticeTest = (id: number) => {
    setTests((prev) => prev.filter((t) => t.id !== id))
    toast.info('Practice test removed.')
  }

  // Helpers
  const getSubjectById = (id: number) => subjects.find((s) => s.id === id)
  const getTopicById = (id: number) => topics.find((t) => t.id === id)
  const getTopicsBySubject = (subjectId: number) =>
    topics.filter((t) => t.subjectId === subjectId)

  // Summary Metrics
  const summary: DashboardSummary = {
    totalSubjects: subjects.length,
    totalTopics: topics.length,
    totalQuestions: questions.length,
    approvedQuestions: questions.filter((q) => q.status === 'approved').length,
    pendingQuestions: questions.filter((q) => q.status === 'pending').length,
  }

  return (
    <ExamStoreContext.Provider
      value={{
        subjects,
        topics,
        questions,
        tests,
        summary,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        updateTopic,
        deleteTopic,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        approveQuestion,
        rejectQuestion,
        addPracticeTest,
        updatePracticeTest,
        deletePracticeTest,
        getSubjectById,
        getTopicById,
        getTopicsBySubject,
      }}
    >
      {children}
    </ExamStoreContext.Provider>
  )
}

export function useExamStore() {
  const context = useContext(ExamStoreContext)
  if (!context) {
    throw new Error('useExamStore must be used within an ExamStoreProvider')
  }
  return context
}

