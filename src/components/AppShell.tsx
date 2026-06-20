'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Loader2, BellOff } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from './AuthProvider'

interface AppShellProps {
  children: ReactNode
  /** Optional global search bound to a page's filter. */
  search?: { value: string; onChange: (v: string) => void; placeholder?: string }
}

export default function AppShell({ children, search }: AppShellProps) {
  const router = useRouter()
  const { user, loading, enabled } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  // Route guard: when auth is active, bounce unauthenticated users to /login.
  useEffect(() => {
    if (enabled && !loading && !user) router.replace('/login')
  }, [enabled, loading, user, router])

  if (enabled && (loading || !user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0d0d0d]">
        <Loader2 className="animate-spin text-[#F4C430]" size={24} />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[210px] min-w-0 w-0">
        <header className="flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-sm border-b border-gray-100 dark:border-[#1e1e1e] shrink-0 z-10">
          <div className="flex-1" />
          <div className="w-72">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2">
              <Search size={13} className="text-gray-300 dark:text-[#444] shrink-0" />
              <input
                type="text"
                value={search?.value ?? ''}
                onChange={(e) => search?.onChange(e.target.value)}
                disabled={!search}
                placeholder={search?.placeholder ?? 'Search anything...'}
                className="flex-1 bg-transparent text-[12px] text-gray-600 dark:text-[#888] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Bell size={16} className="text-gray-400 dark:text-[#555]" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-[#252525]">
                      <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Notifications</p>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <BellOff size={22} className="text-gray-300 dark:text-[#444] mb-2" />
                      <p className="text-[12px] text-gray-400 dark:text-[#666]">No notifications yet</p>
                      <p className="text-[11px] text-gray-300 dark:text-[#555] mt-0.5 text-center">
                        You&apos;re all caught up.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
