import React from 'react'
import { PlayerResult } from '../apiClient'
import { ScoreGauge } from './ScoreGauge'

interface PlayerCardProps {
  player: PlayerResult
  copy: {
    playerProfile: string
    uid: string
    probabilityScore: string
    lastSeen: string
    notAvailable: string
    threatScore: string
    verdicts: Record<PlayerResult['verdict'], string>
  }
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
  const scoreAccent = 'rgb(var(--terminal-accent))'
  const telemetryRows = [
    JSON.stringify({ event: 'snapshot', uid: player.uid, probability: player.hacker_score.toFixed(1) }),
    JSON.stringify({ event: 'region_vector', verdict: player.verdict, source: 'cast_worker' }),
    JSON.stringify({ event: 'ledger_commit', last_seen: player.last_login_at ?? 'unavailable' }),
    JSON.stringify({ event: 'review_state', anomaly_class: player.verdict }),
  ]

  return (
    <div
      className="relative overflow-hidden animate-slide-up border border-terminal-border bg-terminal-panel p-6"
      style={{ animationDelay: '0.1s', opacity: 0 }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.055]" aria-hidden="true">
        <div className="telemetry-stream font-mono text-[10px] leading-5 text-terminal-accent">
          {[...telemetryRows, ...telemetryRows, ...telemetryRows, ...telemetryRows].map((row, index) => (
            <div key={`${row}-${index}`} className="whitespace-nowrap">
              {row}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-terminal-border pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-terminal-accent" />
            <div>
              <div className="font-mono text-xs text-terminal-muted tracking-widest uppercase">{copy.playerProfile}</div>
              <div className="font-display text-xl font-bold text-white tracking-wider">
                {player.nickname}
              </div>
            </div>
          </div>
          <div className="font-mono text-xs text-terminal-muted sm:ml-auto">
            {copy.uid}: <span className="text-terminal-accent">{player.uid}</span>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <ScoreGauge
            score={player.hacker_score}
            verdict={player.verdict}
            labels={{ threatScore: copy.threatScore, verdicts: copy.verdicts }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StatBox
            label={copy.probabilityScore}
            value={`${player.hacker_score.toFixed(1)} / 100`}
            accent={scoreAccent}
          />
          <StatBox
            label={copy.lastSeen}
            value={loginDate}
          />
        </div>
      </div>
    </div>
  )
}
