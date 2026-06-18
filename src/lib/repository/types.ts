import type { WorkLog, Settings } from '@/types'

/**
 * Persistence contract. The UI talks to this interface only — never to
 * localStorage or Supabase directly — so the storage backend can be swapped
 * without touching components.
 *
 * Methods are async so a network-backed implementation (Supabase) can satisfy
 * the same interface as the synchronous localStorage one.
 */
export interface Repository {
  getLogs(): Promise<WorkLog[]>
  saveLog(log: WorkLog): Promise<void>
  deleteLog(id: string): Promise<void>
  clearLogs(): Promise<void>

  getSettings(): Promise<Settings>
  saveSettings(settings: Settings): Promise<void>
}
