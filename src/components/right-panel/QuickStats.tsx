'use client'

import { LayoutList, Clock } from 'lucide-react'

interface QuickStatsProps {
  logsThisWeek: number
  hoursLogged: number
}

export default function QuickStats({ logsThisWeek, hoursLogged }: QuickStatsProps) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
      <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <LayoutList size={12} className="text-[#F4C430]" />
            <span className="text-[10px] text-gray-400 dark:text-[#555]">Logs this week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{logsThisWeek}</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={12} className="text-[#F4C430]" />
            <span className="text-[10px] text-gray-400 dark:text-[#555]">Hours logged</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{hoursLogged}</p>
        </div>
      </div>
    </div>
  )
}
