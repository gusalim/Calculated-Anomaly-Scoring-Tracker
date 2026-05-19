import React, { useState } from 'react'
import { supabase, ScanResponse, PlayerResult } from './supabaseClient'
import { PlayerCard } from './components/PlayerCard'
import { LogPanel } from './components/LogPanel'

type ScanState = 'idle' | 'loading' | 'success' | 'error'

const SERVERS = ['US', 'IND', 'BR', 'SAC', 'NA', 'EU', 'ME', 'SEA', 'SG']

export default function App() {
  const [uid, setUid] = useState('')
  const [server, setServer] = useState('US')
  const [state, setState] = useState<ScanState>('idle')
  const [player, setPlayer] = useState<PlayerResult | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const handleScan = async () => {
    const trimmedUid = uid.trim()
    if (!trimmedUid) return

    setState('loading')
    setPlayer(null)
    setLogs([])
    setErrors([])
    setErrorMsg('')

    try {
      const { data, error } = await supabase.functions.invoke<ScanResponse>('ingest-player', {
        body: { uid: trimmedUid, server },
      })

      if (error) {
        setState('error')
        setErrorMsg(error.message ?? 'Edge function invocation failed.')
        return
      }

      if (!data) {
        setState('error')
        setErrorMsg('No response received from the edge function.')
        return
      }

      setLogs(data.log ?? [])
      setErrors(data.errors ?? [])

      if (data.player) {
        setPlayer(data.player)
        setState('success')
      } else {
        setState('error')
        setErrorMsg('Scan completed but no player data was returned.')
      }
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan()
  }

  const handleReset = () => {
    setState('idle')
    setPlayer(null)
    setLogs([])
    setErrors([])
    setErrorMsg('')
    setUid('')
  }

  return (
    <div className="min-h-screen hex-bg flex flex-col">
      {/* Top bar */}
      <header className="border-b border-terminal-border bg-terminal-panel/80 backdrop-blur px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-terminal-accent">
            <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
            FF Anti-Cheat Scanner
          </span>
        </div>
        <div className="font-mono text-xs text-terminal-muted tracking-widest">
          v2.1.0 · ingest-player
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 gap-8 max-w-2xl mx-auto w-full">

        {/* Hero title */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-white glitch">
            Threat Scanner
          </h1>
          <p className="font-mono text-xs text-terminal-muted tracking-widest">
            ── FREE FIRE INTEGRITY ANALYSIS SYSTEM ──
          </p>
        </div>

        {/* Input panel */}
        <div className="w-full border border-terminal-border bg-terminal-panel p-6 space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-terminal-accent" />
            <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase">
              Player Identification
            </span>
          </div>

          {/* UID input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-terminal-muted tracking-widest uppercase block">
              Player UID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-terminal-accent text-sm select-none">
                ›_
              </span>
              <input
                type="text"
                value={uid}
                onChange={e => setUid(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Free Fire UID..."
                disabled={state === 'loading'}
                className="input-glow w-full bg-terminal-bg border border-terminal-border text-white font-mono text-sm pl-10 pr-4 py-3 placeholder-terminal-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Server selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-terminal-muted tracking-widest uppercase block">
              Region Server
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVERS.map(s => (
                <button
                  key={s}
                  onClick={() => setServer(s)}
                  disabled={state === 'loading'}
                  className={`
                    px-3 py-1.5 font-mono text-xs tracking-widest uppercase border transition-all duration-150 disabled:opacity-50
                    ${server === s
                      ? 'border-terminal-accent text-terminal-accent bg-terminal-accent/10'
                      : 'border-terminal-border text-terminal-muted hover:border-terminal-accent/50 hover:text-terminal-text'
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleScan}
              disabled={state === 'loading' || !uid.trim()}
              className="
                flex-1 py-3 font-display text-sm font-bold tracking-widest uppercase
                bg-terminal-accent text-terminal-bg
                hover:bg-white
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200
                relative overflow-hidden
              "
            >
              {state === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  Scanning...
                </span>
              ) : 'Initiate Scan'}
            </button>
            {state !== 'idle' && (
              <button
                onClick={handleReset}
                className="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase border border-terminal-border text-terminal-muted hover:border-terminal-accent/50 hover:text-terminal-text transition-all duration-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {state === 'error' && !player && (
          <div className="w-full border border-terminal-danger bg-terminal-danger/5 p-4 animate-fade-in">
            <div className="flex items-center gap-2 font-mono text-terminal-danger text-sm">
              <span className="text-lg">⚠</span>
              <span className="tracking-wide">{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Log panel — shown during/after loading */}
        {(state === 'loading' || logs.length > 0) && (
          <div className="w-full">
            <LogPanel logs={logs} errors={errors} isLoading={state === 'loading'} />
          </div>
        )}

        {/* Results */}
        {player && (
          <div className="w-full">
            <PlayerCard player={player} />
          </div>
        )}

        {/* Partial errors when scan succeeded but had warnings */}
        {state === 'success' && errors.length > 0 && (
          <div className="w-full border border-terminal-warn/30 bg-terminal-warn/5 p-4 animate-fade-in">
            <div className="font-mono text-xs text-terminal-warn tracking-widest uppercase mb-2">
              ⚠ Partial Errors During Scan
            </div>
            {errors.map((e, i) => (
              <div key={i} className="font-mono text-xs text-terminal-warn/70 mt-1">› {e}</div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-xs text-terminal-muted tracking-widest">
          SUPABASE EDGE · ingest-player
        </span>
        <span className="font-mono text-xs text-terminal-muted">
          lmvgkpesjedmjbtmukqt.supabase.co
        </span>
      </footer>
    </div>
  )
}
