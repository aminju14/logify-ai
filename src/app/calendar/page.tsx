'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { getLogs } from '@/lib/storage'
import type { WorkLog } from '@/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TAG_COLORS: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
}

interface CalDay {
  date: Date
  currentMonth: boolean
}

function buildMonthDays(year: number, month: number): CalDay[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const days: CalDay[] = []

  for (let i = firstDay - 1; i >= 0; i--)
    days.push({ date: new Date(year, month - 1, daysInPrev - i), currentMonth: false })

  for (let i = 1; i <= daysInMonth; i++)
    days.push({ date: new Date(year, month, i), currentMonth: true })

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++)
    days.push({ date: new Date(year, month + 1, i), currentMonth: false })

  return days
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function formatDateHeader(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function CalendarPage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(today)
  const [logs, setLogs] = useState<WorkLog[]>([])

  useEffect(() => { setLogs(getLogs()) }, [])

  const days = buildMonthDays(viewYear, viewMonth)
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const logDates = new Set(logs.map(l => {
    const d = new Date(l.date)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }))

  const hasLogs = (d: Date) => logDates.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)

  const selectedLogs = logs.filter(l => isSameDay(new Date(l.date), selected))

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelected(today) }

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-[13px] text-gray-400 dark:text-[#666] mt-1">
            View your logs and activities by date.
          </p>
        </div>

        {/* Calendar card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none mb-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 dark:text-[#555] transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-[14px] font-semibold text-gray-900 dark:text-white w-40 text-center">{monthLabel}</span>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 dark:text-[#555] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            <button onClick={goToday} className="text-[12px] font-medium text-gray-500 dark:text-[#777] bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-[#333] px-3 py-1.5 rounded-lg hover:border-gray-200 dark:hover:border-[#444] transition-colors">
              Today
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-gray-400 dark:text-[#555] py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, i) => {
              const isToday = isSameDay(day.date, today)
              const isSelected = isSameDay(day.date, selected)
              const hasDot = hasLogs(day.date)

              return (
                <button
                  key={i}
                  onClick={() => setSelected(day.date)}
                  className="flex flex-col items-center py-1.5 rounded-xl transition-all group"
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                    isSelected && !isToday
                      ? 'bg-gray-100 dark:bg-[#252525] text-gray-900 dark:text-white'
                      : isToday
                      ? 'bg-[#F4C430] text-black font-bold'
                      : day.currentMonth
                      ? 'text-gray-700 dark:text-[#aaa] group-hover:bg-gray-50 dark:group-hover:bg-white/5'
                      : 'text-gray-300 dark:text-[#444]'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {hasDot && (
                    <span className="w-1 h-1 rounded-full bg-[#F4C430] mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected day logs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white">
              {formatDateHeader(selected)}
            </h2>
            <span className="text-[12px] text-gray-400 dark:text-[#555]">
              {selectedLogs.length} {selectedLogs.length === 1 ? 'Log' : 'Logs'}
            </span>
          </div>

          <div className="space-y-2">
            {selectedLogs.length === 0 ? (
              <p className="text-[13px] text-gray-400 dark:text-[#555] text-center py-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525]">
                No logs for this day.
              </p>
            ) : (
              selectedLogs.map(log => (
                <div key={log.id} className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl px-4 py-3.5 hover:border-gray-200 dark:hover:border-[#333] transition-all cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#F4C430]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{log.title}</p>
                    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md mt-1 ${TAG_COLORS[log.tagColor] ?? 'bg-gray-100 text-gray-500'}`}>
                      {log.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-[#555] shrink-0">{log.time}</span>
                  <ChevronRight size={14} className="text-gray-300 dark:text-[#444] group-hover:text-[#888] transition-colors shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add new log */}
        <Link href="/" className="flex items-center justify-center gap-2 w-full bg-[#F4C430] hover:bg-[#e0b420] text-black font-semibold text-[13px] py-3 rounded-xl transition-colors shadow-sm">
          <Plus size={15} />
          Add New Log
        </Link>
      </main>
    </AppShell>
  )
}
