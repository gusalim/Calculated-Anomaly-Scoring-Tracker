import React, { useEffect, useState } from 'react'
import { scanPlayer, PlayerResult } from './apiClient'
import { PlayerCard } from './components/PlayerCard'

type ScanState = 'idle' | 'loading' | 'success' | 'error'
type ThemeId = 'terminal' | 'green' | 'silver' | 'blue' | 'purple'
type Language = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it'

const SERVERS = ['US', 'IND', 'BR', 'SAC', 'NA', 'EU', 'ME', 'SEA', 'SG']
const THEMES: ThemeId[] = ['terminal', 'green', 'silver', 'blue', 'purple']
const LANGUAGES: Array<{ id: Language; label: string }> = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'it', label: 'Italiano' },
]

type Translation = {
  appName: string
  themeLabel: string
  languageLabel: string
  scannerTitle: string
  subtitle: string
  playerIdentification: string
  playerUid: string
  uidPlaceholder: string
  regionServer: string
  initiateScan: string
  scanning: string
  requestFailed: string
  noResponse: string
  noPlayer: string
  unexpected: string
  partialErrorsTitle: string
  themes: Record<ThemeId, string>
  playerCard: {
    playerProfile: string
    uid: string
    hackerScore: string
    lastSeen: string
    notAvailable: string
    threatScore: string
    verdicts: Record<PlayerResult['verdict'], string>
  }
}

