'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'
import { ExamForgeLogo } from '@/components/brand'

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
      label: 'Study Notes & Topics',
      href: '/admin/study',
      icon: Icons.BookOpen,
      badge: 'Notes',
    },
    {
      label: 'Topic Calendar',
      href: '/admin/calendar',
      icon: Icons.Calendar,
      badge: 'Adv',
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
      label: 'Import Mock (JSON)',
      href: '/admin/import-mock',
      icon: Icons.Upload,
      badge: 'JSON',
    },
    {
      label: 'Test Assignments',
      href: '/admin/assignments',
      icon: Icons.Assignments,
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
      label: 'Audit & Security',
      href: '/admin/audit-logs',
      icon: Icons.AuditLogs,
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
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F0F0F] border-r border-[#262626] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#262626]">
          <Link
            href="/admin"
            className="flex items-center gap-3 overflow-hidden text-decoration-none group"
          >
            <ExamForgeLogo variant="badge" size={18} className="w-8 h-8 rounded-lg group-hover:border-[#FAFAFA]/40 transition-colors" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-[#FAFAFA]">
                  ExamForge
                </span>
                <span className="text-[10px] text-[#A3A3A3] font-mono tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1C1C1C] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <Icons.Expand size={16} /> : <Icons.Collapse size={16} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 text-[#A3A3A3] hover:text-[#FAFAFA]"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {navModules.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  active
                    ? 'bg-[#1C1C1C] text-[#FAFAFA] border border-[#333333] shadow-xs'
                    : 'text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#151515] border border-transparent'
                }`}
              >
                <div
                  className={`flex-shrink-0 transition-colors ${
                    active ? 'text-[#FAFAFA]' : 'text-[#737373] group-hover:text-[#FAFAFA]'
                  }`}
                >
                  <Icon size={18} />
                </div>
                {!collapsed && (
                  <span className="truncate tracking-tight">{item.label}</span>
                )}
                {!collapsed && (item as any).badge && (
                  <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#222222] text-[#A1A1AA] border border-[#303030]">
                    {(item as any).badge}
                  </span>
                )}
                {!collapsed && active && !(item as any).badge && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FAFAFA]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-[#262626] bg-[#0A0A0A]">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-between'
            } gap-2`}
          >
            {!collapsed && (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-[11px] font-bold text-[#FAFAFA]">
                  AD
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-medium text-[#FAFAFA] truncate">
                    Administrator
                  </span>
                  <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Online
                  </span>
                </div>
              </div>
            )}

            <a
              href="/api/auth/logout"
              title="Logout"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#737373] hover:text-[#EF4444] hover:bg-[#1A1A1A] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
