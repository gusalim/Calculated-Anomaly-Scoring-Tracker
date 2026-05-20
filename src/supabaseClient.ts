import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lmvgkpesjedmjbtmukqt.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LEFlf1nl9F_r2nAt8bQVBQ_j87aN7Gc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

export type Verdict = 'CLEAN' | 'SUSPICIOUS' | 'LIKELY_HACKER' | 'CONFIRMED_HACKER' | 'UNKNOWN'

export interface PlayerResult {
  uid: number
  nickname: string
  verdict: Verdict
  hacker_score: number
  flags_triggered: number | string | unknown[]
  flag_details?: unknown[]
  flags?: unknown[]
  triggered_flags?: unknown[]
  flags_list?: unknown[]
  last_login_at: string | null
}

export interface ScanResponse {
  success: boolean
  player: PlayerResult | null
  log: string[]
  errors?: string[]
}