const translations: Record<Language, Translation> = {
  es: {
    appName: 'Escáner Anti-Hacks Free Fire',
    themeLabel: 'Tema',
    languageLabel: 'Idioma',
    scannerTitle: 'Escáner de Amenazas',
    subtitle: '── RASTREADOR DE PUNTUACIÓN DE ANOMALÍAS CALCULADAS DE FREE FIRE ──',
    playerIdentification: 'Identificación del jugador',
    playerUid: 'UID del jugador',
    uidPlaceholder: 'Ingresa UID de Free Fire...',
    regionServer: 'Servidor regional',
    initiateScan: 'Iniciar escaneo',
    scanning: 'Escaneando...',
    requestFailed: 'La solicitud falló.',
    noResponse: 'No se recibió respuesta de la solicitud.',
    noPlayer: 'El escaneo terminó, pero no devolvió datos del jugador.',
    unexpected: 'Ocurrió un error inesperado.',
    partialErrorsTitle: 'Errores parciales durante el escaneo',
    themes: {
      terminal: 'Actual',
      green: 'Verde',
      silver: 'Gris plata',
      blue: 'Azul',
      purple: 'Púrpura',
    },
    playerCard: {
      playerProfile: 'Perfil del jugador',
      uid: 'UID',
      hackerScore: 'Puntuación hacker',
      lastSeen: 'Última conexión',
      notAvailable: 'N/D',
      threatScore: 'Puntuación de riesgo',
      verdicts: {
        CLEAN: 'LIMPIO',
        SUSPICIOUS: 'SOSPECHOSO',
        LIKELY_HACKER: 'PROBABLE HACKER',
        CONFIRMED_HACKER: 'HACKER CONFIRMADO',
        UNKNOWN: 'DESCONOCIDO',
      },
    },
  },
  en: {
    appName: 'Free Fire Hacker Scanner',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    scannerTitle: 'Threat Scanner',
    subtitle: '── FREE FIRE CALCULATED ANOMALY SCORING TRACKER ──',
    playerIdentification: 'Player Identification',
    playerUid: 'Player UID',
    uidPlaceholder: 'Enter Free Fire UID...',
    regionServer: 'Region Server',
    initiateScan: 'Initiate Scan',
    scanning: 'Scanning...',
    requestFailed: 'Request failed.',
    noResponse: 'No response received from the request.',
    noPlayer: 'Scan completed but no player data was returned.',
    unexpected: 'An unexpected error occurred.',
    partialErrorsTitle: 'Partial Errors During Scan',
    themes: {
      terminal: 'Current',
      green: 'Green',
      silver: 'Silver gray',
      blue: 'Blue',
      purple: 'Purple',
    },
    playerCard: {
      playerProfile: 'Player Profile',
      uid: 'UID',
      hackerScore: 'Hacker Score',
      lastSeen: 'Last Seen',
      notAvailable: 'N/A',
      threatScore: 'Threat Score',
      verdicts: {
        CLEAN: 'CLEAN',
        SUSPICIOUS: 'SUSPICIOUS',
        LIKELY_HACKER: 'LIKELY HACKER',
        CONFIRMED_HACKER: 'CONFIRMED HACKER',
        UNKNOWN: 'UNKNOWN',
      },
    },
  },
  pt: {
    appName: 'Scanner Anti-Hacks Free Fire',
    themeLabel: 'Tema',
    languageLabel: 'Idioma',
    scannerTitle: 'Scanner de Ameaças',
    subtitle: '── RASTREADOR DE PONTUAÇÃO DE ANOMALIAS CALCULADAS DE FREE FIRE ──',
    playerIdentification: 'Identificação do jogador',
    playerUid: 'UID do jogador',
    uidPlaceholder: 'Digite o UID do Free Fire...',
    regionServer: 'Servidor regional',
    initiateScan: 'Iniciar scanner',
    scanning: 'Escaneando...',
    requestFailed: 'A solicitação falhou.',
    noResponse: 'Nenhuma resposta foi recebida da solicitação.',
    noPlayer: 'O scanner terminou, mas não retornou dados do jogador.',
    unexpected: 'Ocorreu um erro inesperado.',
    partialErrorsTitle: 'Erros parciais durante o scanner',
    themes: {
      terminal: 'Atual',
      green: 'Verde',
      silver: 'Cinza prata',
      blue: 'Azul',
      purple: 'Roxo',
    },
    playerCard: {
      playerProfile: 'Perfil do jogador',
      uid: 'UID',
      hackerScore: 'Pontuação hacker',
      lastSeen: 'Visto por último',
      notAvailable: 'N/D',
      threatScore: 'Pontuação de risco',
      verdicts: {
        CLEAN: 'LIMPO',
        SUSPICIOUS: 'SUSPEITO',
        LIKELY_HACKER: 'PROVÁVEL HACKER',
        CONFIRMED_HACKER: 'HACKER CONFIRMADO',
        UNKNOWN: 'DESCONHECIDO',
      },
    },
  },
  fr: {
    appName: 'Scanner Anti-Hack Free Fire',
    themeLabel: 'Thème',
    languageLabel: 'Langue',
    scannerTitle: 'Scanner de Menaces',
    subtitle: '── SUIVI DU SCORE D’ANOMALIES CALCULÉES FREE FIRE ──',
    playerIdentification: 'Identification du joueur',
    playerUid: 'UID du joueur',
    uidPlaceholder: 'Entrez l’UID Free Fire...',
    regionServer: 'Serveur régional',
    initiateScan: 'Lancer le scan',
    scanning: 'Analyse...',
    requestFailed: 'La requête a échoué.',
    noResponse: 'Aucune réponse reçue pour la requête.',
    noPlayer: 'Le scan est terminé, mais aucune donnée joueur n’a été retournée.',
    unexpected: 'Une erreur inattendue est survenue.',
    partialErrorsTitle: 'Erreurs partielles pendant le scan',
    themes: {
      terminal: 'Actuel',
      green: 'Vert',
      silver: 'Gris argent',
      blue: 'Bleu',
      purple: 'Violet',
    },
    playerCard: {
      playerProfile: 'Profil du joueur',
      uid: 'UID',
      hackerScore: 'Score hacker',
      lastSeen: 'Dernière activité',
      notAvailable: 'N/D',
      threatScore: 'Score de risque',
      verdicts: {
        CLEAN: 'PROPRE',
        SUSPICIOUS: 'SUSPECT',
        LIKELY_HACKER: 'HACKER PROBABLE',
        CONFIRMED_HACKER: 'HACKER CONFIRMÉ',
        UNKNOWN: 'INCONNU',
      },
    },
  },
  de: {
    appName: 'Free Fire Anti-Hack Scanner',
    themeLabel: 'Theme',
    languageLabel: 'Sprache',
    scannerTitle: 'Bedrohungs-Scanner',
    subtitle: '── FREE FIRE TRACKER FÜR BERECHNETE ANOMALIEBEWERTUNG ──',
    playerIdentification: 'Spieleridentifikation',
    playerUid: 'Spieler-UID',
    uidPlaceholder: 'Free Fire UID eingeben...',
    regionServer: 'Regionaler Server',
    initiateScan: 'Scan starten',
    scanning: 'Scannen...',
    requestFailed: 'Anfrage fehlgeschlagen.',
    noResponse: 'Keine Antwort von der Anfrage erhalten.',
    noPlayer: 'Scan abgeschlossen, aber keine Spielerdaten zurückgegeben.',
    unexpected: 'Ein unerwarteter Fehler ist aufgetreten.',
    partialErrorsTitle: 'Teilweise Fehler während des Scans',
    themes: {
      terminal: 'Aktuell',
      green: 'Grün',
      silver: 'Silbergrau',
      blue: 'Blau',
      purple: 'Lila',
    },
    playerCard: {
      playerProfile: 'Spielerprofil',
      uid: 'UID',
      hackerScore: 'Hacker-Score',
      lastSeen: 'Zuletzt gesehen',
      notAvailable: 'N/V',
      threatScore: 'Risikowert',
      verdicts: {
        CLEAN: 'SAUBER',
        SUSPICIOUS: 'VERDÄCHTIG',
        LIKELY_HACKER: 'WAHRSCHEINLICHER HACKER',
        CONFIRMED_HACKER: 'BESTÄTIGTER HACKER',
        UNKNOWN: 'UNBEKANNT',
      },
    },
  },
  it: {
    appName: 'Scanner Anti-Hack Free Fire',
    themeLabel: 'Tema',
    languageLabel: 'Lingua',
    scannerTitle: 'Scanner Minacce',
    subtitle: '── TRACKER DEL PUNTEGGIO ANOMALIE CALCOLATE DI FREE FIRE ──',
    playerIdentification: 'Identificazione giocatore',
    playerUid: 'UID giocatore',
    uidPlaceholder: 'Inserisci UID Free Fire...',
    regionServer: 'Server regionale',
    initiateScan: 'Avvia scansione',
    scanning: 'Scansione...',
    requestFailed: 'Richiesta non riuscita.',
    noResponse: 'Nessuna risposta ricevuta dalla richiesta.',
    noPlayer: 'Scansione completata, ma non sono stati restituiti dati giocatore.',
    unexpected: 'Si è verificato un errore imprevisto.',
    partialErrorsTitle: 'Errori parziali durante la scansione',
    themes: {
      terminal: 'Attuale',
      green: 'Verde',
      silver: 'Grigio argento',
      blue: 'Blu',
      purple: 'Viola',
    },
    playerCard: {
      playerProfile: 'Profilo giocatore',
      uid: 'UID',
      hackerScore: 'Punteggio hacker',
      lastSeen: 'Ultimo accesso',
      notAvailable: 'N/D',
      threatScore: 'Punteggio rischio',
      verdicts: {
        CLEAN: 'PULITO',
        SUSPICIOUS: 'SOSPETTO',
        LIKELY_HACKER: 'PROBABILE HACKER',
        CONFIRMED_HACKER: 'HACKER CONFERMATO',
        UNKNOWN: 'SCONOSCIUTO',
      },
    },
  },
}

