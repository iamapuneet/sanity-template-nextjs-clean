import { Suspense } from 'react'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { AllPosts } from '@/app/components/Posts'
import { settingsQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import { dataAttr } from '@/sanity/lib/utils'

export default async function Page() {
  let settings: any = null
  try {
    const res = await sanityFetch({
      query: settingsQuery,
    })
    settings = res.data
  } catch {
    // Fallback
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section (Black & White Theme) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-100/70 via-white to-white py-16 sm:py-24 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider">
            <span>Official Question Repository</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black">
            ExamForge
          </h1>

          <p className="text-lg sm:text-2xl font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Government Exam Question Bank & Practice Platform
          </p>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Centralized repository for Reasoning, Quantitative Aptitude, General Knowledge, Science, Computer, English, and Hindi. Curate verified MCQs, structure hierarchical syllabus branches, and generate balanced practice drill tests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/admin"
              className="px-6 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Open Admin Panel</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            <Link
              href="/admin/questions"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-black font-semibold text-sm border border-gray-300 shadow-xs transition-colors"
            >
              Browse Question Bank
            </Link>

            <Link
              href="/admin/practice-tests"
              className="px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-black font-semibold text-sm border border-gray-200 transition-colors"
            >
              Practice Tests
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <span className="text-xs text-gray-500 font-medium">Core Subjects</span>
              <div className="text-xl font-bold text-black mt-0.5">7 Subjects</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <span className="text-xs text-gray-500 font-medium">Topic Hierarchy</span>
              <div className="text-xl font-bold text-black mt-0.5">Multi-level Tree</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <span className="text-xs text-gray-500 font-medium">Question Format</span>
              <div className="text-xl font-bold text-black mt-0.5">Standard MCQ</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <span className="text-xs text-gray-500 font-medium">Database</span>
              <div className="text-xl font-bold text-black mt-0.5">MySQL Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Description / Sanity Content Preview (Preserved for Studio compatibility) */}
      <section className="container mx-auto px-4 max-w-4xl space-y-6">
        {settings?.description && (
          <div
            className="prose text-gray-700 mx-auto text-center"
            data-sanity={dataAttr({
              id: settings._id,
              type: 'settings',
              path: 'description',
            }).toString()}
          >
            <PortableText value={settings.description} />
          </div>
        )}

        {/* Existing Sanity Posts section (if any articles exist) */}
        <Suspense fallback={<div className="text-center text-xs text-gray-400 py-6">Loading announcements...</div>}>
          <AllPosts />
        </Suspense>
      </section>
    </div>
  )
}
