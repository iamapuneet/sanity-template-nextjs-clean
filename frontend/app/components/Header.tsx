import Link from 'next/link'
import { cookies } from 'next/headers'
import { validateSessionWithDatabase } from '@/lib/auth'
import { settingsQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import { ExamForgeLogo } from '@/components/brand'

export default async function Header() {
  let settings: any = null
  try {
    const res = await sanityFetch({
      query: settingsQuery,
    })
    settings = res.data
  } catch {
    // Fallback when Sanity is not connected
  }

  let session = null
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('examforge_session')?.value
    session = await validateSessionWithDatabase(token)
  } catch {
    // Session read error
  }

  const isAdmin = session?.role === 'admin'

  return (
    <header className="fixed z-50 h-20 inset-x-0 top-0 bg-black/90 backdrop-blur-md border-b border-neutral-800 flex items-center shadow-lg text-white">
      <div className="container py-4 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2.5 group" href="/">
            <ExamForgeLogo variant="badge" size={20} className="w-9 h-9 rounded-xl group-hover:border-[#FAFAFA]/40 transition-colors" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-neutral-300 transition-colors leading-tight">
                ExamForge
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">
                {session ? `${session.role === 'admin' ? 'Admin' : 'Student'}: ${session.username}` : 'Auth Required'}
              </span>
            </div>
          </Link>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-2.5 sm:gap-4 leading-5 text-xs sm:text-sm font-semibold text-neutral-300"
            >
              <li>
                <Link
                  href="/study"
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-medium text-xs transition-all flex items-center gap-1.5"
                >
                  <span>📖 Study Notes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Practice Tests</span>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-black"></span>
                </Link>
              </li>

              {/* Admin-only navigation links */}
              {isAdmin && (
                <>
                  <li className="hidden sm:block">
                    <Link
                      href="/admin/questions"
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      Question Bank
                    </Link>
                  </li>

                  <li className="hidden md:block">
                    <Link
                      href="/admin"
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                    >
                      Admin
                    </Link>
                  </li>
                </>
              )}

              {session ? (
                <li className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs text-white font-medium truncate max-w-[120px]">{session.fullName}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {session.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                    </span>
                  </div>
                  <a
                    href="/api/auth/logout"
                    title="Sign Out"
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold border border-neutral-800 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </a>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
