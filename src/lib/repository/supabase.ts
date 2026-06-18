import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { WorkLog, Settings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'
import type { Repository } from './types'

// ── Configuration ──
// Supabase is OPT-IN. Until both env vars are set, isSupabaseConfigured()
// returns false and the app uses the localStorage repository instead. To
// enable: create a Supabase project, run supabase/schema.sql, and fill
// NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey)
}

let client: SupabaseClient | null = null
function getClient(): SupabaseClient {
  if (!client) {
    if (!url || !anonKey) throw new Error('Supabase is not configured')
    client = createClient(url, anonKey)
  }
  return client
}

// Row shape in the `logs` table (snake_case) ↔ WorkLog (camelCase).
interface LogRow {
  id: string
  date: string
  title: string
  tag: string
  tag_color: string
  time: string
  input: string
  report: WorkLog['report'] | null
}

function rowToLog(r: LogRow): WorkLog {
  return {
    id: r.id,
    date: r.date,
    title: r.title,
    tag: r.tag,
    tagColor: r.tag_color,
    time: r.time,
    input: r.input,
    report: r.report ?? undefined,
  }
}

function logToRow(l: WorkLog): LogRow {
  return {
    id: l.id,
    date: l.date,
    title: l.title,
    tag: l.tag,
    tag_color: l.tagColor,
    time: l.time,
    input: l.input,
    report: l.report ?? null,
  }
}

/**
 * Supabase-backed repository. Row-level security scopes rows to the signed-in
 * user (see supabase/schema.sql), so these queries don't filter by user_id
 * explicitly — RLS does it. Auth wiring (sign-in/up) is a later step; this
 * compiles and works once the env vars + schema are in place.
 */
export const supabaseRepository: Repository = {
  async getLogs() {
    const { data, error } = await getClient()
      .from('logs')
      .select('*')
      .order('date', { ascending: false })
    if (error) throw error
    return (data as LogRow[]).map(rowToLog)
  },

  async saveLog(log) {
    const { error } = await getClient().from('logs').upsert(logToRow(log))
    if (error) throw error
  },

  async deleteLog(id) {
    const { error } = await getClient().from('logs').delete().eq('id', id)
    if (error) throw error
  },

  async clearLogs() {
    // Deletes the caller's own rows (RLS prevents touching others').
    const { error } = await getClient().from('logs').delete().neq('id', '')
    if (error) throw error
  },

  async getSettings() {
    const { data, error } = await getClient()
      .from('settings')
      .select('value')
      .maybeSingle()
    if (error) throw error
    if (!data) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...(data.value as Partial<Settings>) }
  },

  async saveSettings(settings) {
    const { error } = await getClient()
      .from('settings')
      .upsert({ value: settings })
    if (error) throw error
  },
}
