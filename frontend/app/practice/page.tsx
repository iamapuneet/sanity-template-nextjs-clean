'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icons } from '@/components/admin/Icons'
import { ExamForgeLogo } from '@/components/brand'
import BookmarkModal from '@/components/student/BookmarkModal'
import StudentResultsModal from '@/components/student/StudentResultsModal'

interface SubjectItem {
  id: string
  name: string
  code: string
  description?: string
  icon?: string
  tests_count: string | number
  low_tests_count: string | number
  medium_tests_count: string | number
  high_tests_count: string | number
}

interface AssessmentItem {
  id: number
  title: string
  slug: string
  description?: string
  assessment_type: string
  duration_minutes: number
  total_questions: number
  total_marks: number
  passing_percentage: number
  difficulty_level: string
  subject_id: number | null
  topic_id?: number | null
  subject_name: string | null
  subject_code: string | null
  topic_name?: string | null
  main_topic_id?: number | null
  main_topic_name?: string | null
  exam_name?: string
  attempt_status?: string | null
  last_score?: number | string | null
}

interface TopicItem {
  id: number | string
  subject_id: number | string
  name: string
  hindiName?: string
  description?: string
  level?: number
  tests_count?: number
}

// 6 Available Subjects
const CORE_SUBJECT_OPTIONS = [
  {
    id: 'all',
    name: 'All Subjects (सम्पूर्ण)',
    hindiName: 'सम्पूर्ण पाठ्यक्रम',
    code: 'ALL',
    description: 'Comprehensive practice questions combined across all exam syllabus subjects.',
  },
  {
    id: '1',
    name: 'Computer Knowledge',
    hindiName: 'कंप्यूटर ज्ञान (90 प्रश्न - 60%)',
    code: 'CIT',
    description: 'Fundamentals, Number System, OS, MS Office & DB, Networking, Cyber Security, Programming in C, Algorithms & IDE.',
  },
  {
    id: '2',
    name: 'Reasoning & Mental Ability',
    hindiName: 'तार्किक योग्यता (30 प्रश्न - 20%)',
    code: 'RMA',
    description: 'Series, Coding-Decoding, Blood Relations, Direction, Analogy, Puzzles, Data Sufficiency, Logical & Non-Verbal.',
  },
  {
    id: '3',
    name: 'Mathematics',
    hindiName: 'गणित (20 प्रश्न - 13.3%)',
    code: 'MATH',
    description: 'Number System, HCF & LCM, Simplification, Algebra, Percentage, Average, Permutation & Combination, Data Interpretation.',
  },
  {
    id: '4',
    name: 'General Knowledge (GK)',
    hindiName: 'सामान्य ज्ञान (10 प्रश्न - 6.7%)',
    code: 'GK',
    description: 'Rajasthan GK (History, Geography, Culture, Polity, Schemes), Indian Geography & Census, Science & Current Affairs.',
  },
  {
    id: 'full_mock',
    name: 'Full-Length Mock Tests',
    hindiName: 'सम्पूर्ण मॉक टेस्ट (परीक्षा पैटर्न)',
    code: 'FULL',
    description: 'Complete official exam pattern drill covering full syllabus under timed conditions.',
  },
]

