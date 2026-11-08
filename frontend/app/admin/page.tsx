'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/admin/Icons'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({
    stats: {
      totalStudents: 0,
      totalSubjects: 0,
      totalTopics: 0,
      totalQuestions: 0,
      approvedQuestions: 0,
      pendingQuestions: 0,
      totalMockTests: 0,
      totalAttempts: 0,
      pendingReports: 0,
      avgScore: 0,
      avgAccuracy: 0,
    },
    subjectStats: [],
    recentQuestions: [],
    recentAttempts: [],
  })

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/dashboard')
      const json = await res.json()
      if (json.success) {
        setData(json)
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-black text-white p-6 md:p-8 border border-neutral-800 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Live Database Connected • MySQL 5.5
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              ExamForge Admin Overview
            </h1>
            <p className="text-sm md:text-base text-neutral-400 mt-1 max-w-2xl">
              Rajasthan Informatics Assistant Question Bank, Hierarchical Syllabus Tree & Candidate Practice Management.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/questions?action=new"
              className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-sm flex items-center gap-2"
            >
              <Icons.Plus size={16} />
              Add Question
            </Link>
            <Link
              href="/practice"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm border border-neutral-700 hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Icons.CandidatePortal size={16} />
              Student Portal
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Students',
            value: data.stats.totalStudents,
            href: '/admin/students',
            icon: Icons.Students,
          },
          {
            label: 'Active Subjects',
            value: data.stats.totalSubjects,
            href: '/admin/subjects',
            icon: Icons.Subjects,
          },
          {
            label: 'Syllabus Topics',
            value: data.stats.totalTopics,
            href: '/admin/topics',
            icon: Icons.Topics,
          },
          {
            label: 'Total Questions',
            value: data.stats.totalQuestions,
            href: '/admin/questions',
            icon: Icons.Questions,
          },
          {
            label: 'Approved Bank',
            value: data.stats.approvedQuestions,
            href: '/admin/questions?status=approved',
            icon: Icons.CheckCircle,
          },
          {
            label: 'Mock Tests',
            value: data.stats.totalMockTests,
            href: '/admin/practice-tests',
            icon: Icons.PracticeTests,
          },
        ].map((item, idx) => {
          const IconComp = item.icon
          return (
            <Link
              key={idx}
              href={item.href}
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-black transition-all hover:shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
                  <IconComp size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-black">
                {loading ? '...' : item.value}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Secondary Performance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-lg">
            {loading ? '-' : `${data.stats.avgScore}%`}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Average Score</div>
            <div className="text-sm font-semibold text-gray-900">Across test submissions</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-lg">
            {loading ? '-' : `${data.stats.avgAccuracy}%`}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Platform Accuracy</div>
            <div className="text-sm font-semibold text-gray-900">Correct vs attempted</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-lg">
            {loading ? '-' : data.stats.totalAttempts}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Test Attempts</div>
            <div className="text-sm font-semibold text-gray-900">Candidate practice runs</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-lg">
            {loading ? '-' : data.stats.pendingReports}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Question Flags</div>
            <div className="text-sm font-semibold text-gray-900">
              <Link href="/admin/reports" className="underline hover:text-black">
                Review student reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Statistics & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject wise Question Distribution (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-black">Subject-wise Bank Distribution</h2>
              <p className="text-xs text-gray-500">Live question coverage across syllabus subjects</p>
            </div>
            <Link
              href="/admin/subjects"
              className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
            >
              Manage Subjects <Icons.ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {data.subjectStats.map((sub: any) => {
              const totalQ = sub.question_count || 0
              const approvedQ = sub.approved_count || 0
              const pct = totalQ > 0 ? Math.round((approvedQ / totalQ) * 100) : 0

              return (
                <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-black">{sub.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                        {sub.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{sub.topic_count || 0} Topics</span>
                      <span>•</span>
                      <span>{totalQ} Questions ({approvedQ} approved)</span>
                    </div>
                  </div>

                  <div className="w-36 flex flex-col items-end">
                    <div className="text-xs font-bold text-black mb-1">{pct}% Approved</div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200">
                      <div
                        className="bg-black h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Candidate Test Attempts (1 Column) */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-black">Recent Submissions</h2>
              <p className="text-xs text-gray-500">Candidate test attempts & scores</p>
            </div>
            <Link
              href="/admin/results"
              className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
            >
              All Results <Icons.ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {data.recentAttempts.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No candidate attempts recorded yet.<br />
                Launch the student portal to take practice tests.
              </div>
            ) : (
              data.recentAttempts.map((att: any) => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-black transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-black truncate max-w-[150px]">
                      {att.student_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        att.passed
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {att.passed ? 'PASSED' : 'RETRY'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 truncate mb-2">{att.assessment_title}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 border-t border-gray-200 pt-1.5">
                    <span>Score: {Number(att.obtained_marks).toFixed(1)} / {Number(att.total_marks).toFixed(1)}</span>
                    <span className="font-bold text-black">{Number(att.percentage).toFixed(0)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recently Added Questions */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h2 className="text-lg font-bold text-black">Recently Added Questions</h2>
            <p className="text-xs text-gray-500">Latest additions to the question repository</p>
          </div>
          <Link
            href="/admin/questions"
            className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
          >
            Manage Question Bank <Icons.ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recentQuestions.map((q: any) => (
            <div
              key={q.id}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-black">{q.subject_name}</span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{q.topic_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                    {q.language_code || 'en'}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black text-white">
                    {q.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.question_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
