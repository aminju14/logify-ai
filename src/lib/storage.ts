import type { WorkLog } from '@/types'

const LOGS_KEY = 'worklogger_logs'

export function getLogs(): WorkLog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    if (raw) return JSON.parse(raw) as WorkLog[]
    const defaults = getDefaultLogs()
    localStorage.setItem(LOGS_KEY, JSON.stringify(defaults))
    return defaults
  } catch {
    return []
  }
}

export function saveLog(log: WorkLog): void {
  const logs = getLogs().filter(l => l.id !== log.id)
  logs.unshift(log)
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 100)))
}

export function getWeekStats() {
  const logs = getLogs()
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const weekLogs = logs.filter(l => new Date(l.date) >= startOfWeek)
  const hoursLogged = Math.round(weekLogs.length * 3.2 * 10) / 10
  return { logsThisWeek: weekLogs.length, hoursLogged }
}

export function getInsightStats() {
  const logs = getLogs()
  const now = new Date()

  const startThisWeek = new Date(now)
  startThisWeek.setDate(now.getDate() - 6)
  startThisWeek.setHours(0, 0, 0, 0)

  const startLastWeek = new Date(startThisWeek)
  startLastWeek.setDate(startThisWeek.getDate() - 7)

  const thisWeekLogs = logs.filter(l => new Date(l.date) >= startThisWeek)
  const lastWeekLogs = logs.filter(l => {
    const d = new Date(l.date)
    return d >= startLastWeek && d < startThisWeek
  })

  const tagCounts: Record<string, number> = {}
  thisWeekLogs.forEach(l => {
    tagCounts[l.tag] = (tagCounts[l.tag] ?? 0) + 1
  })

  const total = thisWeekLogs.length || 1
  const activities = Object.entries(tagCounts)
    .map(([label, count]) => ({ label, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent)

  const hoursThis = Math.round(thisWeekLogs.length * 3.2 * 10) / 10
  const hoursLast = Math.round(lastWeekLogs.length * 3.2 * 10) / 10

  return {
    totalLogs: thisWeekLogs.length,
    totalLogsChange: thisWeekLogs.length - lastWeekLogs.length,
    totalHours: hoursThis,
    totalHoursChange: Math.round((hoursThis - hoursLast) * 10) / 10,
    avgProgress: 76,
    avgProgressChange: 12,
    activities: activities.length > 0 ? activities : getDefaultActivities(),
  }
}

function getDefaultActivities() {
  return [
    { label: 'Development', percent: 45 },
    { label: 'Design', percent: 25 },
    { label: 'Bug Fix', percent: 15 },
    { label: 'Meeting', percent: 10 },
    { label: 'Research', percent: 5 },
  ]
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function getDefaultLogs(): WorkLog[] {
  return [
    { id: 'def-1', date: daysAgo(0), title: 'Client Meeting & Requirements', tag: 'Meeting', tagColor: 'teal', time: '04:30 PM', input: 'Discussed Q2 requirements with client.' },
    { id: 'def-2', date: daysAgo(1), title: 'Development Sprint Team Meeting', tag: 'Development', tagColor: 'purple', time: '06:30 PM', input: 'Sprint planning for upcoming features.' },
    { id: 'def-3', date: daysAgo(2), title: 'Dashboard Design & API Integration', tag: 'Design', tagColor: 'sky', time: '08:45 PM', input: 'Worked on dashboard UI and integrated REST API.' },
    { id: 'def-4', date: daysAgo(3), title: 'Bug Fixing & Code Refactor', tag: 'Bug Fix', tagColor: 'orange', time: '07:15 PM', input: 'Fixed authentication bug and refactored legacy modules.' },
    { id: 'def-5', date: daysAgo(4), title: 'Research & Planning', tag: 'Research', tagColor: 'teal', time: '05:40 PM', input: 'Researched new libraries and planned architecture.' },
    { id: 'def-6', date: daysAgo(8), title: 'UI/UX Improvements', tag: 'Design', tagColor: 'sky', time: '06:10 PM', input: 'Improved onboarding flow and fixed spacing issues.' },
    { id: 'def-7', date: daysAgo(9), title: 'Testing & QA', tag: 'Bug Fix', tagColor: 'orange', time: '06:20 PM', input: 'Wrote unit tests and ran QA cycle.' },
    { id: 'def-8', date: daysAgo(10), title: 'Feature Development - Auth Module', tag: 'Development', tagColor: 'purple', time: '07:00 PM', input: 'Built JWT authentication module.' },
  ]
}
