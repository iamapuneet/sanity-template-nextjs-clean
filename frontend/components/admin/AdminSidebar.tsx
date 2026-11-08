'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const navModules = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Icons.Dashboard,
      exact: true,
    },
    {
      label: 'Exam Management',
      href: '/admin/exams',
      icon: Icons.Exams,
    },
    {
      label: 'Subjects',
      href: '/admin/subjects',
      icon: Icons.Subjects,
    },
    {
      label: 'Topic Hierarchy',
      href: '/admin/topics',
      icon: Icons.Topics,
    },
    {
      label: 'Question Bank',
      href: '/admin/questions',
      icon: Icons.Questions,
    },
    {
      label: 'Mock Tests',
      href: '/admin/practice-tests',
      icon: Icons.PracticeTests,
    },
    {
      label: 'Student Management',
      href: '/admin/students',
      icon: Icons.Students,
    },
    {
      label: 'Results & Analytics',
      href: '/admin/results',
      icon: Icons.Results,
    },
    {
      label: 'Question Reports',
      href: '/admin/reports',
      icon: Icons.Reports,
    },
    {
      label: 'Admin & Roles',
      href: '/admin/admins',
      icon: Icons.Admins,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Icons.Settings,
    },
  ]

  const isActive = (itemHref: string, exact?: boolean) => {
    if (exact) {
      return pathname === itemHref
    }
    return pathname.startsWith(itemHref)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          <Link
            href="/admin"
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0 border border-black">
              EF
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-black text-black text-lg leading-tight tracking-tight">
                  ExamForge
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Admin Platform
                </span>
              </div>
            )}
          </Link>

          {/* Toggle button on desktop */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Icons.ChevronRight
              size={18}
              className={`transform transition-transform duration-200 ${
                collapsed ? '' : 'rotate-180'
              }`}
            />
          </button>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
          >
            <Icons.Close size={20} />
          </button>
        </div>

        {/* Candidate Portal Quick Switch Banner */}
        <div className="px-3 pt-3">
          <Link
            href="/practice"
            target="_blank"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-900 border border-gray-200 hover:bg-black hover:text-white transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Open Student MCQ Practice Portal"
          >
            <Icons.CandidatePortal size={16} className="shrink-0" />
            {!collapsed && (
              <span className="truncate flex-1">Student Portal ↗</span>
            )}
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {!collapsed ? 'Modules' : '•'}
          </div>

          {navModules.map((item) => {
            const active = isActive(item.href, item.exact)
            const IconComponent = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div
                  className={`shrink-0 ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-black'
                  }`}
                >
                  <IconComponent size={19} />
                </div>

                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-gray-900 truncate">
                  Super Admin
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  Raj. Informatics Assistant
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
