'use client'

import React, { useState } from 'react'

export interface QuizQuestion {
  q: string
  o: string[]
  a: number // index of correct option
  exp?: string
}

interface StudyQuizProps {
  title: string
  questions: QuizQuestion[]
}

export default function StudyQuizComponent({ title, questions }: StudyQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })
  }

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, optIdx]) => {
    return optIdx === questions[Number(qIdx)].a ? acc + 1 : acc
  }, 0)

  const handleReset = () => {
    setSelectedAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span>📝</span> {title}
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Check your understanding of this unit before proceeding to the next.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                score >= questions.length * 0.7
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800'
              }`}
            >
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-white text-xs font-semibold transition-colors"
            >
              Retake
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userAns = selectedAnswers[qIdx]
          const isAnswered = userAns !== undefined

          return (
            <div
              key={qIdx}
              className="p-3.5 sm:p-4 rounded-xl bg-[#161616] border border-[#242424] space-y-2.5"
            >
              <div className="font-semibold text-xs sm:text-sm text-white">
                <span className="text-blue-400 font-mono mr-1.5">Q{qIdx + 1}.</span>
                {q.q}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.o.map((opt, optIdx) => {
                  const isSelected = userAns === optIdx
                  const isCorrect = q.a === optIdx

                  let btnStyle = 'bg-[#1C1C1C] text-neutral-300 border-[#2A2A2A] hover:bg-[#252525]'
                  if (isSelected && !submitted) {
                    btnStyle = 'bg-blue-600/30 text-blue-200 border-blue-500 font-semibold'
                  } else if (submitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-600 font-bold'
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/80 text-rose-300 border-rose-600'
                    } else {
                      btnStyle = 'bg-[#181818] text-neutral-500 border-[#222]'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-current text-[10px] font-mono flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {submitted && isCorrect && (
                        <span className="text-emerald-400 font-bold text-xs">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Feedback if submitted */}
              {submitted && q.exp && (
                <div className="pt-2 text-[11px] text-neutral-400 border-t border-[#222] font-mono">
                  <span className="text-blue-400 font-bold">Explanation:</span> {q.exp}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Check Answers ({Object.keys(selectedAnswers).length} / {questions.length} answered)
          </button>
        </div>
      )}
    </div>
  )
}
