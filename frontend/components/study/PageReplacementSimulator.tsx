'use client'

import React, { useState, useMemo } from 'react'

export default function PageReplacementSimulator() {
  const [refString, setRefString] = useState<string>(
    '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1'
  )
  const [framesCount, setFramesCount] = useState<number>(3)
  const [algo, setAlgo] = useState<'fifo' | 'lru' | 'optimal'>('fifo')

  // Parse reference numbers
  const pages = useMemo(() => {
    return refString
      .trim()
      .split(/[\s,]+/)
      .map((x) => Number(x))
      .filter((x) => !isNaN(x))
  }, [refString])

  // Simulation Logic
  const simulation = useMemo(() => {
    const n = pages.length
    const numFrames = Math.max(1, Math.min(8, framesCount))
    if (n === 0) return { history: [], faults: 0, hits: 0, hitRatio: 0 }

    const frames: number[] = []
    const history: Array<{
      page: number
      frames: number[]
      hit: boolean
      victim?: number
    }> = []

    let faults = 0
    let ptr = 0 // FIFO pointer

    pages.forEach((page, i) => {
      const hit = frames.includes(page)

      if (hit) {
        history.push({
          page,
          frames: [...frames],
          hit: true,
        })
      } else {
        faults++
        let victimIdx = -1

        if (frames.length < numFrames) {
          frames.push(page)
        } else {
          if (algo === 'fifo') {
            victimIdx = ptr
            ptr = (ptr + 1) % numFrames
          } else if (algo === 'lru') {
            let oldest = Infinity
            frames.forEach((f, idx) => {
              const lastUsed = pages.slice(0, i).lastIndexOf(f)
              if (lastUsed < oldest) {
                oldest = lastUsed
                victimIdx = idx
              }
            })
          } else {
            // Optimal
            let farthest = -1
            frames.forEach((f, idx) => {
              const nextIndex = pages.indexOf(f, i + 1)
              const dist = nextIndex === -1 ? Infinity : nextIndex
              if (dist > farthest) {
                farthest = dist
                victimIdx = idx
              }
            })
          }
          frames[victimIdx] = page
        }

        history.push({
          page,
          frames: [...frames],
          hit: false,
          victim: victimIdx,
        })
      }
    })

    const hits = n - faults
    const hitRatio = n > 0 ? ((hits / n) * 100).toFixed(1) : '0'

    return {
      history,
      faults,
      hits,
      hitRatio,
    }
  }, [pages, framesCount, algo])

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
            Page Replacement Algorithm Simulator (Demand Paging)
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Visualize page allocation in main memory frames, page hits, and page faults.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-2">
          {(['fifo', 'lru', 'optimal'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAlgo(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                algo === mode
                  ? 'bg-violet-600 text-white border-violet-500 shadow-xs'
                  : 'bg-[#1A1A1A] text-neutral-400 hover:text-white border-[#333]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-8 space-y-1">
          <label className="text-xs font-mono text-neutral-400">
            Reference String (space or comma separated):
          </label>
          <input
            type="text"
            value={refString}
            onChange={(e) => setRefString(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333] text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-hidden focus:border-violet-500"
          />
        </div>

        <div className="md:col-span-4 space-y-1">
          <label className="text-xs font-mono text-neutral-400">Memory Frames:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="8"
              value={framesCount}
              onChange={(e) => setFramesCount(Number(e.target.value) || 1)}
              className="w-20 bg-[#1A1A1A] border border-[#333] text-white text-xs rounded-xl px-3 py-2 text-center font-bold focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setRefString('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1')}
              className="px-3 py-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] text-xs text-neutral-300 font-medium border border-[#333] transition-colors whitespace-nowrap"
            >
              Standard Example
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Page Faults (Misses)</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {simulation.faults}
          </div>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Page Hits</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {simulation.hits}
          </div>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Hit Ratio</div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">
            {simulation.hitRatio}%
          </div>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Fault Rate</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {(100 - Number(simulation.hitRatio)).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Step-by-Step Frame Matrix Table */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          Memory Frames State Trace (Horizontal Step by Step)
        </div>
        <div className="overflow-x-auto pb-4">
          <table className="border-collapse text-xs text-center font-mono">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left bg-[#161616] border border-[#2B2B2B] text-neutral-400 sticky left-0 z-10">
                  Page Ref
                </th>
                {simulation.history.map((h, idx) => (
                  <th
                    key={idx}
                    className="py-2 px-2.5 min-w-[34px] border border-[#2B2B2B] bg-[#1E1E1E] text-white font-bold"
                  >
                    {h.page}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Frame Rows */}
              {Array.from({ length: framesCount }).map((_, fIdx) => (
                <tr key={fIdx}>
                  <td className="py-2 px-3 text-left bg-[#161616] border border-[#2B2B2B] text-neutral-400 font-semibold sticky left-0 z-10">
                    Frame {fIdx + 1}
                  </td>
                  {simulation.history.map((h, stepIdx) => {
                    const pageInFrame = h.frames[fIdx]
                    const hasPage = pageInFrame !== undefined
                    return (
                      <td
                        key={stepIdx}
                        className={`py-2 px-2.5 border border-[#222] ${
                          hasPage ? 'text-white' : 'text-neutral-600'
                        }`}
                      >
                        {hasPage ? pageInFrame : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Status Row (Hit or Miss) */}
              <tr>
                <td className="py-2 px-3 text-left bg-[#161616] border border-[#2B2B2B] text-neutral-400 font-bold sticky left-0 z-10">
                  Status
                </td>
                {simulation.history.map((h, stepIdx) => (
                  <td
                    key={stepIdx}
                    className={`py-1.5 px-1 border border-[#2B2B2B] font-bold text-[11px] ${
                      h.hit
                        ? 'bg-emerald-950/70 text-emerald-300'
                        : 'bg-rose-950/70 text-rose-300'
                    }`}
                  >
                    {h.hit ? 'HIT' : 'MISS'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
