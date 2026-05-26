const WORKER_URL = 'https://supabase-api-call.gustavosalazarlima.workers.dev/'

export type Verdict = 'CLEAN' | 'LEGIT' | 'POSSIBLY_SUSPICIOUS' | 'SUSPICIOUS' | 'LIKELY_HACKER' | 'CONFIRMED_HACKER' | 'UNKNOWN'

export interface PlayerResult {
  uid: number
  nickname: string
  verdict: Verdict
  hacker_score: number
  last_login_at: string | null
}

export interface ScanResponse {
  success: boolean
  player: PlayerResult | null
  error?: string
  message?: string
  errors?: string[]
}

export const scanPlayer = async (uid: string, region = 'US'): Promise<ScanResponse> => {
  const body = region === 'US' ? { uid } : { uid, region }

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let payload: Partial<ScanResponse> | null = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.error ?? payload?.message ?? `Request failed with status ${response.status}.`
    throw new Error(message)
  }

  if (!payload) {
    throw new Error('No response received from the request.')
  }

  return {
    success: Boolean(payload.success),
    player: payload.player ?? null,
    error: payload.error,
    message: payload.message,
    errors: payload.errors ?? [],
  }
}
