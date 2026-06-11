'use client'

import { CalendarDays } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeek(date: Date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function CalendarWidget() {
  const today = new Date()
  const week = getWeek(today)

  const monthYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">{monthYear}</h3>
        <CalendarDays size={15} className="text-gray-300 dark:text-[#444]" />
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-[#555] pb-1">
            {d}
          </div>
        ))}
        {week.map(d => {
          const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          return (
            <div key={d.toISOString()} className="flex items-center justify-center">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-medium transition-colors ${
                  isToday
                    ? 'bg-[#F4C430] text-black font-bold'
                    : 'text-gray-600 dark:text-[#888] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer'
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
