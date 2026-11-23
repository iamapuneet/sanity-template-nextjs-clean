'use client'

import React, { useState, useMemo } from 'react'

interface ProcessMatrix {
  id: number
  name: string
  alloc: [number, number, number]
  max: [number, number, number]
}

const DEFAULT_PROCESSES: ProcessMatrix[] = [
  { id: 0, name: 'P0', alloc: [0, 1, 0], max: [7, 5, 3] },
  { id: 1, name: 'P1', alloc: [2, 0, 0], max: [3, 2, 2] },
  { id: 2, name: 'P2', alloc: [3, 0, 2], max: [9, 0, 2] },
  { id: 3, name: 'P3', alloc: [2, 1, 1], max: [2, 2, 2] },
  { id: 4, name: 'P4', alloc: [0, 0, 2], max: [4, 3, 3] },
]

export default function BankersAlgorithmSimulator() {
  const [processes, setProcesses] = useState<ProcessMatrix[]>(DEFAULT_PROCESSES)
  const [avail, setAvail] = useState<[number, number, number]>([3, 3, 2])

  const handleUpdate = (
    procId: number,
    matrix: 'alloc' | 'max',
    index: number,
    val: number
  ) => {
    setProcesses(
      processes.map((p) => {
        if (p.id !== procId) return p
        const updated = [...p[matrix]] as [number, number, number]
        updated[index] = Math.max(0, val)
        return { ...p, [matrix]: updated }
      })
    )
  }

  const handleAvailChange = (index: number, val: number) => {
    const updated = [...avail] as [number, number, number]
    updated[index] = Math.max(0, val)
    setAvail(updated)
  }

  // Safety Algorithm Calculation
  const safetyResult = useMemo(() => {
    const n = processes.length
    const m = 3
    // Need = Max - Allocation
    const need = processes.map((p) => [
      Math.max(0, p.max[0] - p.alloc[0]),
      Math.max(0, p.max[1] - p.alloc[1]),
      Math.max(0, p.max[2] - p.alloc[2]),
    ])

    const work = [...avail]
    const finish = new Array(n).fill(false)
    const seq: number[] = []
    const trace: string[] = []

    let progress = true
    let step = 1
    while (progress) {
      progress = false
      for (let i = 0; i < n; i++) {
        if (!finish[i] && need[i].every((needVal, j) => needVal <= work[j])) {
          // Process can finish
          trace.push(
            `Step ${step++}: ${processes[i].name} executes (Need: [${need[i].join(', ')}] ≤ Work: [${work.join(', ')}]). Releases [${processes[i].alloc.join(', ')}] → New Work = [${work.map((w, j) => w + processes[i].alloc[j]).join(', ')}]`
          )
          for (let j = 0; j < m; j++) {
            work[j] += processes[i].alloc[j]
          }
          finish[i] = true
          seq.push(i)
          progress = true
        }
      }
    }

    const isSafe = finish.every(Boolean)
    return {
      isSafe,
      need,
      seq: seq.map((i) => processes[i].name),
      trace,
    }
  }, [processes, avail])

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Banker's Algorithm — Deadlock Avoidance Simulator
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dijkstra's Banker's Algorithm determines if resource allocation leads to a SAFE or UNSAFE state.
          </p>
        </div>

        {/* Available Vector Input */}
        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-3 py-2 rounded-xl">
          <span className="text-xs font-mono text-neutral-400">Available [A, B, C]:</span>
          <div className="flex items-center gap-1.5">
            {avail.map((v, idx) => (
              <input
                key={idx}
                type="number"
                min="0"
                value={v}
                onChange={(e) => handleAvailChange(idx, Number(e.target.value))}
                className="w-10 bg-[#252525] border border-[#3A3A3A] text-white text-xs rounded-lg text-center py-1 font-bold font-mono text-emerald-400 focus:outline-hidden"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Process Allocation & Max Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#262626] text-neutral-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">Process</th>
              <th className="py-2.5 px-3">Allocation [A, B, C]</th>
              <th className="py-2.5 px-3">Max Demand [A, B, C]</th>
              <th className="py-2.5 px-3">Need Matrix (Max − Alloc)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E1E]">
            {processes.map((p, pIdx) => {
              const currentNeed = safetyResult.need[pIdx]
              return (
                <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                  {/* Allocation Inputs */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {p.alloc.map((val, idx) => (
                        <input
                          key={idx}
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            handleUpdate(p.id, 'alloc', idx, Number(e.target.value))
                          }
                          className="w-10 bg-[#181818] border border-[#2B2B2B] text-white px-1.5 py-1 rounded-md text-center font-mono"
                        />
                      ))}
                    </div>
                  </td>
                  {/* Max Inputs */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {p.max.map((val, idx) => (
                        <input
                          key={idx}
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            handleUpdate(p.id, 'max', idx, Number(e.target.value))
                          }
                          className="w-10 bg-[#181818] border border-[#2B2B2B] text-white px-1.5 py-1 rounded-md text-center font-mono"
                        />
                      ))}
                    </div>
                  </td>
                  {/* Need Calculated */}
                  <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">
                    [{currentNeed ? currentNeed.join(', ') : ''}]
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Safety Outcome Card */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          safetyResult.isSafe
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                safetyResult.isSafe ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            />
            <span className="font-bold text-sm">
              {safetyResult.isSafe
                ? 'System is in a SAFE State'
                : 'System is in an UNSAFE State (Potential Deadlock)'}
            </span>
          </div>
          {safetyResult.isSafe && (
            <p className="text-xs opacity-90 font-mono">
              Safe Execution Sequence: &lt;{safetyResult.seq.join(', ')}&gt;
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setProcesses(DEFAULT_PROCESSES)
            setAvail([3, 3, 2])
          }}
          className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-semibold text-white transition-colors"
        >
          Reset to Example
        </button>
      </div>

      {/* Step-by-Step Trace */}
      {safetyResult.isSafe && safetyResult.trace.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Safety Execution Steps
          </div>
          <div className="space-y-1 font-mono text-xs bg-[#161616] border border-[#222] p-3 rounded-xl max-h-40 overflow-y-auto">
            {safetyResult.trace.map((step, idx) => (
              <div key={idx} className="text-neutral-300 leading-relaxed">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
