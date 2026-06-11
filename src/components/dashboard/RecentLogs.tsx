'use client'

import { ChevronRight } from 'lucide-react'
import type { WorkLog } from '@/types'

const TAG_COLORS: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400',
}

const TAG_ICON: Record<string, string> = {
  purple: 'bg-purple-400',
  blue: 'bg-blue-400',
  orange: 'bg-orange-400',
  teal: 'bg-teal-400',
  sky: 'bg-sky-400',
  green: 'bg-green-400',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

interface RecentLogsProps {
  logs: WorkLog[]
}

export default function RecentLogs({ logs }: RecentLogsProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">Recent Logs</h3>
        <button className="text-[12px] text-[#F4C430] hover:text-[#e0b420] font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-2">
        {logs.length === 0 && (
          <p className="text-[13px] text-gray-400 dark:text-[#555] text-center py-8">
            No logs yet. Generate your first report above!
          </p>
        )}
        {logs.slice(0, 5).map(log => (
          <div
            key={log.id}
            className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl px-4 py-3 hover:border-gray-200 dark:hover:border-[#333] transition-all cursor-pointer group"
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#252525] flex items-center justify-center shrink-0">
              <span className={`w-2 h-2 rounded-full ${TAG_ICON[log.tagColor] ?? 'bg-gray-400'}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-gray-400 dark:text-[#555]">{formatDate(log.date)}</p>
              <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{log.title}</p>
            </div>

            {/* Tag + time */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${TAG_COLORS[log.tagColor] ?? 'bg-gray-100 text-gray-500'}`}>
                {log.tag}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-[#555]">{log.time}</span>
              <ChevronRight size={14} className="text-gray-300 dark:text-[#444] group-hover:text-gray-500 dark:group-hover:text-[#666] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