// Main Topic Registry by Subject with rich Hindi descriptions
const SYLLABUS_MAIN_TOPICS: Record<string, TopicItem[]> = {
  // Reasoning (Subject 2)
  '2': [
    {
      id: '823',
      subject_id: '2',
      name: 'Blood Relations',
      hindiName: 'रक्त संबंध (Blood Relations)',
      description: 'Family relationship terms, same-generation, maternal/paternal, direct relationships & pointing-to-person questions.',
    },
    {
      id: '805',
      subject_id: '2',
      name: 'Number and Alphabet Series',
      hindiName: 'संख्या एवं वर्णमाला श्रृंखला',
      description: 'Missing numbers, letter pattern repetition, increasing/decreasing numerical series and mixed drills.',
    },
    {
      id: '814',
      subject_id: '2',
      name: 'Coding-Decoding',
      hindiName: 'कूटलेखन / डिकोडिंग (Coding-Decoding)',
      description: 'Letter shift algorithms, substitution codes, number-symbol coding and matrix decoding.',
    },
    {
      id: '832',
      subject_id: '2',
      name: 'Direction Sense',
      hindiName: 'दिशा ज्ञान परीक्षण (Direction Sense)',
      description: 'Cardinal directions (N/S/E/W), angular turns, shadow concepts, distance & displacement drills.',
    },
    {
      id: '840',
      subject_id: '2',
      name: 'Analogy',
      hindiName: 'सादृश्यता परीक्षण (Analogy)',
      description: 'Word analogy, number-pair relationships, letter analogy and general knowledge relationships.',
    },
    {
      id: '847',
      subject_id: '2',
      name: 'Classification / Odd One Out',
      hindiName: 'वर्गीकरण / विजातीय छांटना',
      description: 'Spotting the odd element among words, numbers, letters and geometric patterns.',
    },
    {
      id: '854',
      subject_id: '2',
      name: 'Alphabetical Order',
      hindiName: 'वर्णमाला क्रम परीक्षण',
      description: 'Dictionary word sequencing, meaningful word formation and position value tests.',
    },
    {
      id: '861',
      subject_id: '2',
      name: 'Mathematical Operations',
      hindiName: 'गणितीय संक्रियाएं (BODMAS)',
      description: 'Symbol interchange, arithmetic operations balance and equation validation.',
    },
    {
      id: '867',
      subject_id: '2',
      name: 'Data Sufficiency',
      hindiName: 'आंकड़ा पर्याप्तता (Data Sufficiency)',
      description: 'Statement evaluation, logical sufficiency to answer questions in minimal statements.',
    },
    {
      id: '875',
      subject_id: '2',
      name: 'Arrangement and Puzzles',
      hindiName: 'बैठक व्यवस्था एवं पहेलियां',
      description: 'Linear seating, circular arrangements, tabular puzzles and rank-order comparisons.',
    },
    {
      id: '885',
      subject_id: '2',
      name: 'Logical Reasoning',
      hindiName: 'तार्किक विश्लेषण (Statements & Arguments)',
      description: 'Statement-assumptions, statement-conclusions, cause and effect, assertion-reasoning.',
    },
    {
      id: '895',
      subject_id: '2',
      name: 'Non-Verbal Reasoning',
      hindiName: 'अशाब्दिक तर्कशक्ति (Non-Verbal)',
      description: 'Mirror & water images, paper folding/cutting, figure completion, embedded figures and cube dice.',
    },
  ],

  // Computer Knowledge (Subject 1)
  '1': [
    {
      id: '734',
      subject_id: '1',
      name: 'Programming, Algorithms and IDE',
      hindiName: 'प्रोग्रामिंग, एल्गोरिदम एवं फ्लोचार्ट',
      description: 'C programming language, data types, operators, flowcharts symbols, algorithms, and IDE basics.',
    },
    {
      id: '473',
      subject_id: '1',
      name: 'Computer Fundamentals and Hardware',
      hindiName: 'कंप्यूटर का मूल परिचय एवं हार्डवेयर',
      description: 'Generations of computers, CPU architecture, input/output devices, memory types (RAM/ROM/Cache).',
    },
    {
      id: '513',
      subject_id: '1',
      name: 'Number System and Data Representation',
      hindiName: 'संख्या प्रणाली एवं डेटा निरूपण',
      description: 'Binary, octal, decimal, hexadecimal conversions, ASCII, Unicode and 2s complement.',
    },
    {
      id: '540',
      subject_id: '1',
      name: 'Operating System (OS)',
      hindiName: 'ऑपरेटिंग सिस्टम (OS Concepts)',
      description: 'Process management, CPU scheduling, virtual memory, paging, file systems, Linux & Windows.',
    },
    {
      id: '585',
      subject_id: '1',
      name: 'MS Office and Database',
      hindiName: 'एमएस ऑफिस एवं डेटाबेस (MS Office & DBMS)',
      description: 'MS Word, Excel formulas/charts, PowerPoint, Access, relational database, SQL queries & keys.',
    },
    {
      id: '645',
      subject_id: '1',
      name: 'Networking and Data Communication',
      hindiName: 'नेटवर्किंग एवं डेटा संचार',
      description: 'OSI 7-layer model, TCP/IP, IP addressing, routing, protocols (HTTP, FTP, DNS), topologies.',
    },
    {
      id: '705',
      subject_id: '1',
      name: 'Cyber Security and IT Law',
      hindiName: 'साइबर सुरक्षा एवं आईटी अधिनियम',
      description: 'Malware types (virus, trojan, ransomware), cryptography, firewalls, cyber ethics, and IT Act 2000.',
    },
  ],

  // Mathematics (Subject 3)
  '3': [
    {
      id: '906',
      subject_id: '3',
      name: 'Number System',
      hindiName: 'संख्या पद्धति (Number System)',
      description: 'Types of numbers, prime numbers, divisibility tests, unit digit and remainders.',
    },
    {
      id: '918',
      subject_id: '3',
      name: 'HCF, LCM and Divisibility',
      hindiName: 'ल.स.प. एवं म.स.प. (HCF & LCM)',
      description: 'Factors, multiples, prime factorization, application problems on bells/races.',
    },
    {
      id: '926',
      subject_id: '3',
      name: 'Simplification and Decimals',
      hindiName: 'सरलीकरण एवं दशमलव भिन्न',
      description: 'BODMAS rule, vulgar fractions, recurring decimals, powers, roots and surds.',
    },
    {
      id: '937',
      subject_id: '3',
      name: 'Algebra and Word Problems',
      hindiName: 'बीजगणित एवं शब्द समस्याएं',
      description: 'Linear equations in one/two variables, age problems, ratio & proportion applications.',
    },
    {
      id: '949',
      subject_id: '3',
      name: 'Percentage',
      hindiName: 'प्रतिशतता (Percentage)',
      description: 'Concept of percent, fractional equivalents, population change, profit-loss applications.',
    },
    {
      id: '958',
      subject_id: '3',
      name: 'Average',
      hindiName: 'औसत (Average)',
      description: 'Arithmetic mean, weighted average, inclusion/exclusion of items, speed averages.',
    },
    {
      id: '966',
      subject_id: '3',
      name: 'Permutation and Combination',
      hindiName: 'क्रमचय एवं संचय (Permutation & Combination)',
      description: 'Fundamental counting principle, factorial notation, arrangements and selections.',
    },
    {
      id: '975',
      subject_id: '3',
      name: 'Data Interpretation (DI)',
      hindiName: 'समंकों का विश्लेषण (Data Interpretation)',
      description: 'Bar graphs, line charts, pie charts, tabular analysis and trend questions.',
    },
  ],

  // General Knowledge (Subject 4)
  '4': [
    {
      id: '986',
      subject_id: '4',
      name: 'Rajasthan General Knowledge',
      hindiName: 'राजस्थान सामान्य ज्ञान (History, Geography & Culture)',
      description: 'Rajasthan history, forts, palaces, folk dances, fairs, festivals, geography, rivers, and schemes.',
    },
    {
      id: '1043',
      subject_id: '4',
      name: 'Indian Geography and Census',
      hindiName: 'भारत का भूगोल एवं जनगणना',
      description: 'Physiographic divisions of India, major rivers, climate, agriculture, minerals, and 2011 Census.',
    },
    {
      id: '1055',
      subject_id: '4',
      name: 'General Science',
      hindiName: 'सामान्य विज्ञान (Everyday Science)',
      description: 'Physics fundamentals, chemistry in daily life, human biology, diseases, nutrition and environment.',
    },
    {
      id: '1069',
      subject_id: '4',
      name: 'Sports and Current Affairs',
      hindiName: 'समसामयिक घटनाएं एवं खेलकूद',
      description: 'Major current affairs of Rajasthan & India, awards, appointments, summits, sports & tournaments.',
    },
  ],
}

