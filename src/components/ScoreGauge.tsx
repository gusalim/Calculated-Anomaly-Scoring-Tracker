import React from 'react'
import { Verdict } from '../supabaseClient'

interface ScoreGaugeProps {
  score: number
  verdict: Verdict
}

const verdictConfig: Record<Verdict, { label: string; color: string; ringColor: string; bgGlow: string }> = {
  CLEAN: {
    label: 'CLEAN',
    color: '#00e676',
    ringColor: '#00e676',
    bgGlow: '0 0 60px #00e67620',
  },
  SUSPICIOUS: {
    label: 'SUSPICIOUS',
    color: '#ffab00',
    ringColor: '#ffab00',
    bgGlow: '0 0 60px #ffab0020',
  },
  LIKELY_HACKER: {
    label: 'LIKELY HACKER',
    color: '#ff6d00',
    ringColor: '#ff6d00',
    bgGlow: '0 0 60px #ff6d0030',
  },
  CONFIRMED_HACKER: {
    label: 'CONFIRMED HACKER',
    color: '#ff1744',
    ringColor: '#ff1744',
    bgGlow: '0 0 80px #ff174440',
  },
  UNKNOWN: {
    label: 'UNKNOWN',
    color: '#b0bec5',
    ringColor: '#37474f',
    bgGlow: 'none',
  },
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, verdict }) => {
  const config = verdictConfig[verdict] ?? verdictConfig.UNKNOWN
  const clampedScore = Math.min(100, Math.max(0, score))
  const circumference = 2 * Math.PI * 45 // r=45
  const dashOffset = circumference - (clampedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48" style={{ filter: `drop-shadow(${config.bgGlow})` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#1a2332"
            strokeWidth="6"
          />
          {/* Score ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={config.ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {/* Tick marks */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360
            const rad = (angle * Math.PI) / 180
            const x1 = 50 + 42 * Math.cos(rad)
            const y1 = 50 + 42 * Math.sin(rad)
            const x2 = 50 + 38 * Math.cos(rad)
            const y2 = 50 + 38 * Math.sin(rad)
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#1a2332"
                strokeWidth="1"
              />
            )
          })}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-4xl font-black"
            style={{ color: config.color }}
          >
            {clampedScore.toFixed(0)}
          </span>
          <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase mt-1">
            THREAT SCORE
          </span>
        </div>
      </div>

      {/* Verdict badge */}
      <div
        className="px-6 py-2 border font-display text-sm font-bold tracking-widest uppercase"
        style={{
          borderColor: config.color,
          color: config.color,
          boxShadow: `0 0 20px ${config.color}30, inset 0 0 20px ${config.color}10`,
        }}
      >
        {config.label}
      </div>
    </div>
  )
}
