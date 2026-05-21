import React from 'react'
import { PlayerResult } from '../apiClient'
import { ScoreGauge } from './ScoreGauge'

interface PlayerCardProps {
  player: PlayerResult
  copy: {
    playerProfile: string
    uid: string
    hackerScore: string
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
  const scoreAccent = player.hacker_score >= 70
    ? 'rgb(var(--terminal-danger))'
    : player.hacker_score >= 40
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <StatBox
          label={copy.hackerScore}
          value={`${player.hacker_score.toFixed(1)} / 100`}
          accent={scoreAccent}
        />
        <StatBox
          label={copy.lastSeen}
          value={loginDate}
        />
      </div>
    </div>
  )
}