export default function App() {
  const [uid, setUid] = useState('')
  const [server, setServer] = useState('US')
  const [theme, setTheme] = useState<ThemeId>('terminal')
  const [language, setLanguage] = useState<Language>('es')
  const [state, setState] = useState<ScanState>('idle')
  const [player, setPlayer] = useState<PlayerResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const t = translations[language]
  const isUidValid = uid.trim().length >= 8 && uid.trim().length <= 12

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language
  }, [language, theme])

  const handleScan = async () => {
    const trimmedUid = uid.trim()
    if (state === 'loading') return
    if (!trimmedUid) return
    if (trimmedUid.length < 8 || trimmedUid.length > 12) return

    setUid('')
    setState('loading')
    setPlayer(null)
    setErrors([])
    setErrorMsg('')

    try {
      const data = await scanPlayer(trimmedUid, server)

      if (!data) {
        setState('error')
        setErrorMsg(t.noResponse)
        return
      }

      setErrors(data.errors ?? [])

      if (!data.success) {
        setState('error')
        setErrorMsg(data.error ?? data.message ?? t.requestFailed)
      } else if (data.player) {
        setPlayer(data.player)
        setState('success')
      } else {
        setState('error')
        setErrorMsg(t.noPlayer)
      }
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : t.unexpected)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan()
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeId)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
  }

  return (
    <div className="min-h-screen hex-bg flex flex-col">
      {/* Top bar */}
      <header className="border-b border-terminal-border bg-terminal-panel/80 backdrop-blur px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-terminal-accent flex-none">
            <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
            {t.appName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-terminal-muted tracking-widest uppercase">
              {t.themeLabel}
            </span>
            <select
              value={theme}
              onChange={handleThemeChange}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:border-terminal-accent"
              aria-label={t.themeLabel}
            >
              {THEMES.map(themeId => (
                <option key={themeId} value={themeId}>
                  {t.themes[themeId]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-terminal-muted tracking-widest uppercase">
              {t.languageLabel}
            </span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:border-terminal-accent"
              aria-label={t.languageLabel}
            >
              {LANGUAGES.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="font-mono text-xs text-terminal-muted tracking-widest">
            CAST · v1.0.0
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 gap-8 max-w-2xl mx-auto w-full">

        {/* Hero title */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-white glitch">
            {t.scannerTitle}
          </h1>
          <p className="font-mono text-xs text-terminal-muted tracking-widest">
            {t.subtitle}
          </p>
        </div>

        {/* Results */}
        {player && (
          <div className="w-full">
            <PlayerCard player={player} copy={t.playerCard} />
          </div>
        )}

        {/* Input panel */}
        <div className="w-full border border-terminal-border bg-terminal-panel p-6 space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-terminal-accent" />
            <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase">
              {t.playerIdentification}
            </span>
          </div>

          {/* UID input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-terminal-muted tracking-widest uppercase block">
              {t.playerUid}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-terminal-accent text-sm select-none">
                ›_
              </span>
              <input
                type="text"
                value={uid}
                onChange={e => setUid(e.target.value.replace(/\D/g, ''))}
                onKeyDown={handleKeyDown}
                placeholder={t.uidPlaceholder}
                maxLength={12}
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
              {t.regionServer}
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

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleScan}
              disabled={state === 'loading' || !isUidValid}
              className="
                w-full py-3 font-display text-sm font-bold tracking-widest uppercase
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
                  {t.scanning}
                </span>
              ) : t.initiateScan}
            </button>
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

        {/* Partial errors when scan succeeded but had warnings */}
        {state === 'success' && errors.length > 0 && (
          <div className="w-full border border-terminal-warn/30 bg-terminal-warn/5 p-4 animate-fade-in">
            <div className="font-mono text-xs text-terminal-warn tracking-widest uppercase mb-2">
              ⚠ {t.partialErrorsTitle}
            </div>
            {errors.map((e, i) => (
              <div key={i} className="font-mono text-xs text-terminal-warn/70 mt-1">› {e}</div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-xs text-terminal-muted tracking-widest">
          (c) 2026 Gustavo Slzar · tavo.slzr@hotmail.com
        </span>
        <span className="font-mono text-xs text-terminal-muted">
          calculated-anomaly-scoring-tracker.pages.dev
        </span>
      </footer>
    </div>
  )
}
