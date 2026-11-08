'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'
import { useExamStore } from '@/lib/store'

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
  const { summary } = useExamStore()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Icons.Dashboard,
      exact: true,
    },
    {
      label: 'Subjects',
      href: '/admin/subjects',
      icon: Icons.Subjects,
      badge: summary.totalSubjects,
    },
    {
      label: 'Topic Management',
      href: '/admin/topics',
      icon: Icons.Topics,
      badge: summary.totalTopics,
    },
    {
      label: 'Question Bank',
      href: '/admin/questions',
      icon: Icons.Questions,
      badge: summary.pendingQuestions > 0 ? `${summary.pendingQuestions} pending` : undefined,
      badgeVariant: 'warning',
    },
    {
      label: 'Practice Tests',
      href: '/admin/practice-tests',
      icon: Icons.PracticeTests,
    },
    {
      label: 'Results & Analytics',
      href: '/admin/results',
      icon: Icons.Results,
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link
            href="/admin"
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0 border border-gray-900">
              EF
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-black text-lg leading-tight tracking-tight">
                  ExamForge
                </span>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            )}
          </Link>

          {/* Toggle button on desktop */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <Icons.Close size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {!collapsed ? 'Main Navigation' : '•'}
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            const IconComponent = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div
                  className={`shrink-0 ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-black'
                  }`}
                >
                  <IconComponent size={20} />
                </div>

                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-gray-800 text-gray-200'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-gray-200">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-gray-800 truncate">
                  Admin User
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  Government Exams Bank
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

