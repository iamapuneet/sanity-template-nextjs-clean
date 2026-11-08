export type Subject = {
  id: number
  name: string
  code: string
  description: string
  icon: string
  questionCount: number
  topicCount: number
  status: 'active' | 'inactive'
  createdAt?: string
}

export type TopicPriority = 'low' | 'medium' | 'high'

export type Topic = {
  id: number
  subjectId: number
  parentId: number | null
  name: string
  code?: string
  priority: TopicPriority
  level?: number
  orderIndex?: number
  questionCount?: number
  children?: Topic[]
}

export type QuestionOption = {
  id?: number
  key: 'A' | 'B' | 'C' | 'D'
  text: string
  isCorrect: boolean
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type Question = {
  id: number
  subjectId: number
  topicId: number
  questionText: string
  options: QuestionOption[]
  difficulty: DifficultyLevel
  status: ApprovalStatus
  marks: number
  negativeMarks: number
  explanation: string
  createdAt: string
  updatedAt?: string
}

export type PracticeTest = {
  id: number
  title: string
  description: string
  subjectId?: number
  topicId?: number
  durationMinutes: number
  totalQuestions?: number
  totalMarks: number
  passingPercentage: number
  questionIds: number[]
  status?: 'draft' | 'published'
  createdAt: string
}

export type DashboardSummary = {
  totalSubjects: number
  totalTopics: number
  totalQuestions: number
  approvedQuestions: number
  pendingQuestions: number
}

