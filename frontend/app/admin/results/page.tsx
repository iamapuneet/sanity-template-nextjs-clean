'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/Modal'
import { Icons } from '@/components/admin/Icons'

export default function ResultsAnalyticsPage() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [rankings, setRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Granular drilldown modal state
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null)
  const [drilldownLoading, setDrilldownLoading] = useState(false)
  const [drilldownData, setDrilldownData] = useState<any>(null)

  const fetchResults = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/results')
      const json = await res.json()
      if (json.success) {
        setAttempts(json.attempts)
        setRankings(json.rankings)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleOpenDrilldown = async (attemptId: number) => {
    setSelectedAttemptId(attemptId)
    setDrilldownLoading(true)
    try {
      const res = await fetch(`/api/admin/results?attempt_id=${attemptId}`)
      const json = await res.json()
      if (json.success) {
        setDrilldownData(json)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDrilldownLoading(false)
    }
  }

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '0s'
    const m = Math.floor(sec / 60)
    const s = sec % 60
    if (m === 0) return `${s}s`
    return `${m}m ${s}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Results & Candidate Analytics</h1>
          <p className="text-sm text-gray-500">
            Student attempt logs, leaderboards, and per-question time analysis.
          </p>
        </div>
        <button
          onClick={fetchResults}
          className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icons.Clock size={14} /> Refresh Data
        </button>
      </div>

      {/* Top Grid: Attempts List & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attempts Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-black">Submitted Practice Tests</h2>
              <p className="text-xs text-gray-500">Click any attempt to view per-question timing analysis</p>
            </div>
            <span className="text-xs font-bold text-gray-500 font-mono">{attempts.length} attempts</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Loading attempts...</div>
          ) : attempts.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No test attempts found in database. Launch student portal to take tests.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Assessment</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3 text-center">Accuracy</th>
                    <th className="py-2.5 px-3 text-center">Total Time</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Timing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {attempts.map((att) => (
                    <tr
                      key={att.id}
                      onClick={() => handleOpenDrilldown(att.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-black">{att.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-mono truncate max-w-[130px]">
                          {att.student_email}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900 truncate max-w-[180px]">
                          {att.assessment_title}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-mono">
                          {att.assessment_type}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        {Number(att.obtained_marks).toFixed(1)} / {Number(att.total_marks).toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        {Number(att.accuracy || 0).toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-gray-600">
                        {formatSeconds(att.time_taken_seconds)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            att.passed ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {att.passed ? 'PASSED' : 'RETRY'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-black hover:text-white font-semibold text-[11px] transition-colors"
                        >
                          Timing Analysis ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Leaderboard (1 Column) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-black">Top Performers</h2>
              <p className="text-xs text-gray-500">Rankings by percentage & accuracy</p>
            </div>
            <Icons.Award size={18} />
          </div>

          <div className="space-y-3 flex-1">
            {rankings.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No submissions available for rankings.
              </div>
            ) : (
              rankings.map((r, idx) => (
                <div
                  key={r.student_id}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-black">{r.full_name}</div>
                      <div className="text-[10px] text-gray-500">
                        {r.tests_taken} Tests • High: {Number(r.highest_score || 0).toFixed(1)} pts
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-black">
                      {Number(r.avg_percentage || 0).toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-gray-500">Avg Score</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Per-Question Timing Analysis Modal */}
      <Modal
        isOpen={selectedAttemptId !== null}
        onClose={() => setSelectedAttemptId(null)}
        title="Candidate Per-Question Timing & Response Analysis"
        subtitle="Granular breakdown of time spent on each individual question"
        maxWidth="2xl"
      >
        {drilldownLoading || !drilldownData ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading question metrics...</div>
        ) : (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-black">
                  Candidate: {drilldownData.attempt?.student_name}
                </div>
                <div className="text-xs text-gray-500">
                  {drilldownData.attempt?.assessment_title}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-500">Total Score: </span>
                  <strong>{Number(drilldownData.attempt?.obtained_marks).toFixed(1)} / {Number(drilldownData.attempt?.total_marks).toFixed(1)}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Accuracy: </span>
                  <strong>{Number(drilldownData.attempt?.accuracy || 0).toFixed(0)}%</strong>
                </div>
                <div>
                  <span className="text-gray-500">Total Duration: </span>
                  <strong>{formatSeconds(drilldownData.attempt?.time_taken_seconds)}</strong>
                </div>
              </div>
            </div>

            {/* Question timing table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 font-bold text-gray-700 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Q#</th>
                    <th className="py-2.5 px-3">Question Snippet</th>
                    <th className="py-2.5 px-3 text-center">Selected</th>
                    <th className="py-2.5 px-3 text-center">Correct</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3 text-center">Time Spent (Sec)</th>
                    <th className="py-2.5 px-3 text-center">Speed Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {drilldownData.answers?.map((ans: any, idx: number) => {
                    const timeSpent = Number(ans.time_spent_seconds || 0)
                    let speedRating = 'Moderate'
                    let speedColor = 'bg-gray-100 text-gray-800'
                    if (timeSpent > 0 && timeSpent < 20) {
                      speedRating = '⚡ Fast (<20s)'
                      speedColor = 'bg-black text-white'
                    } else if (timeSpent >= 45) {
                      speedRating = '⏳ Time Heavy (>45s)'
                      speedColor = 'bg-gray-200 text-gray-900 border border-gray-300'
                    }

                    return (
                      <tr key={ans.answer_id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-mono font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3 text-gray-900 max-w-[240px] truncate">
                          {ans.question_text}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {ans.selected_option_key || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-black">
                          {ans.correct_option_key || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ans.is_correct === 1
                                ? 'bg-black text-white'
                                : ans.is_correct === 0
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {ans.is_correct === 1 ? 'Correct' : ans.is_correct === 0 ? 'Wrong' : 'Skipped'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-black">
                          {formatSeconds(timeSpent)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${speedColor}`}>
                            {speedRating}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAttemptId(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
