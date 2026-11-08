'use client'

import React from 'react'
import Link from 'next/link'
import { Icons } from './Icons'

interface AdminHeaderProps {
  onToggleMobile: () => void
}

export default function AdminHeader({ onToggleMobile }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left section: mobile hamburger & breadcrumb badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
          aria-label="Open Navigation"
        >
          <Icons.Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
            IA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-black leading-tight tracking-tight">
              Rajasthan Informatics Assistant
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              Administrative Control Console
            </span>
          </div>
        </div>
      </div>

      {/* Right section: System state, quick buttons & candidate link */}
      <div className="flex items-center gap-3">
        {/* Status chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span>Database Live</span>
        </div>

        {/* Candidate Portal Quick Link */}
        <Link
          href="/practice"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-xs"
          title="Open Student MCQ Practice Portal"
        >
          <Icons.CandidatePortal size={14} />
          <span>Student Portal ↗</span>
        </Link>

        {/* Candidate Profile Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-gray-100 border border-gray-200 text-xs">
          <div className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center text-[10px]">
            P
          </div>
          <span className="font-bold text-black text-[11px]">Puneet</span>
        </div>
      </div>
    </header>
  )
}
