import type { WorkLog, Settings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'
import type { Repository } from './types'

const LOGS_KEY = 'worklogger_logs'
const SETTINGS_KEY = 'worklogger_settings'
const MAX_LOGS = 100

function readLogs(): WorkLog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    if (raw) return JSON.parse(raw) as WorkLog[]
    const defaults = seedLogs()
    localStorage.setItem(LOGS_KEY, JSON.stringify(defaults))
    return defaults
  } catch {
    return []
  }
}

function writeLogs(logs: WorkLog[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)))
}

export const localRepository: Repository = {
  async getLogs() {
    return readLogs()
  },

  async saveLog(log) {
    const logs = readLogs().filter((l) => l.id !== log.id)
    logs.unshift(log)
    writeLogs(logs)
  },

  async deleteLog(id) {
    writeLogs(readLogs().filter((l) => l.id !== id))
  },

  async clearLogs() {
    if (typeof window === 'undefined') return
    localStorage.setItem(LOGS_KEY, JSON.stringify([]))
  },

  async getSettings() {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (!raw) return DEFAULT_SETTINGS
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  async saveSettings(settings) {
    if (typeof window === 'undefined') return
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  },
}

// ── Seed data ──
// Sample logs so a first-time visitor sees a populated dashboard. Real user
// logs replace these on first save.
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function seedLogs(): WorkLog[] {
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
