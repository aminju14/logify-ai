'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Calendar, BarChart2, Settings, Crown, ChevronDown, Sun, Moon, Zap } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: BookOpen, label: 'My Logs', href: '/my-logs' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: BarChart2, label: 'Insights', href: '/insights' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  return (
    <aside className="w-[210px] h-screen flex flex-col fixed left-0 top-0 z-20 bg-white dark:bg-[#161616] border-r border-gray-100 dark:border-[#252525]">
      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#F4C430] rounded-lg flex items-center justify-center shadow-sm">
            <Zap size={13} className="text-black fill-black" />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">
            Logify <span className="text-[#F4C430]">AI</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'bg-[#F4C430]/15 text-[#C9941A] dark:bg-[#F4C430]/10 dark:text-[#F4C430]'
                  : 'text-gray-500 dark:text-[#777] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade to Pro */}
      <div className="mx-3 mb-3 p-4 rounded-2xl bg-amber-50 dark:bg-[#1e1d14] border border-amber-200/60 dark:border-[#3a3820]">
        <div className="flex items-center gap-2 mb-1.5">
          <Crown size={14} className="text-[#F4C430]" />
          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">Upgrade to Pro</span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-[#777] mb-3 leading-relaxed">
          Unlock advanced insights, export reports, and more.
        </p>
        <button className="w-full flex items-center justify-center gap-1.5 bg-[#F4C430] text-black text-[11px] font-semibold py-2 rounded-lg hover:bg-[#e0b420] transition-colors">
          <Crown size={11} />
          Upgrade Now
        </button>
      </div>

      {/* Copyright */}
      <div className="px-5 pb-2 text-center">
        <p className="text-[9px] text-gray-300 dark:text-[#333] tracking-wide select-none">
          © {new Date().getFullYear()} <span className="font-semibold text-[#F4C430]/60">MinLabs</span>
        </p>
      </div>

      {/* User */}
      <div className="mx-3 mb-4 px-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-xs text-black font-bold shrink-0">
            ML
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 dark:text-white truncate">MinLabs</p>
            <p className="text-[10px] text-gray-400 dark:text-[#555] truncate">hello@minlabs.dev</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#666]"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <ChevronDown size={13} className="text-gray-300 dark:text-[#444]" />
        </div>
      </div>
    </aside>
  )
}
