import type { Repository } from './types'
import { localRepository } from './local'
import { supabaseRepository, isSupabaseConfigured } from './supabase'

export type { Repository } from './types'

/**
 * The active repository. Supabase is used when its env vars are configured;
 * otherwise we fall back to localStorage. This is the ONLY place that decides
 * the backend — components import `repository` and never know the difference.
 */
export const repository: Repository = isSupabaseConfigured()
  ? supabaseRepository
  : localRepository
