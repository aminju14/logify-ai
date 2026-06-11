'use client'

import { useState, useEffect, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import InputCard from '@/components/dashboard/InputCard'
import RecentLogs from '@/components/dashboard/RecentLogs'
import CalendarWidget from '@/components/right-panel/CalendarWidget'
import ProgressChart from '@/components/right-panel/ProgressChart'
import QuickStats from '@/components/right-panel/QuickStats'
import ReportModal from '@/components/modals/ReportModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import { getLogs, saveLog, getWeekStats } from '@/lib/storage'
import type { WorkLog, GeneratedReport } from '@/types'

const TAG_COLOR_MAP: Record<string, string> = {
  Meeting: 'teal',
  Development: 'purple',
  'Bug Fix': 'orange',
  Research: 'teal',
  Design: 'sky',
}

function greeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  if (h >= 17 && h < 22) return 'Good evening'
  return 'Good night'
}

export default function Dashboard() {
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [stats, setStats] = useState({ logsThisWeek: 0, hoursLogged: 0 })
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [pendingInput, setPendingInput] = useState('')
  const [pendingTags, setPendingTags] = useState<string[]>([])

  useEffect(() => {
    setLogs(getLogs())
    setStats(getWeekStats())
  }, [])

  const generate = useCallback(async (input: string, tags: string[]) => {
    setPendingInput(input)
    setPendingTags(tags)
    setLoading(true)
    setLoadStep(0)
    const t1 = setTimeout(() => setLoadStep(1), 600)
    const t2 = setTimeout(() => setLoadStep(2), 1200)
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tags }),
      })
      const data = await res.json()
      if (res.ok) setReport(data as GeneratedReport)
    } catch {
      // silent fail
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }, [])

  const handleSave = () => {
    if (!report) return
    const now = new Date()
    const tag = pendingTags[0] ?? 'General'
    const log: WorkLog = {
      id: `log-${Date.now()}`,
      date: now.toISOString(),
      title: report.summary.split('.')[0].slice(0, 60),
      tag,
      tagColor: TAG_COLOR_MAP[tag] ?? 'purple',
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      input: pendingInput,
      report,
    }
    saveLog(log)
    setLogs(getLogs())
    setStats(getWeekStats())
    setReport(null)
  }

  return (
    <AppShell>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()},{' '}
            <span className="text-[#F4C430]">MinLabs</span>{' '}
            <span>👋</span>
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-[#666] mt-1">
            Ready to log your work today?
          </p>
        </div>
        <InputCard onGenerate={generate} loading={loading} />
        <RecentLogs logs={logs} />
      </main>

      {/* Right panel */}
      <aside className="w-[290px] shrink-0 overflow-y-auto px-4 py-6 border-l border-gray-100 dark:border-[#1e1e1e] space-y-4">
        <CalendarWidget />
        <ProgressChart />
        <QuickStats logsThisWeek={stats.logsThisWeek} hoursLogged={stats.hoursLogged} />
      </aside>

      {loading && <LoadingOverlay step={loadStep} />}
      {report && !loading && (
        <ReportModal
          report={report}
          onClose={() => setReport(null)}
          onSave={handleSave}
          onRegenerate={() => generate(pendingInput, pendingTags)}
          loading={loading}
        />
      )}
    </AppShell>
  )
}
