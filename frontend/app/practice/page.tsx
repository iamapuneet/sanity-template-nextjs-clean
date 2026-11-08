'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/admin/Icons'

export default function StudentPracticePortalPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Candidate quick login modal / name switch
  const [newStudentName, setNewStudentName] = useState('')
  const [showSwitchModal, setShowSwitchModal] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [resTests, resStudents] = await Promise.all([
        fetch('/api/student/assessments').then((r) => r.json()),
        fetch('/api/student/profile').then((r) => r.json()),
      ])
      if (resTests.success) setAssessments(resTests.assessments)
      if (resStudents.success && resStudents.students.length > 0) {
        setStudents(resStudents.students)
        const savedStudent = typeof window !== 'undefined' ? localStorage.getItem('examforge_current_student') : null
        if (savedStudent) {
          try {
            const parsed = JSON.parse(savedStudent)
            const matched = resStudents.students.find((s: any) => s.id === parsed.id)
            if (matched) {
              setCurrentStudent(matched)
            } else {
              setCurrentStudent(resStudents.students[0])
              localStorage.setItem('examforge_current_student', JSON.stringify(resStudents.students[0]))
            }
          } catch {
            setCurrentStudent(resStudents.students[0])
            localStorage.setItem('examforge_current_student', JSON.stringify(resStudents.students[0]))
          }
        } else {
          setCurrentStudent(resStudents.students[0])
          localStorage.setItem('examforge_current_student', JSON.stringify(resStudents.students[0]))
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRegisterOrSelect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim()) return

    try {
      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: newStudentName.trim() }),
      })
      const json = await res.json()
      if (json.success) {
        setCurrentStudent(json.student)
        if (typeof window !== 'undefined') {
          localStorage.setItem('examforge_current_student', JSON.stringify(json.student))
        }
        setShowSwitchModal(false)
        setNewStudentName('')
        loadData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Top Monochrome Bar */}
      <header className="sticky top-0 z-40 bg-black text-white border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black font-black text-sm flex items-center justify-center">
              EF
            </div>
            <div>
              <span className="font-black text-base tracking-tight block leading-tight">
                ExamForge Practice Portal
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                Rajasthan Informatics Assistant Online Test Series
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Candidate Badge */}
            {currentStudent && (
              <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs">
                <div className="w-6 h-6 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px]">
                  {currentStudent.full_name?.charAt(0) || 'C'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-white text-xs leading-tight">
                    {currentStudent.full_name}
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">
                    Candidate #{currentStudent.id}
                  </div>
                </div>
                <button
                  onClick={() => setShowSwitchModal(true)}
                  className="text-[10px] text-neutral-300 underline hover:text-white ml-1 font-semibold"
                >
                  Change
                </button>
              </div>
            )}

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-black border border-gray-300 uppercase">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              Live Candidate Mock Environment
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">
              Welcome, {currentStudent?.full_name || 'Candidate'}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Real examination test interface for Rajasthan Informatics Assistant with live countdown, question palette, negative marking calculation, and granular <strong>per-question time tracking</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-2xl font-black font-mono text-black">{assessments.length}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Available Tests</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-2xl font-black font-mono text-black">1/4</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Negative Marking</div>
            </div>
          </div>
        </div>

        {/* Available Practice Tests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black tracking-tight">Available Practice Mock Tests</h2>
              <p className="text-xs text-gray-500">Select an assessment to begin examination with live timing</p>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500">{assessments.length} tests ready</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading practice test catalog...</div>
          ) : assessments.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              No tests currently published. Create one in Admin Panel &gt; Mock Tests.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {assessments.map((test) => (
                <div
                  key={test.id}
                  className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs hover:border-black transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200">
                        {test.assessment_type || 'mock'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        Pass: {test.passing_percentage}%
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-black group-hover:text-black transition-colors leading-snug">
                      {test.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2">
                      {test.description || 'Full coverage of Rajasthan Informatics Assistant exam syllabus questions.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                      <div>
                        <div className="font-mono font-black text-black">{test.total_questions}</div>
                        <div className="text-[9px] uppercase text-gray-500 font-semibold">Questions</div>
                      </div>
                      <div>
                        <div className="font-mono font-black text-black">{test.duration_minutes}m</div>
                        <div className="text-[9px] uppercase text-gray-500 font-semibold">Time</div>
                      </div>
                      <div>
                        <div className="font-mono font-black text-black">{Number(test.total_marks || 0).toFixed(0)}</div>
                        <div className="text-[9px] uppercase text-gray-500 font-semibold">Marks</div>
                      </div>
                    </div>

                    <Link
                      href={`/practice/${test.id}`}
                      onClick={() => {
                        if (currentStudent && typeof window !== 'undefined') {
                          localStorage.setItem('examforge_current_student', JSON.stringify(currentStudent))
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Start Practice Test</span>
                      <Icons.ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Switch Candidate Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-base font-bold text-black">Select Candidate Profile</h3>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <Icons.Close size={18} />
              </button>
            </div>

            {/* Existing candidates list */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Choose Existing Candidate:
              </span>
              {students.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setCurrentStudent(st)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('examforge_current_student', JSON.stringify(st))
                    }
                    setShowSwitchModal(false)
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs text-left font-semibold flex items-center justify-between transition-colors ${
                    currentStudent?.id === st.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <span>{st.full_name}</span>
                  <span className="font-mono text-[10px] opacity-75">{st.email}</span>
                </button>
              ))}
            </div>

            {/* Create new candidate */}
            <form onSubmit={handleRegisterOrSelect} className="pt-3 border-t border-gray-200 space-y-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">
                Or Enter Your Name:
              </span>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter candidate full name..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-medium"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Set as Active Candidate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

