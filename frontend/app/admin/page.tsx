'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import MetricCard from '@/components/admin/MetricCard'
import { Icons } from '@/components/admin/Icons'
import { useExamStore } from '@/lib/store'

export default function AdminDashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { summary, subjects, questions, topics, approveQuestion } = useExamStore()

  // Calculate subject question percentages
  const totalQ = summary.totalQuestions || 1

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Dashboard Overview"
        subtitle="Government Exam Question Bank & Management Hub"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Welcome / Quick Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Icons.Shield size={14} />
              ExamForge Admin Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to ExamForge
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Manage your centralized government exam repository. Organize subjects, hierarchical topics, curate verified MCQ questions, and build mock tests with precision.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/admin/questions?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 font-semibold text-sm shadow-sm hover:bg-blue-50 transition-colors"
              >
                <Icons.Plus size={16} />
                Add Question
              </Link>
              <Link
                href="/admin/practice-tests?action=create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-medium text-sm border border-blue-400/30 transition-colors"
              >
                <Icons.PracticeTests size={16} />
                Build Practice Test
              </Link>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* 5 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Subjects"
            value={summary.totalSubjects}
            subtitle="Configured Subjects"
            icon={<Icons.Subjects size={22} />}
            iconBgColor="bg-blue-50 text-blue-600"
          />
          <MetricCard
            title="Total Topics"
            value={summary.totalTopics}
            subtitle="Hierarchical Nodes"
            icon={<Icons.Topics size={22} />}
            iconBgColor="bg-indigo-50 text-indigo-600"
          />
          <MetricCard
            title="Total Questions"
            value={summary.totalQuestions}
            subtitle="MCQs in Repository"
            icon={<Icons.Questions size={22} />}
            iconBgColor="bg-purple-50 text-purple-600"
          />
          <MetricCard
            title="Approved"
            value={summary.approvedQuestions}
            subtitle="Ready for Tests"
            icon={<Icons.CheckCircle size={22} />}
            iconBgColor="bg-emerald-50 text-emerald-600"
            trend={`${Math.round((summary.approvedQuestions / totalQ) * 100)}% verified`}
            trendPositive={true}
          />
          <MetricCard
            title="Pending Review"
            value={summary.pendingQuestions}
            subtitle="Requires Verification"
            icon={<Icons.AlertCircle size={22} />}
            iconBgColor="bg-amber-50 text-amber-600"
            trend={summary.pendingQuestions > 0 ? 'Needs Attention' : 'All Clear'}
            trendPositive={summary.pendingQuestions === 0}
          />
        </div>

        {/* Two-Column Layout: Subject Statistics & Recently Added Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Subject-wise question statistics & Quick Links */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subject Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Subject-wise Question Statistics
                  </h3>
                  <p className="text-xs text-gray-500">
                    Distribution of approved and pending questions across subjects
                  </p>
                </div>
                <Link
                  href="/admin/subjects"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Manage Subjects <Icons.ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {subjects.map((sub) => {
                  const subQuestions = questions.filter((q) => q.subjectId === sub.id)
                  const count = subQuestions.length
                  const pct = Math.round((count / totalQ) * 100) || 0
                  const approvedInSub = subQuestions.filter((q) => q.status === 'approved').length

                  return (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{sub.name}</span>
                          <span className="text-gray-400">({sub.code})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-emerald-600 font-medium">{approvedInSub} approved</span>
                          <span className="text-gray-300">•</span>
                          <span className="font-bold text-gray-700">{count} total</span>
                          <span className="text-gray-400">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Quick Administrative Tasks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/admin/subjects"
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icons.Subjects size={18} />
                  </div>
                  <div className="text-xs font-semibold text-gray-900">Manage Subjects</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Add/modify syllabus subjects</div>
                </Link>

                <Link
                  href="/admin/topics"
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icons.Topics size={18} />
                  </div>
                  <div className="text-xs font-semibold text-gray-900">Topic Hierarchy</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Build multi-level topic trees</div>
                </Link>

                <Link
                  href="/admin/practice-tests"
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icons.PracticeTests size={18} />
                  </div>
                  <div className="text-xs font-semibold text-gray-900">Create Tests</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Curate tests with checkboxes</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Recently Added Questions & Pending Approvals */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pending Questions Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Review Queue
                  </h3>
                  <p className="text-xs text-gray-500">
                    Questions awaiting admin approval
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {summary.pendingQuestions} pending
                </span>
              </div>

              {summary.pendingQuestions === 0 ? (
                <div className="py-8 text-center text-gray-500 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <Icons.Check size={20} />
                  </div>
                  <p className="text-xs font-medium">All questions are approved and published!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions
                    .filter((q) => q.status === 'pending')
                    .slice(0, 3)
                    .map((q) => {
                      const sub = subjects.find((s) => s.id === q.subjectId)
                      return (
                        <div
                          key={q.id}
                          className="p-3 rounded-xl border border-amber-200/60 bg-amber-50/30 space-y-2"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-amber-800">{sub?.name || 'General'}</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-800 line-clamp-2 font-medium">
                            {q.questionText}
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <Link
                              href="/admin/questions"
                              className="text-[11px] text-gray-500 hover:text-gray-800 font-medium px-2 py-1"
                            >
                              Inspect
                            </Link>
                            <button
                              type="button"
                              onClick={() => approveQuestion(q.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                            >
                              <Icons.Check size={14} />
                              Approve
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Recently Added Questions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Recently Added Questions
                </h3>
                <Link
                  href="/admin/questions"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All <Icons.ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-3">
                {questions.slice(0, 4).map((q) => {
                  const sub = subjects.find((s) => s.id === q.subjectId)
                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-blue-700">{sub?.name || 'General'}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            q.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-800 line-clamp-2">
                        {q.questionText}
                      </p>
                      <div className="text-[10px] text-gray-400">
                        Added: {q.createdAt} • Marks: {q.marks}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

