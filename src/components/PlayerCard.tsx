import React from 'react'
import { PlayerResult } from '../supabaseClient'
import { ScoreGauge } from './ScoreGauge'

interface PlayerCardProps {
  player: PlayerResult
}

const StatBox: React.FC<{ label: string; value: string | number; accent?: string }> = ({ label, value, accent }) => (
  <div className="border border-terminal-border bg-terminal-bg p-3 flex flex-col gap-1">
    <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase">{label}</span>
    <span
      className="font-display text-lg font-bold"
      style={{ color: accent ?? '#b0bec5' }}
    >
      {value}
    </span>
  </div>
)

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const loginDate = player.last_login_at
    ? new Date(player.last_login_at).toLocaleString()
    : 'N/A'

  return (
    <div
      className="animate-slide-up border border-terminal-border bg-terminal-panel p-6 flex flex-col gap-6"
      style={{ animationDelay: '0.1s', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-terminal-border pb-4">
        <div className="w-2 h-8 bg-terminal-accent" />
        <div>
          <div className="font-mono text-xs text-terminal-muted tracking-widest uppercase">Player Profile</div>
          <div className="font-display text-xl font-bold text-white tracking-wider">
            {player.nickname}
          </div>
        </div>
        <div className="ml-auto font-mono text-xs text-terminal-muted">
          UID: <span className="text-terminal-accent">{player.uid}</span>
        </div>
      </div>

      {/* Score gauge center */}
      <div className="flex justify-center py-4">
        <ScoreGauge score={player.hacker_score} verdict={player.verdict} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatBox
          label="Hacker Score"
          value={`${player.hacker_score.toFixed(1)} / 100`}
          accent={
            player.hacker_score >= 70 ? '#ff1744'
              : player.hacker_score >= 40 ? '#ffab00'
              : '#00e676'
          }
        />
        <StatBox
          label="Flags Triggered"
          value={player.flags_triggered}
          accent={player.flags_triggered > 5 ? '#ff1744' : player.flags_triggered > 2 ? '#ffab00' : '#00e676'}
        />
        <StatBox
          label="Last Seen"
          value={loginDate}
        />
      </div>
    </div>
  )
}
