'use client'

import React, { useState, useMemo } from 'react'

interface Process {
  id: number
  name: string
  at: number
  bt: number
  pr: number
}

interface TimelineSegment {
  pid: number | null
  start: number
  end: number
}

const DEFAULT_PROCESSES: Process[] = [
  { id: 1, name: 'P1', at: 0, bt: 6, pr: 2 },
  { id: 2, name: 'P2', at: 1, bt: 8, pr: 1 },
  { id: 3, name: 'P3', at: 2, bt: 7, pr: 3 },
  { id: 4, name: 'P4', at: 3, bt: 3, pr: 2 },
]

const COLORS = [
  '#3b82f6', // blue
  '#22c55e', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
]

export default function CpuSchedulerSimulator() {
  const [algo, setAlgo] = useState<'fcfs' | 'sjf' | 'srtf' | 'priority' | 'rr'>('fcfs')
  const [quantum, setQuantum] = useState<number>(4)
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES)

  const handleAddProcess = () => {
    const nextId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1
    setProcesses([
      ...processes,
      {
        id: nextId,
        name: `P${nextId}`,
        at: processes.length,
        bt: Math.floor(Math.random() * 5) + 3,
        pr: 1,
      },
    ])
  }

  const handleRemoveProcess = () => {
    if (processes.length > 1) {
      setProcesses(processes.slice(0, -1))
    }
  }

  const handleUpdate = (id: number, field: 'at' | 'bt' | 'pr', val: number) => {
    setProcesses(
      processes.map((p) => (p.id === id ? { ...p, [field]: Math.max(0, val) } : p))
    )
  }

  // Simulation Algorithm Logic
  const result = useMemo(() => {
    const n = processes.length
    if (n === 0) return { timeline: [], ct: [], avgTat: 0, avgWt: 0 }

    const rem = processes.map((p) => Math.max(1, p.bt))
    const finished = new Array(n).fill(false)
    const ct = new Array(n).fill(0)
    const timeline: TimelineSegment[] = []
    let t = 0
    let doneCount = 0

    const addSegment = (pid: number | null, s: number, e: number) => {
      const last = timeline[timeline.length - 1]
      if (last && last.pid === pid && last.end === s) {
        last.end = e
      } else {
        timeline.push({ pid, start: s, end: e })
      }
    }

    const readyQueue = () =>
      processes
        .map((_, i) => i)
        .filter((i) => !finished[i] && processes[i].at <= t && rem[i] > 0)

    let loopSafety = 0
    while (doneCount < n && loopSafety < 1000) {
      loopSafety++
      const r = readyQueue()
      if (r.length === 0) {
        const unfinished = processes.filter((_, i) => !finished[i])
        const nextTime = Math.min(...unfinished.map((p) => p.at))
        addSegment(null, t, nextTime)
        t = nextTime
        continue
      }

      let pick: number
      if (algo === 'fcfs') {
        pick = r.sort((a, b) => processes[a].at - processes[b].at || a - b)[0]
      } else if (algo === 'sjf') {
        pick = r.sort(
          (a, b) => processes[a].bt - processes[b].bt || processes[a].at - processes[b].at
        )[0]
      } else if (algo === 'priority') {
        pick = r.sort(
          (a, b) => processes[a].pr - processes[b].pr || processes[a].at - processes[b].at
        )[0]
      } else if (algo === 'rr') {
        pick = r[0]
        const runTime = Math.min(Math.max(1, quantum), rem[pick])
        addSegment(pick, t, t + runTime)
        t += runTime
        rem[pick] -= runTime
        if (rem[pick] === 0) {
          finished[pick] = true
          ct[pick] = t
          doneCount++
        }
        continue
      } else {
        // SRTF (preemptive SJF)
        pick = r.sort((a, b) => rem[a] - rem[b] || processes[a].at - processes[b].at)[0]
        addSegment(pick, t, t + 1)
        t++
        rem[pick]--
        if (rem[pick] === 0) {
          finished[pick] = true
          ct[pick] = t
          doneCount++
        }
        continue
      }

      // Non-preemptive run to completion
      addSegment(pick, t, t + rem[pick])
      t += rem[pick]
      rem[pick] = 0
      finished[pick] = true
      ct[pick] = t
      doneCount++
    }

    let sumTat = 0
    let sumWt = 0
    processes.forEach((p, i) => {
      const tat = ct[i] - p.at
      const wt = tat - p.bt
      sumTat += tat
      sumWt += wt
    })

    return {
      timeline,
      ct,
      avgTat: (sumTat / n).toFixed(2),
      avgWt: (sumWt / n).toFixed(2),
    }
  }, [processes, algo, quantum])

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            CPU Scheduling Live Simulator & Gantt Visualizer
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Compare FCFS, Shortest Job First, SRTF, Priority, and Round Robin in real time.
          </p>
        </div>

        {/* Algorithm Picker */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-neutral-400">Algorithm:</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as any)}
              className="bg-[#1A1A1A] border border-[#333] text-white text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-blue-500"
            >
              <option value="fcfs">FCFS (First-Come, First-Served)</option>
              <option value="sjf">SJF (Non-Preemptive)</option>
              <option value="srtf">SRTF (Preemptive SJF)</option>
              <option value="priority">Priority Scheduling</option>
              <option value="rr">Round Robin (RR)</option>
            </select>
          </div>

          {algo === 'rr' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-neutral-400">Quantum (Q):</label>
              <input
                type="number"
                min="1"
                value={quantum}
                onChange={(e) => setQuantum(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 bg-[#1A1A1A] border border-[#333] text-white text-xs rounded-xl px-2.5 py-1.5 text-center focus:outline-hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Process Table & Config */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#262626] text-neutral-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">Process</th>
              <th className="py-2.5 px-3">Arrival Time (AT)</th>
              <th className="py-2.5 px-3">Burst Time (BT)</th>
              <th className="py-2.5 px-3">Priority (Lower = Higher)</th>
              <th className="py-2.5 px-3">CT</th>
              <th className="py-2.5 px-3">TAT = CT − AT</th>
              <th className="py-2.5 px-3">WT = TAT − BT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E1E]">
            {processes.map((p, idx) => {
              const ctVal = result.ct[idx] ?? 0
              const tatVal = ctVal - p.at
              const wtVal = tatVal - p.bt

              return (
                <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                  <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    {p.name}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      value={p.at}
                      onChange={(e) => handleUpdate(p.id, 'at', Number(e.target.value))}
                      className="w-16 bg-[#181818] border border-[#2B2B2B] text-white px-2 py-1 rounded-lg text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="1"
                      value={p.bt}
                      onChange={(e) => handleUpdate(p.id, 'bt', Number(e.target.value))}
                      className="w-16 bg-[#181818] border border-[#2B2B2B] text-white px-2 py-1 rounded-lg text-center font-bold text-blue-400"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      value={p.pr}
                      onChange={(e) => handleUpdate(p.id, 'pr', Number(e.target.value))}
                      className="w-16 bg-[#181818] border border-[#2B2B2B] text-white px-2 py-1 rounded-lg text-center"
                    />
                  </td>
                  <td className="py-2 px-3 font-mono text-neutral-300">{ctVal}</td>
                  <td className="py-2 px-3 font-mono text-emerald-400 font-semibold">{tatVal}</td>
                  <td className="py-2 px-3 font-mono text-amber-400 font-semibold">{wtVal}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Row Buttons & Averages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddProcess}
            className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#333] text-xs font-semibold transition-colors"
          >
            + Add Process
          </button>
          <button
            type="button"
            onClick={handleRemoveProcess}
            disabled={processes.length <= 1}
            className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-neutral-400 hover:text-white border border-[#333] text-xs font-semibold transition-colors disabled:opacity-40"
          >
            - Remove Process
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#181818] border border-[#282828] rounded-xl px-4 py-2 text-xs font-mono">
          <div>
            <span className="text-neutral-400">Avg Turnaround Time:</span>{' '}
            <span className="text-emerald-400 font-bold">{result.avgTat} units</span>
          </div>
          <div>
            <span className="text-neutral-400">Avg Waiting Time:</span>{' '}
            <span className="text-amber-400 font-bold">{result.avgWt} units</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Visualizer */}
      <div className="space-y-2 pt-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          Gantt Chart Timeline
        </div>
        <div className="overflow-x-auto pb-6 pt-1">
          <div className="flex items-center min-w-max">
            {result.timeline.map((seg, idx) => {
              const width = Math.max(48, (seg.end - seg.start) * 26)
              const isIdle = seg.pid === null
              const procName = isIdle ? 'Idle' : processes[seg.pid]?.name || 'P'
              const color = isIdle ? '#475569' : COLORS[(seg.pid ?? 0) % COLORS.length]

              return (
                <div
                  key={idx}
                  style={{ width: `${width}px`, backgroundColor: color }}
                  className="h-10 text-white font-bold text-xs flex items-center justify-center relative border-r border-[#121212] select-none first:rounded-l-lg last:rounded-r-lg shadow-sm"
                >
                  <span>{procName}</span>
                  {/* Start tick */}
                  <span className="absolute -bottom-5 left-0 text-[10px] font-mono text-neutral-400 -translate-x-1/2">
                    {seg.start}
                  </span>
                  {/* End tick for the last segment */}
                  {idx === result.timeline.length - 1 && (
                    <span className="absolute -bottom-5 right-0 text-[10px] font-mono text-neutral-400 translate-x-1/2">
                      {seg.end}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
