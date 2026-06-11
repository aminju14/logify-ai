'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Star, TrendingUp } from 'lucide-react'
import AppShell from '@/components/AppShell'
import DonutChart from '@/components/insights/DonutChart'
import InsightsAreaChart from '@/components/insights/InsightsAreaChart'
import { getInsightStats } from '@/lib/storage'

function StatCard({ label, value, change, unit = '' }: { label: string; value: number | string; change: number; unit?: string }) {
  const positive = change >= 0
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none flex-1">
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp size={13} className="text-[#F4C430]" />
        <span className="text-[11px] text-gray-400 dark:text-[#555]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}{unit}
      </p>
      <p className={`text-[11px] font-medium ${positive ? 'text-emerald-500' : 'text-red-400'}`}>
        vs last week {positive ? '+' : ''}{change}{unit}
      </p>
    </div>
  )
}

function dateRangeLabel() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(now)}, ${now.getFullYear()}`
}

export default function InsightsPage() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    totalLogsChange: 0,
    totalHours: 0,
    totalHoursChange: 0,
    avgProgress: 76,
    avgProgressChange: 12,
    activities: [
      { label: 'Development', percent: 45 },
      { label: 'Design', percent: 25 },
      { label: 'Bug Fix', percent: 15 },
      { label: 'Meeting', percent: 10 },
      { label: 'Research', percent: 5 },
    ],
  })

  useEffect(() => { setStats(getInsightStats()) }, [])

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
            <p className="text-[13px] text-gray-400 dark:text-[#666] mt-1">
              Discover patterns and improve your productivity.
            </p>
          </div>
          {/* Date range picker */}
          <button className="flex items-center gap-1.5 text-[12px] text-gray-600 dark:text-[#888] bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2 hover:border-gray-200 dark:hover:border-[#333] transition-colors shrink-0 mt-1">
            {dateRangeLabel()}
            <ChevronDown size={13} className="text-gray-400 dark:text-[#555]" />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none mb-4">
          <h2 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-2">Overall Progress</h2>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-bold text-[#F4C430]">{stats.avgProgress}%</span>
            <span className="text-[12px] text-emerald-500 font-medium mb-1">
              vs last week: +{stats.avgProgressChange}%
            </span>
          </div>
          <InsightsAreaChart />
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          <StatCard label="Total Logs" value={stats.totalLogs} change={stats.totalLogsChange} />
          <StatCard label="Total Hours" value={stats.totalHours} change={stats.totalHoursChange} />
          <StatCard label="Avg. Progress" value={stats.avgProgress} change={stats.avgProgressChange} unit="%" />
        </div>

        {/* Top Activities */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none mb-4">
          <h2 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-4">Top Activities</h2>
          <DonutChart activities={stats.activities} />
        </div>

        {/* Productivity Tip */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4C430]/10 flex items-center justify-center shrink-0">
              <Star size={14} className="text-[#F4C430] fill-[#F4C430]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-1">Productivity Tip</h3>
              <p className="text-[12px] text-gray-500 dark:text-[#777] leading-relaxed">
                Great job! You&apos;ve been consistent this week.
                <br />
                Try focusing on high-impact tasks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  )
}
