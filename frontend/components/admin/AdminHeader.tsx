'use client'

import React from 'react'
import Link from 'next/link'
import { Icons } from './Icons'

interface AdminHeaderProps {
  onToggleMobile: () => void
  title?: string
  subtitle?: string
}

export default function AdminHeader({
  onToggleMobile,
  title = 'Dashboard',
  subtitle = 'Government Exam Question Bank Management',
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Open Navigation"
        >
          <Icons.Menu size={20} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            {title}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section: System state, quick buttons & profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Status chip */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Active</span>
        </div>

        {/* Question Bank fast button */}
        <Link
          href="/admin/questions?action=new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Icons.Plus size={16} />
          <span>New Question</span>
        </Link>

        {/* View Public / Studio link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium border border-gray-200 transition-colors"
          title="Open Public Portal"
        >
          <Icons.ExternalLink size={14} />
          <span className="hidden md:inline">Public Site</span>
        </Link>

        {/* Notification indicator */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Icons.Bell size={18} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        </div>
      </div>
    </header>
  )
}

