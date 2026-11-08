'use client'

import React, { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import MetricCard from '@/components/admin/MetricCard'
import { Icons } from '@/components/admin/Icons'
import { useExamStore } from '@/lib/store'

export default function ResultsPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { tests, subjects } = useExamStore()

  // Sample student attempts data for demonstration and preview
  const attempts = [
    {
      id: 1,
      studentName: 'Rahul Verma',
      rollNo: 'EF-2026-081',
      testTitle: 'SSC CGL Tier-1 Full Mock Test 01',
      attemptedQuestions: 8,
      correctAnswers: 7,
      incorrectAnswers: 1,
      score: 172.5,
      totalMarks: 200,
      percentage: 86.25,
      passed: true,
      date: '2026-02-18 11:45 AM',
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      rollNo: 'EF-2026-042',
      testTitle: 'Reasoning Ability Speed Drill',
      attemptedQuestions: 3,
      correctAnswers: 3,
      incorrectAnswers: 0,
      score: 50.0,
      totalMarks: 50,
      percentage: 100.0,
      passed: true,
      date: '2026-02-18 10:15 AM',
    },
    {
      id: 3,
      studentName: 'Amit Patel',
      rollNo: 'EF-2026-104',
      testTitle: 'SSC CGL Tier-1 Full Mock Test 01',
      attemptedQuestions: 8,
      correctAnswers: 4,
      incorrectAnswers: 4,
      score: 95.0,
      totalMarks: 200,
      percentage: 47.5,
      passed: true,
      date: '2026-02-17 04:30 PM',
    },
    {
      id: 4,
      studentName: 'Neha Kumari',
      rollNo: 'EF-2026-029',
      testTitle: 'Computer Awareness & IT Officer Foundation',
      attemptedQuestions: 2,
      correctAnswers: 1,
      incorrectAnswers: 1,
      score: 23.75,
      totalMarks: 50,
      percentage: 47.5,
      passed: true,
      date: '2026-02-17 02:00 PM',
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Candidate Results & Performance"
        subtitle="Track student practice attempts, score distributions, and subject accuracy"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Attempts"
            value={attempts.length}
            subtitle="Completed Practice Tests"
            icon={<Icons.Results size={22} />}
            iconBgColor="bg-blue-50 text-blue-600"
          />
          <MetricCard
            title="Pass Rate"
            value="100%"
            subtitle="Above Passing Mark"
            icon={<Icons.Award size={22} />}
            iconBgColor="bg-emerald-50 text-emerald-600"
            trend="High benchmark"
            trendPositive={true}
          />
          <MetricCard
            title="Avg Score"
            value="70.3%"
            subtitle="Across All Candidates"
            icon={<Icons.CheckCircle size={22} />}
            iconBgColor="bg-indigo-50 text-indigo-600"
          />
          <MetricCard
            title="Active Tests"
            value={tests.length}
            subtitle="Currently Published"
            icon={<Icons.PracticeTests size={22} />}
            iconBgColor="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Recent Candidate Test Submissions
              </h3>
              <p className="text-xs text-gray-500">
                Live performance data synced with server calculation engine
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Auto-Evaluated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4 text-center">Attempted / Total</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Submission Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {attempts.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div>{row.studentName}</div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {row.rollNo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-xs truncate">
                      {row.testTitle}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {row.attemptedQuestions} / {row.attemptedQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-emerald-600">
                        {row.correctAnswers} Correct
                      </span>{' '}
                      / <span className="text-rose-500">{row.incorrectAnswers} Incorrect</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-blue-700">
                      {row.score} / {row.totalMarks} ({row.percentage}%)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                        PASSED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