const DIFFICULTY_OPTIONS = [
  {
    id: 'easy',
    name: 'Easy (सरल)',
    hindiName: 'सरल स्तर',
    subtitle: 'Basic concept questions',
    description: 'Fundamental syllabus questions focusing on core concepts, definitions, and direct recall.',
  },
  {
    id: 'medium',
    name: 'Medium (मध्यम)',
    hindiName: 'मध्यम स्तर',
    subtitle: 'Standard examination questions',
    description: 'Standard examination difficulty matching previous official Rajasthan Informatics Assistant papers.',
  },
  {
    id: 'hard',
    name: 'Hard (कठिन)',
    hindiName: 'कठिन स्तर',
    subtitle: 'Advanced analytical questions',
    description: 'Complex multi-step problems, advanced technical logic, and in-depth analytical drills.',
  },
]

function PracticePortalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 4-Step Guided Flow State (1: Subject, 2: Topic, 3: Difficulty, 4: Practice Test)
  const initialStep = useMemo<1 | 2 | 3 | 4>(() => {
    const s = searchParams.get('step')
    if (s === '4') return 4
    if (s === '3') return 3
    if (s === '2') return 2
    return 1
  }, [searchParams])

  const initialSubject = useMemo<string>(() => {
    const sub = searchParams.get('subject')
    if (sub && CORE_SUBJECT_OPTIONS.some((s) => s.id === sub)) return sub
    return 'all'
  }, [searchParams])

  const initialTopic = useMemo<string>(() => {
    const t = searchParams.get('topic')
    return t || 'all'
  }, [searchParams])

  const initialDiff = useMemo<'easy' | 'medium' | 'hard' | null>(() => {
    const diff = searchParams.get('diff')
    if (diff === 'easy' || diff === 'medium' || diff === 'hard') return diff
    return null
  }, [searchParams])

  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Guided Flow States
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialStep)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubject)
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(initialDiff)
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [showBookmarksModal, setShowBookmarksModal] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState<number>(0)
  const [showResultsModal, setShowResultsModal] = useState(false)

  // Sync state if browser back/forward buttons change searchParams
  useEffect(() => {
    setCurrentStep(initialStep)
    setSelectedSubjectId(initialSubject)
    setSelectedTopic(initialTopic)
    setSelectedDifficulty(initialDiff)
  }, [initialStep, initialSubject, initialTopic, initialDiff])

  // Fetch bookmarks count
  useEffect(() => {
    if (!currentStudent?.id) return
    let active = true
    fetch(`/api/student/bookmarks?student_id=${currentStudent.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (active && data.success) {
          setBookmarkCount(data.count || 0)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [currentStudent?.id, showBookmarksModal])

  // Fetch assessments, subjects, and student profile
  const loadData = async () => {
    try {
      setLoading(true)
      const [resProfile, resTests, resSubs] = await Promise.all([
        fetch('/api/student/profile').then((r) => r.json()),
        fetch('/api/student/assessments').then((r) => r.json()),
        fetch('/api/student/subjects').then((r) => r.json()),
      ])

      if (resProfile.success && resProfile.student) {
        setCurrentStudent(resProfile.student)
      } else if (resProfile.code === 'UNAUTHENTICATED' || resTests.code === 'UNAUTHENTICATED') {
        router.push('/login?redirect=/practice')
        return
      }

      if (resTests.success) {
        setAssessments(resTests.assessments || [])
      }

      if (resSubs.success && resSubs.subjects?.length > 0) {
        setSubjects(resSubs.subjects)
      }
    } catch (err) {
      console.error('Error loading practice portal data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Sync navigation state with browser history URL
  const updateUrlParams = (
    step: 1 | 2 | 3 | 4,
    subId: string,
    topicName: string,
    diff: string | null
  ) => {
    const params = new URLSearchParams()
    params.set('step', String(step))
    if (subId && subId !== 'all') params.set('subject', subId)
    if (topicName && topicName !== 'all') params.set('topic', topicName)
    if (diff) params.set('diff', diff)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ step, subId, topicName, diff }, '', newUrl)
  }

  // Normalizer helper: maps difficulty to 'easy', 'medium', or 'hard'
  const normalizeDiff = (d?: string): 'easy' | 'medium' | 'hard' => {
    const val = (d || 'medium').toLowerCase()
    if (val === 'low' || val === 'easy') return 'easy'
    if (val === 'high' || val === 'hard') return 'hard'
    return 'medium'
  }

  // Active Subject Object
  const activeSubject = useMemo(() => {
    return CORE_SUBJECT_OPTIONS.find((s) => s.id === selectedSubjectId) || CORE_SUBJECT_OPTIONS[0]
  }, [selectedSubjectId])

  // Subject test counts
  const subjectTestCounts = useMemo(() => {
    const map: Record<string, number> = {
      all: assessments.length,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      full_mock: 0,
    }

    assessments.forEach((t) => {
      if (t.subject_id === null) {
        map['full_mock'] = (map['full_mock'] || 0) + 1
      } else {
        const subIdStr = String(t.subject_id)
        map[subIdStr] = (map[subIdStr] || 0) + 1
      }
    })

    return map
  }, [assessments])

  // Topics available for the selected subject
  const availableTopics = useMemo<TopicItem[]>(() => {
    if (selectedSubjectId === 'all' || selectedSubjectId === 'full_mock') {
      // Return combined topics across all subjects or from tests
      const combined: TopicItem[] = []
      for (const [subId, list] of Object.entries(SYLLABUS_MAIN_TOPICS)) {
        combined.push(...list)
      }
      return combined
    }
    return SYLLABUS_MAIN_TOPICS[selectedSubjectId] || []
  }, [selectedSubjectId])

  // Count tests per topic for the active subject
  const topicTestCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    // Scoped tests for this subject
    const scoped = assessments.filter((t) => {
      if (selectedSubjectId === 'full_mock') return t.subject_id === null
      if (selectedSubjectId !== 'all') return String(t.subject_id) === String(selectedSubjectId)
      return true
    })

    for (const t of scoped) {
      const mainName = t.main_topic_name || 'General Mock Tests'
      counts[mainName] = (counts[mainName] || 0) + 1
      if (t.topic_name && t.topic_name !== mainName) {
        counts[t.topic_name] = (counts[t.topic_name] || 0) + 1
      }
    }

    return counts
  }, [assessments, selectedSubjectId])

  // Count tests in currently selected subject & topic for each difficulty level
  const difficultyCounts = useMemo(() => {
    const scoped = assessments.filter((t) => {
      // 1. Subject match
      if (selectedSubjectId === 'full_mock') {
        if (t.subject_id !== null) return false
      } else if (selectedSubjectId !== 'all') {
        if (String(t.subject_id) !== String(selectedSubjectId)) return false
      }
      // 2. Topic match
      if (selectedTopic !== 'all') {
        const testMain = (t.main_topic_name || '').toLowerCase()
        const target = selectedTopic.toLowerCase()
        const testSub = (t.topic_name || '').toLowerCase()
        if (testMain !== target && !testMain.includes(target) && !testSub.includes(target)) {
          return false
        }
      }
      return true
    })

    return {
      all: scoped.length,
      easy: scoped.filter((t) => normalizeDiff(t.difficulty_level) === 'easy').length,
      medium: scoped.filter((t) => normalizeDiff(t.difficulty_level) === 'medium').length,
      hard: scoped.filter((t) => normalizeDiff(t.difficulty_level) === 'hard').length,
    }
  }, [assessments, selectedSubjectId, selectedTopic])

  // Final Filtered Assessments for Step 4
  const finalFilteredAssessments = useMemo(() => {
    return assessments.filter((test) => {
      // 1. Subject match
      if (selectedSubjectId === 'full_mock') {
        if (test.subject_id !== null) return false
      } else if (selectedSubjectId !== 'all') {
        if (String(test.subject_id) !== String(selectedSubjectId)) return false
      }

      // 2. Topic match
      if (selectedTopic !== 'all') {
        const testMain = (test.main_topic_name || '').toLowerCase()
        const target = selectedTopic.toLowerCase()
        const testSub = (test.topic_name || '').toLowerCase()
        if (testMain !== target && !testMain.includes(target) && !testSub.includes(target)) {
          return false
        }
      }

      // 3. Difficulty match
      if (selectedDifficulty) {
        const testDiff = normalizeDiff(test.difficulty_level)
        if (testDiff !== selectedDifficulty) return false
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = test.title?.toLowerCase().includes(q)
        const matchDesc = test.description?.toLowerCase().includes(q)
        const matchSubject = test.subject_name?.toLowerCase().includes(q)
        const matchTopic = test.topic_name?.toLowerCase().includes(q)
        const matchMain = test.main_topic_name?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchSubject && !matchTopic && !matchMain) return false
      }

      return true
    })
  }, [assessments, selectedSubjectId, selectedTopic, selectedDifficulty, searchQuery])

  // Navigation handlers
  const handleProceedToStep2 = (subId?: string) => {
    const sId = subId || selectedSubjectId
    setSelectedSubjectId(sId)
    setSelectedTopic('all')
    setCurrentStep(2)
    updateUrlParams(2, sId, 'all', selectedDifficulty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProceedToStep3 = (topicName?: string) => {
    const tName = topicName !== undefined ? topicName : selectedTopic
    setSelectedTopic(tName)
    setCurrentStep(3)
    updateUrlParams(3, selectedSubjectId, tName, selectedDifficulty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProceedToStep4 = (diff?: 'easy' | 'medium' | 'hard') => {
    const dVal = diff || selectedDifficulty || 'medium'
    setSelectedDifficulty(dVal)
    setCurrentStep(4)
    updateUrlParams(4, selectedSubjectId, selectedTopic, dVal)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToStep1 = () => {
    setCurrentStep(1)
    updateUrlParams(1, selectedSubjectId, selectedTopic, selectedDifficulty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToStep2 = () => {
    setCurrentStep(2)
    updateUrlParams(2, selectedSubjectId, selectedTopic, selectedDifficulty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToStep3 = () => {
    setCurrentStep(3)
    updateUrlParams(3, selectedSubjectId, selectedTopic, selectedDifficulty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#101010] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#222222] selection:text-[#FFFFFF]">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-[#101010] border-b border-[#303030]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ExamForgeLogo variant="badge" size={20} className="w-9 h-9 rounded-xl group-hover:border-[#FAFAFA]/40 transition-colors" />
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#FFFFFF] block leading-tight">
                ExamForge Practice Portal
              </span>
              <span className="text-[10px] text-[#737373] font-medium hidden sm:block">
                Rajasthan Informatics Assistant Online Test Series
              </span>
            </div>
          </Link>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {currentStudent && (
              <button
                type="button"
                onClick={() => setShowResultsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] text-xs font-semibold text-[#FAFAFA] transition-colors cursor-pointer group"
                title="View your completed test submissions & reports"
              >
                <span className="text-xs">📊</span>
                <span className="hidden sm:inline">My Results</span>
              </button>
            )}

            {currentStudent && (
              <button
                type="button"
                onClick={() => setShowBookmarksModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] text-xs font-semibold text-[#FAFAFA] transition-colors cursor-pointer group"
                title="View your saved question bookmarks"
              >
                <Icons.BookmarkFilled size={14} className="text-white group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Bookmarks</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white text-black font-mono font-black text-[10px]">
                  {bookmarkCount}
                </span>
              </button>
            )}

            {currentStudent && (
              <div className="flex items-center gap-2.5 bg-[#1C1C1C] border border-[#303030] px-3 py-1.5 rounded-xl text-xs">
                <div className="w-6 h-6 rounded-full bg-[#FFFFFF] text-[#111111] font-black flex items-center justify-center text-[10px]">
                  {currentStudent.full_name?.charAt(0) || 'C'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-bold text-[#FFFFFF] text-xs leading-tight">
                    {currentStudent.full_name}
                  </div>
                  <div className="text-[9px] text-[#737373] font-mono">
                    {currentStudent.role === 'admin' ? '🛡️ Administrator' : `Student @${currentStudent.username}`}
                  </div>
                </div>
              </div>
            )}

            {currentStudent?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] text-[#111111] text-xs font-bold hover:bg-[#E5E5E5] transition-colors shadow-sm"
              >
                Admin Panel
              </Link>
            )}

            <a
              href="/api/auth/logout"
              title="Sign Out"
              className="p-1.5 rounded-xl text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1C1C1C] border border-[#303030] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Practice Layout */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Unauthorized alert banner */}
        {searchParams.get('error') === 'unauthorized' && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
            <span className="text-base">🚫</span>
            <span>
              <strong>Access Denied:</strong> Administrative routes and APIs are restricted exclusively to verified administrators.
            </span>
          </div>
        )}

        {/* Empty assignments notice */}
        {!loading && assessments.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#171717] border border-[#2E2E2E] text-center space-y-2">
            <div className="text-2xl">📋</div>
            <h3 className="text-sm font-bold text-white">No Mock Tests Currently Assigned</h3>
            <p className="text-xs text-[#A3A3A3] max-w-md mx-auto">
              Your student account does not have any active mock test assignments yet. Administrators assign specific mock tests to individual candidates. Please contact your instructor or administrator to grant test access.
            </p>
          </div>
        )}

        {/* Top Breadcrumb & Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#171717] border border-[#303030] p-3 rounded-2xl">
          <div className="p-2.5 rounded-xl bg-[#111111] border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider mb-1">
              Active Subject
            </div>
            <div className="font-bold text-xs sm:text-sm text-[#FAFAFA] truncate">
              {activeSubject.name}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111111] border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider mb-1">
              Active Topic
            </div>
            <div className="font-bold text-xs sm:text-sm text-amber-300 truncate">
              {selectedTopic === 'all' ? 'All Topics / Mixed' : selectedTopic}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111111] border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider mb-1">
              Selected Level
            </div>
            <div className="font-bold text-xs sm:text-sm text-[#FAFAFA] uppercase">
              {selectedDifficulty || 'All Levels'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111111] border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider mb-1">
              Available Drills
            </div>
            <div className="font-mono font-black text-xs sm:text-sm text-emerald-400">
              {difficultyCounts.all} Tests
            </div>
          </div>
        </div>

        {/* 3. Four-Step Progress Indicator */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#171717] border border-[#303030]">
          <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm font-semibold select-none">
            {/* Step 1 Pill */}
            <div
              onClick={() => handleBackToStep1()}
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#202020] text-white border border-[#3F3F46] font-bold shadow-xs'
                  : currentStep > 1
                  ? 'text-[#FFFFFF] hover:bg-[#202020]'
                  : 'text-[#737373]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                  currentStep === 1
                    ? 'bg-[#D4D4D8] text-[#111111]'
                    : currentStep > 1
                    ? 'bg-[#303030] text-[#FFFFFF]'
                    : 'bg-[#222222] text-[#737373]'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="hidden sm:inline">1. Subject</span>
              <span className="sm:hidden text-[11px]">Subject</span>
            </div>

            {/* Step 2 Pill (TOPIC SELECTION) */}
            <div
              onClick={() => {
                if (currentStep > 2) handleBackToStep2()
              }}
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition-all ${
                currentStep === 2
                  ? 'bg-[#202020] text-white border border-[#3F3F46] font-bold shadow-xs'
                  : currentStep > 2
                  ? 'text-[#FFFFFF] cursor-pointer hover:bg-[#202020]'
                  : 'text-[#737373] cursor-default'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                  currentStep === 2
                    ? 'bg-amber-400 text-black'
                    : currentStep > 2
                    ? 'bg-[#303030] text-[#FFFFFF]'
                    : 'bg-[#222222] text-[#737373]'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="hidden sm:inline">2. Topic</span>
              <span className="sm:hidden text-[11px]">Topic</span>
            </div>

            {/* Step 3 Pill (DIFFICULTY) */}
            <div
              onClick={() => {
                if (currentStep > 3) handleBackToStep3()
              }}
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition-all ${
                currentStep === 3
                  ? 'bg-[#202020] text-white border border-[#3F3F46] font-bold shadow-xs'
                  : currentStep > 3
                  ? 'text-[#FFFFFF] cursor-pointer hover:bg-[#202020]'
                  : 'text-[#737373] cursor-default'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                  currentStep === 3
                    ? 'bg-[#D4D4D8] text-[#111111]'
                    : currentStep > 3
                    ? 'bg-[#303030] text-[#FFFFFF]'
                    : 'bg-[#222222] text-[#737373]'
                }`}
              >
                {currentStep > 3 ? '✓' : '3'}
              </span>
              <span className="hidden sm:inline">3. Difficulty</span>
              <span className="sm:hidden text-[11px]">Level</span>
            </div>

            {/* Step 4 Pill (PRACTICE TEST) */}
            <div
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition-all cursor-default ${
                currentStep === 4
                  ? 'bg-[#202020] text-white border border-[#3F3F46] font-bold shadow-xs'
                  : 'text-[#737373]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                  currentStep === 4
                    ? 'bg-[#D4D4D8] text-[#111111]'
                    : 'bg-[#222222] text-[#737373]'
                }`}
              >
                4
              </span>
              <span className="hidden sm:inline">4. Practice Test</span>
              <span className="sm:hidden text-[11px]">Tests</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CHOOSE SUBJECT                                        */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]"></span>
                Step 1 of 4 • Subject Selection
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
                Choose Your Subject
              </h1>
              <p className="text-sm text-[#A3A3A3]">
                Select a syllabus subject to proceed to topic-level practice drills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORE_SUBJECT_OPTIONS.map((sub) => {
                const isSelected = selectedSubjectId === sub.id
                const testCount = subjectTestCounts[sub.id] || 0

                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectId(sub.id)
                      handleProceedToStep2(sub.id)
                    }}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                      isSelected
                        ? 'bg-[#202020] text-[#FAFAFA] border-2 border-white shadow-xl ring-1 ring-white/20'
                        : 'bg-[#141414] text-[#FAFAFA] border-[#262626] hover:bg-[#1A1A1A] hover:border-[#383838]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#181818] border border-[#2E2E2E] text-white">
                          {sub.code}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-[#2E2E2E] text-white border border-[#444444]'
                              : 'bg-[#1E1E1E] text-[#A1A1AA] border border-[#2B2B2B]'
                          }`}
                        >
                          {testCount} Tests
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                        {sub.name}
                      </h3>
                      <div className="text-xs font-bold text-[#A1A1AA] mb-2">{sub.hindiName}</div>
                      <p className="text-xs text-[#71717A] leading-relaxed line-clamp-3">
                        {sub.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-bold text-white">
                      <span>Choose Topics →</span>
                      <Icons.ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: CHOOSE TOPIC (विषय के अंतर्गत टॉपिक चयन स्क्रीन)     */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Step Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Step 2 of 4 • Topic Selection
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#1C1C1C] border border-[#303030] text-[#FFFFFF] font-semibold">
                  Subject: <strong className="text-white">{activeSubject.name}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
                Choose Topic ({activeSubject.name})
              </h1>
              <p className="text-sm text-[#A3A3A3]">
                Select a specific topic (e.g. <strong>Blood Relations</strong>) or choose <strong>All Topics</strong> for a mixed syllabus drill.
              </p>
            </div>

            {/* Topic Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 0: All Topics / Mixed Practice */}
              <div
                onClick={() => setSelectedTopic('all')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                  selectedTopic === 'all'
                    ? 'bg-[#1C1C1C] text-[#FAFAFA] border-2 border-amber-400 shadow-xl ring-1 ring-amber-400/20'
                    : 'bg-[#141414] text-[#FAFAFA] border-[#262626] hover:bg-[#1A1A1A] hover:border-[#383838]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedTopic === 'all' ? 'border-amber-400' : 'border-[#52525B]'
                        }`}
                      >
                        {selectedTopic === 'all' && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                      </span>
                      <span className="text-xs font-mono uppercase font-bold text-amber-300">
                        Mixed Practice
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#252525] text-white border border-[#333333]">
                      {subjectTestCounts[selectedSubjectId] || assessments.length} Tests
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    All Topics / Full Syllabus Drill (सम्पूर्ण विषय)
                  </h3>
                  <div className="text-xs text-[#A1A1AA] font-medium mb-1">
                    विषय के सभी अध्यायों से मिश्रित अभ्यास प्रश्न
                  </div>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    Practice all topics combined together to build speed and comprehensive mastery across {activeSubject.name}.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-bold text-[#A1A1AA]">
                  <span>{selectedTopic === 'all' ? '✓ Selected' : 'Click to select all topics'}</span>
                  <Icons.ChevronRight size={14} />
                </div>
              </div>

              {/* Specific Topics */}
              {availableTopics.map((top) => {
                const isSelected = selectedTopic === top.name
                const count = topicTestCounts[top.name] || 0

                return (
                  <div
                    key={top.id}
                    onClick={() => setSelectedTopic(top.name)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                      isSelected
                        ? 'bg-[#1C1C1C] text-[#FAFAFA] border-2 border-amber-400 shadow-xl ring-1 ring-amber-400/20'
                        : 'bg-[#141414] text-[#FAFAFA] border-[#262626] hover:bg-[#1A1A1A] hover:border-[#383838]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-amber-400' : 'border-[#52525B]'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                          </span>
                          <span className="text-xs font-mono uppercase font-bold text-[#A1A1AA]">
                            #{top.id}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                            count > 0
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                              : 'bg-[#202020] text-[#71717A] border border-[#2E2E2E]'
                          }`}
                        >
                          {count} {count === 1 ? 'Test' : 'Tests'}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        {top.name}
                      </h3>
                      {top.hindiName && (
                        <div className="text-xs text-[#A1A1AA] font-medium mb-1">
                          {top.hindiName}
                        </div>
                      )}
                      <p className="text-xs text-[#71717A] leading-relaxed line-clamp-2">
                        {top.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-bold text-[#A1A1AA]">
                      <span>{isSelected ? '✓ Selected' : 'Click to select topic'}</span>
                      <Icons.ChevronRight size={14} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="px-5 py-3 rounded-xl bg-[#1C1C1C] border border-[#303030] text-[#FFFFFF] hover:bg-[#292929] transition-all font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>← Back to Subjects</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToStep3()}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue to Difficulty Level</span>
                <Icons.ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: CHOOSE DIFFICULTY LEVEL                               */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Step Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]"></span>
                  Step 3 of 4 • Difficulty Level
                </span>
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1C1C] border border-[#303030] text-[#FFFFFF] font-semibold hover:border-white transition-colors"
                >
                  Subject: {activeSubject.name} ✎
                </button>
                <button
                  type="button"
                  onClick={handleBackToStep2}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1C1C] border border-[#303030] text-amber-300 font-semibold hover:border-amber-400 transition-colors"
                >
                  Topic: {selectedTopic === 'all' ? 'All Topics' : selectedTopic} ✎
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
                Choose Difficulty Level
              </h1>
              <p className="text-sm text-[#A3A3A3]">
                Select the target difficulty level for {selectedTopic === 'all' ? activeSubject.name : selectedTopic}.
              </p>
            </div>

            {/* 3 Large Difficulty Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DIFFICULTY_OPTIONS.map((diff) => {
                const isSelected = selectedDifficulty === diff.id
                const testCount = difficultyCounts[diff.id as 'easy' | 'medium' | 'hard'] || 0

                return (
                  <div
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id as 'easy' | 'medium' | 'hard')}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? 'bg-[#202020] text-[#FAFAFA] border-2 border-white shadow-xl ring-1 ring-white/20'
                        : 'bg-[#141414] text-[#FAFAFA] border-[#262626] hover:bg-[#1A1A1A] hover:border-[#383838]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-white' : 'border-[#52525B]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                          <span
                            className={`text-xs font-mono uppercase font-bold tracking-wider ${
                              isSelected ? 'text-white' : 'text-[#A1A1AA]'
                            }`}
                          >
                            {diff.id}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-[#2E2E2E] text-white border border-[#444444]'
                              : 'bg-[#1E1E1E] text-[#A1A1AA] border border-[#2B2B2B]'
                          }`}
                        >
                          {testCount} Tests
                        </span>
                      </div>

                      <h3 className="text-xl font-black mb-1 text-[#FFFFFF]">{diff.name}</h3>
                      <div className={`text-xs font-bold mb-3 ${isSelected ? 'text-[#D4D4D8]' : 'text-[#A1A1AA]'}`}>
                        {diff.subtitle}
                      </div>

                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-[#E4E4E7]' : 'text-[#71717A]'}`}>
                        {diff.description}
                      </p>
                    </div>

                    <div className={`mt-6 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                      isSelected ? 'border-[#383838] text-white' : 'border-[#262626] text-[#71717A]'
                    }`}>
                      <span>{isSelected ? '✓ Selected' : 'Click to select level'}</span>
                      <Icons.ChevronRight size={14} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToStep2}
                className="px-5 py-3 rounded-xl bg-[#1C1C1C] border border-[#303030] text-[#FFFFFF] hover:bg-[#292929] transition-all font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>← Back to Topic Choice</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToStep4()}
                disabled={!selectedDifficulty}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#E4E4E7] text-black font-extrabold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Show Practice Tests</span>
                <Icons.ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: SELECT PRACTICE TEST (फाइनल टेस्ट लिस्ट स्क्रीन)     */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                {/* Context Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]"></span>
                    Step 4 of 4 • Test Drills
                  </span>
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3] hover:text-[#FFFFFF] cursor-pointer"
                  >
                    Subject: <strong className="text-[#FFFFFF]">{activeSubject.name}</strong> ✎
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToStep2}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1C1C] border border-[#303030] text-amber-300 hover:text-white cursor-pointer"
                  >
                    Topic: <strong className="text-white">{selectedTopic === 'all' ? 'All Topics' : selectedTopic}</strong> ✎
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToStep3}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1C1C] border border-[#303030] text-[#A3A3A3] hover:text-[#FFFFFF] cursor-pointer uppercase"
                  >
                    Level: <strong className="text-[#FFFFFF]">{selectedDifficulty}</strong> ✎
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
                  {selectedTopic !== 'all' ? selectedTopic : activeSubject.name} — Practice Tests
                </h1>
                <p className="text-sm text-[#A3A3A3]">
                  Select any drill to launch the distraction-free exam portal.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative min-w-[220px]">
                <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" size={15} />
                <input
                  type="text"
                  placeholder="Search drills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#303030] bg-[#141414] text-xs text-[#FFFFFF] placeholder-[#737373] focus:outline-none focus:border-[#555555]"
                />
              </div>
            </div>

            {/* List of Practice Tests */}
            <div className="space-y-4">
              {finalFilteredAssessments.length === 0 ? (
                <div className="p-12 text-center text-[#737373] bg-[#141414] rounded-2xl border border-[#262626] space-y-3">
                  <div className="text-3xl">📝</div>
                  <h3 className="text-base font-bold text-[#FFFFFF]">No tests match your selected criteria</h3>
                  <p className="text-xs text-[#A3A3A3] max-w-md mx-auto">
                    Try choosing a different topic, difficulty level, or clearing your search term.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleBackToStep2()}
                      className="px-4 py-2 rounded-xl bg-[#202020] border border-[#303030] text-xs font-semibold text-[#FFFFFF] hover:bg-[#282828]"
                    >
                      Change Topic
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBackToStep3()}
                      className="px-4 py-2 rounded-xl bg-white text-xs font-semibold text-black hover:bg-[#E5E5E5]"
                    >
                      Change Difficulty
                    </button>
                  </div>
                </div>
              ) : (
                finalFilteredAssessments.map((test) => {
                  const diffColor =
                    normalizeDiff(test.difficulty_level) === 'hard'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                      : normalizeDiff(test.difficulty_level) === 'easy'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/40'

                  return (
                    <div
                      key={test.id}
                      className="p-5 rounded-2xl bg-[#141414] border border-[#262626] hover:border-[#3F3F46] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${diffColor}`}>
                            {test.difficulty_level || 'medium'}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1C1C1C] text-[#FAFAFA] border border-[#2E2E2E]">
                            {test.assessment_type}
                          </span>
                          {test.subject_name && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1C1C1C] text-[#A1A1AA] border border-[#262626]">
                              {test.subject_name}
                            </span>
                          )}
                          {test.main_topic_name && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              {test.main_topic_name}
                            </span>
                          )}
                          {test.topic_name && test.topic_name !== test.main_topic_name && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#71717A] border border-[#262626]">
                              {test.topic_name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {test.title}
                        </h3>

                        <p className="text-xs text-[#A3A3A3] line-clamp-2 leading-relaxed">
                          {test.description || 'Practice test with selected syllabus questions.'}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-[#737373] pt-1">
                          <span>Questions: <strong className="text-[#FAFAFA]">{test.total_questions}</strong></span>
                          <span>Duration: <strong className="text-[#FAFAFA]">{test.duration_minutes}m</strong></span>
                          <span>Marks: <strong className="text-[#FAFAFA]">{Number(test.total_marks || 0).toFixed(0)}</strong></span>
                          <span>Passing: <strong className="text-[#FAFAFA]">{test.passing_percentage}%</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/practice/${test.id}`}
                          className="px-5 py-3 rounded-xl bg-white hover:bg-[#E5E5E5] text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <span>Start Test</span>
                          <Icons.ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToStep3}
                className="px-5 py-3 rounded-xl bg-[#1C1C1C] border border-[#303030] text-[#FFFFFF] hover:bg-[#292929] transition-all font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>← Back to Difficulty Level</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bookmarks Modal */}
      {currentStudent && (
        <BookmarkModal
          isOpen={showBookmarksModal}
          onClose={() => setShowBookmarksModal(false)}
          studentId={currentStudent.id}
        />
      )}

      {/* Student Results Modal */}
      {currentStudent && (
        <StudentResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          studentId={currentStudent.id}
        />
      )}
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#71717A]">Loading Practice Portal...</div>}>
      <PracticePortalContent />
    </Suspense>
  )
}
