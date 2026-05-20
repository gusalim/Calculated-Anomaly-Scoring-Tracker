import React from 'react'
import { PlayerResult } from '../supabaseClient'
import { ScoreGauge } from './ScoreGauge'

interface PlayerCardProps {
  player: PlayerResult
  copy: {
    playerProfile: string
    uid: string
    hackerScore: string
    flagsTriggered: string
    lastSeen: string
    notAvailable: string
    threatScore: string
    verdicts: Record<PlayerResult['verdict'], string>
  }
}

const formatFlag = (flag: unknown): string => {
  if (typeof flag === 'string') return flag.trim()
  if (typeof flag === 'number' || typeof flag === 'boolean') return String(flag)
  if (flag && typeof flag === 'object') {
    const record = flag as Record<string, unknown>
    const preferredKeys = ['label', 'name', 'code', 'reason', 'description', 'flag']

    for (const key of preferredKeys) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
      if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    }

    try {
      return JSON.stringify(flag)
    } catch {
      return ''
    }
  }

  return ''
}

const splitFlagString = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return []
  return trimmed.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean)
}

const getFlagList = (player: PlayerResult) => {
  const sources = [
    player.flags_triggered,
    player.flag_details,
    player.flags,
    player.triggered_flags,
    player.flags_list,
  ]
  const flags = sources.flatMap(source => {
    if (Array.isArray(source)) return source
    if (typeof source === 'string') return splitFlagString(source)
    return []
  })

  return Array.from(new Set(flags.map(formatFlag).filter(Boolean)))
}

const StatBox: React.FC<{ label: string; value: React.ReactNode; accent?: string }> = ({ label, value, accent }) => (
  <div className="border border-terminal-border bg-terminal-bg p-3 flex flex-col gap-1">
    <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase">{label}</span>
    <span
      className="font-display text-lg font-bold"
      style={{ color: accent ?? 'rgb(var(--terminal-text))' }}
    >
      {value}
    </span>
  </div>
)

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, copy }) => {
  const loginDate = player.last_login_at
    ? new Date(player.last_login_at).toLocaleString()
    : copy.notAvailable
  const flags = getFlagList(player)
  const flagCount = typeof player.flags_triggered === 'number'
    ? player.flags_triggered
    : flags.length
  const scoreAccent = player.hacker_score >= 70
    ? 'rgb(var(--terminal-danger))'
    : player.hacker_score >= 40
      ? 'rgb(var(--terminal-warn))'
      : 'rgb(var(--terminal-safe))'
  const flagAccent = flagCount > 5
    ? 'rgb(var(--terminal-danger))'
    : flagCount > 2
      ? 'rgb(var(--terminal-warn))'
      : 'rgb(var(--terminal-safe))'

  return (
    <div
      className="animate-slide-up border border-terminal-border bg-terminal-panel p-6 flex flex-col gap-6"
      style={{ animationDelay: '0.1s', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-terminal-border pb-4">
        <div className="w-2 h-8 bg-terminal-accent" />
        <div>
          <div className="font-mono text-xs text-terminal-muted tracking-widest uppercase">{copy.playerProfile}</div>
          <div className="font-display text-xl font-bold text-white tracking-wider">
            {player.nickname}
          </div>
        </div>
        <div className="ml-auto font-mono text-xs text-terminal-muted">
          {copy.uid}: <span className="text-terminal-accent">{player.uid}</span>
        </div>
      </div>

      {/* Score gauge center */}
      <div className="flex justify-center py-4">
        <ScoreGauge
          score={player.hacker_score}
          verdict={player.verdict}
          labels={{ threatScore: copy.threatScore, verdicts: copy.verdicts }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatBox
          label={copy.hackerScore}
          value={`${player.hacker_score.toFixed(1)} / 100`}
          accent={scoreAccent}
        />
        <StatBox
          label={copy.flagsTriggered}
          value={flagCount}
          accent={flagAccent}
        />
        <StatBox
          label={copy.lastSeen}
          value={loginDate}
        />
      </div>

      {flags.length > 0 && (
        <div className="border border-terminal-border bg-terminal-bg p-3">
          <div className="font-mono text-xs text-terminal-muted tracking-widest uppercase">
            {copy.flagsTriggered}
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {flags.map((flag, index) => (
              <li key={`${flag}-${index}`} className="flex min-w-0 items-start gap-2 font-mono text-xs text-terminal-text">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none bg-terminal-accent" />
                <span className="min-w-0 flex-1 whitespace-normal break-words leading-relaxed">
                  {flag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
