'use client'

import React, { useEffect, useState } from 'react'
import { Icons } from '@/components/admin/Icons'

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/reports?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setReports(json.reports)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [statusFilter])

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const json = await res.json()
      if (json.success) {
        fetchReports()
      } else {
        alert(json.error || 'Failed to update report')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Question Error Reports & Feedback</h1>
          <p className="text-sm text-gray-500">
            Candidate reports regarding ambiguous questions, option discrepancies, or typos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'reviewed', 'resolved', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-colors ${
                statusFilter === st
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
          <p className="text-sm font-semibold text-gray-700">No question reports matching filter.</p>
          <p className="text-xs text-gray-400">All questions are currently verified without pending flags.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black transition-all shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-black border border-gray-200">
                    Report #{rep.id}
                  </span>
                  <span className="text-xs font-bold text-black">{rep.subject_name}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">Question #{rep.question_id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    Type: {rep.report_type.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      rep.status === 'resolved'
                        ? 'bg-black text-white'
                        : rep.status === 'pending'
                        ? 'bg-neutral-200 text-black'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
              </div>

              {/* Question snippet */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                <span className="font-bold text-gray-700 block mb-0.5">Reported Question Statement:</span>
                <p className="text-gray-900 font-medium">{rep.question_text}</p>
              </div>

              {/* Feedback note */}
              <div className="text-xs text-gray-700">
                <span className="font-bold text-black">Candidate Feedback: </span>
                <span>{rep.description || 'No additional comment provided by student.'}</span>
              </div>

              {/* Meta & actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div>
                  Reported by: <strong className="text-black">{rep.student_name}</strong> ({rep.student_email})
                </div>

                <div className="flex items-center gap-2">
                  {rep.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rep.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {rep.status !== 'reviewed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rep.id, 'reviewed')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
                    >
                      Under Review
                    </button>
                  )}
                  {rep.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rep.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

