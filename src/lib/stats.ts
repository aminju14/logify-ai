import type { WorkLog } from '@/types'

// All stats here are computed from actual logs. We deliberately do NOT report
// "hours worked" or a "productivity %" — the app captures no duration or
// outcome data, so any such number would be fabricated. We report what we can
// honestly derive: log counts, active days, streaks, and tag distribution.

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function nDaysAgo(n: number): Date {
  const d = startOfDay(new Date())
  d.setDate(d.getDate() - n)
  return d
}

/** Logs whose date falls in [from, to). */
function inRange(logs: WorkLog[], from: Date, to: Date): WorkLog[] {
  return logs.filter((l) => {
    const d = new Date(l.date)
    return d >= from && d < to
  })
}

/** Number of distinct calendar days that have at least one log. */
function activeDays(logs: WorkLog[]): number {
  return new Set(logs.map((l) => new Date(l.date).toDateString())).size
}

/** Consecutive days up to today that each have at least one log. */
export function currentStreak(logs: WorkLog[]): number {
  const days = new Set(logs.map((l) => startOfDay(new Date(l.date)).getTime()))
  let streak = 0
  const cursor = startOfDay(new Date())
  // Allow the streak to count from today or, if today has no log yet, from
  // yesterday — so an unlogged morning doesn't zero a real streak.
  if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1)
  while (days.has(cursor.getTime())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export interface WeekStats {
  logsThisWeek: number
  activeDaysThisWeek: number
  streak: number
  /** Daily log counts for the last 7 days, oldest first. */
  weekTrend: { label: string; value: number }[]
}

/** Daily log counts for the last 7 days (oldest → newest). */
function dailyCounts(logs: WorkLog[]): { label: string; value: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = nDaysAgo(6 - i)
    const next = new Date(day.getTime() + 86_400_000)
    return {
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      value: inRange(logs, day, next).length,
    }
  })
}

/** Compact stats for the dashboard right panel. */
export function weekStats(logs: WorkLog[]): WeekStats {
  const weekStart = nDaysAgo(6)
  const weekEnd = new Date(startOfDay(new Date()).getTime() + 86_400_000)
  const week = inRange(logs, weekStart, weekEnd)
  return {
    logsThisWeek: week.length,
    activeDaysThisWeek: activeDays(week),
    streak: currentStreak(logs),
    weekTrend: dailyCounts(logs),
  }
}

export interface Activity {
  label: string
  percent: number
}

export interface InsightStats {
  totalLogs: number
  totalLogsChange: number
  activeDays: number
  activeDaysChange: number
  streak: number
  activities: Activity[]
  /** Daily log counts for the last 7 days, oldest first. */
  dailyCounts: { label: string; value: number }[]
}

/** Full stats for the Insights page — this week vs last week, all from logs. */
export function insightStats(logs: WorkLog[]): InsightStats {
  const today = startOfDay(new Date())
  const tomorrow = new Date(today.getTime() + 86_400_000)
  const thisWeekStart = nDaysAgo(6)
  const lastWeekStart = nDaysAgo(13)

  const thisWeek = inRange(logs, thisWeekStart, tomorrow)
  const lastWeek = inRange(logs, lastWeekStart, thisWeekStart)

  // Tag distribution this week
  const tagCounts: Record<string, number> = {}
  thisWeek.forEach((l) => {
    tagCounts[l.tag] = (tagCounts[l.tag] ?? 0) + 1
  })
  const denom = thisWeek.length || 1
  const activities: Activity[] = Object.entries(tagCounts)
    .map(([label, count]) => ({ label, percent: Math.round((count / denom) * 100) }))
    .sort((a, b) => b.percent - a.percent)

  return {
    totalLogs: thisWeek.length,
    totalLogsChange: thisWeek.length - lastWeek.length,
    activeDays: activeDays(thisWeek),
    activeDaysChange: activeDays(thisWeek) - activeDays(lastWeek),
    streak: currentStreak(logs),
    activities,
    dailyCounts: dailyCounts(logs),
  }
}
