'use client'

import { ReactNode } from 'react'
import { Search, Bell } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
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
                placeholder="Search anything..."
                className="flex-1 bg-transparent text-[12px] text-gray-600 dark:text-[#888] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Bell size={16} className="text-gray-400 dark:text-[#555]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F4C430] rounded-full" />
            </button>
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
