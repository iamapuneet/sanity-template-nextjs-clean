'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExamStoreProvider } from '@/lib/store'

interface ClientLayoutWrapperProps {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

export default function ClientLayoutWrapper({
  header,
  footer,
  children,
}: ClientLayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminOrPractice = pathname.startsWith('/admin') || pathname.startsWith('/practice')

  return (
    <ExamStoreProvider>
      {isAdminOrPractice ? (
        <div className="min-h-screen bg-gray-50">{children}</div>
      ) : (
        <section className="min-h-screen pt-24">
          {header}
          <main className="">{children}</main>
          {footer}
        </section>
      )}
    </ExamStoreProvider>
  )
}

