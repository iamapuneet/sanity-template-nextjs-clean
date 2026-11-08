'use client'

import React, { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import { Icons } from '@/components/admin/Icons'
import { toast } from 'sonner'
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_TESTS } from '@/lib/mock-data'

export default function SettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appName, setAppName] = useState('ExamForge')
  const [appTagline, setAppTagline] = useState('Government Exam Question Bank & Practice Platform')
  const [defaultMarks, setDefaultMarks] = useState(1.0)
  const [defaultNegative, setDefaultNegative] = useState(0.25)
  const [defaultDuration, setDefaultDuration] = useState(60)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('System configuration saved successfully!')
  }

  const handleResetData = () => {
    try {
      localStorage.setItem('examforge_subjects', JSON.stringify(INITIAL_SUBJECTS))
      localStorage.setItem('examforge_topics', JSON.stringify(INITIAL_TOPICS))
      localStorage.setItem('examforge_questions', JSON.stringify(INITIAL_QUESTIONS))
      localStorage.setItem('examforge_tests', JSON.stringify(INITIAL_TESTS))
      toast.success('ExamForge repository reset to initial sample state!')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch {
      toast.error('Unable to reset local storage.')
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        onToggleMobile={() => setMobileOpen(true)}
        title="Platform Settings"
        subtitle="Configure examination rules, marking schemes, and system parameters"
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-4xl mx-auto">
        {/* Scope Restriction Info Box */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 flex items-start gap-3">
          <Icons.Shield size={20} className="text-black shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-black">Strict Architecture Scope:</span>
            <p className="leading-relaxed text-gray-700">
              ExamForge is focused strictly on verified manual MCQ question banking, hierarchical syllabus mapping, and authenticated student practice. AI generation and external forms export are completely disabled by architectural mandate.
            </p>
          </div>
        </div>

        {/* Branding & Platform Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Branding & Application Information
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Metadata used across student practice headers and examination portals
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project / Portal Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Application Title
                </label>
                <input
                  type="text"
                  value="ExamForge – Exam Question Bank"
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Portal Tagline
              </label>
              <input
                type="text"
                value={appTagline}
                onChange={(e) => setAppTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-semibold transition-colors"
              >
                Save Branding
              </button>
            </div>
          </form>
        </div>

        {/* Examination & Marking Scheme Defaults */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Default Marking & Evaluation Scheme
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Default marks and penalty deduction applied to newly generated questions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Standard Correct Marks (+)
              </label>
              <input
                type="number"
                step="0.25"
                value={defaultMarks}
                onChange={(e) => setDefaultMarks(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Negative Penalty (-)
              </label>
              <input
                type="number"
                step="0.05"
                value={defaultNegative}
                onChange={(e) => setDefaultNegative(parseFloat(e.target.value) || 0.25)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Default Test Duration (Mins)
              </label>
              <input
                type="number"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* MySQL Architecture Connection Readiness */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Database Readiness (Step 2 Integration)
            </h3>
            <p className="text-xs text-gray-500">
              ExamForge uses normalized MySQL tables for high-throughput question banking
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">DB Engine:</span>
              <span className="font-bold text-gray-800">MySQL 8.0+ / InnoDB (utf8mb4)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Schema File:</span>
              <span className="font-bold text-blue-600">database/migrations/001_initial_schema.sql</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Database Name:</span>
              <span className="text-gray-800">examforge</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Architecture:</span>
              <span className="text-emerald-700 font-semibold">Route Handlers + Connection Pool Ready</span>
            </div>
          </div>
        </div>

        {/* Reset Mock Data */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Reset Repository Data
            </h4>
            <p className="text-xs text-gray-500">
              Restore the initial 7 government exam subjects and questions
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  )
}

