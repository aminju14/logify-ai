'use client'

import { LayoutList, CalendarCheck, Flame } from 'lucide-react'

interface QuickStatsProps {
  logsThisWeek: number
  activeDaysThisWeek: number
  streak: number
}

export default function QuickStats({ logsThisWeek, activeDaysThisWeek, streak }: QuickStatsProps) {
  const items = [
    { Icon: LayoutList, label: 'Logs this week', value: logsThisWeek },
    { Icon: CalendarCheck, label: 'Active days', value: `${activeDaysThisWeek}/7` },
    { Icon: Flame, label: 'Day streak', value: streak },
  ]
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
      <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ Icon, label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-[#141414] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={12} className="text-[#F4C430]" />
              <span className="text-[10px] text-gray-400 dark:text-[#555] leading-tight">{label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
