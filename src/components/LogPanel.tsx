import React, { useEffect, useRef } from 'react'

interface LogPanelProps {
  logs: string[]
  errors?: string[]
  isLoading: boolean
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs, errors = [], isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs, errors])

  return (
    <div
      className="border border-terminal-border bg-terminal-bg font-mono text-xs animate-fade-in"
      style={{ animationDelay: '0.2s', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border bg-terminal-panel">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-danger" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-warn" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-safe" />
        </div>
        <span className="text-terminal-muted tracking-widest uppercase ml-2">
          Scan Log — Calculated Anomaly Scoring Tracker
        </span>
        {isLoading && (
          <span className="ml-auto text-terminal-accent animate-pulse tracking-widest">
            ● RUNNING
          </span>
        )}
      </div>

      {/* Log content */}
      <div className="p-4 h-48 overflow-y-auto space-y-1">
        {logs.map((line, i) => (
          <div key={i} className="flex gap-2 text-terminal-text">
            <span className="text-terminal-muted select-none">[{String(i + 1).padStart(2, '0')}]</span>
            <span className="text-terminal-accent">›</span>
            <span>{line}</span>
          </div>
        ))}
        {errors.map((err, i) => (
          <div key={`err-${i}`} className="flex gap-2 text-terminal-danger">
            <span className="text-terminal-danger select-none">[ERR]</span>
            <span className="text-terminal-danger">!</span>
            <span>{err}</span>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 text-terminal-accent">
            <span className="text-terminal-muted select-none">[  ]</span>
            <span>›</span>
            <span className="cursor">Processing</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
