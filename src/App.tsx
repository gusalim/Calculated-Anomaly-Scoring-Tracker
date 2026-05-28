import React, { useEffect, useState } from 'react'
import { scanPlayer, PlayerResult } from './apiClient'
import { PlayerCard } from './components/PlayerCard'
import locales from './locales.json'

type ScanState = 'idle' | 'loading' | 'success' | 'error'
type ThemeId = 'green' | 'terminal' | 'obsidian' | 'silver' | 'blue' | 'purple'
type PageId = 'scanner' | 'about' | 'methodology' | 'privacy' | 'terms' | 'contact'
type InfoPageId = Exclude<PageId, 'scanner'>
type Language = keyof typeof locales
type Translation = typeof locales.en
type AnomalyState = 'idle' | 'nominal' | 'drift' | 'anomaly'

const translations = locales as Record<Language, Translation>
const CONTACT_EMAIL = 'tavo.slzr@hotmail.com'
const SITE_NAME = 'NAHUAL'
const LAST_UPDATED = 'May 28, 2026'

const REGIONS = ['US', 'IND', 'BR', 'SAC', 'NA', 'EU', 'ME', 'SEA', 'SG']
const THEMES: ThemeId[] = ['green', 'terminal', 'obsidian', 'silver', 'blue', 'purple']
const LANGUAGES: Array<{ id: Language; label: string }> = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
]

const NAV_ITEMS: Array<{ id: PageId; path: string }> = [
  { id: 'scanner', path: '/' },
  { id: 'about', path: '/about' },
  { id: 'methodology', path: '/methodology' },
  { id: 'privacy', path: '/privacy' },
  { id: 'terms', path: '/terms' },
  { id: 'contact', path: '/contact' },
]

const ROUTE_TO_PAGE: Record<string, PageId> = NAV_ITEMS.reduce<Record<string, PageId>>((acc, item) => {
  acc[item.path] = item.id
  return acc
}, {})

const PAGE_DESCRIPTIONS: Record<Language, Record<PageId, string>> = {
  es: {
    scanner: 'NAHUAL ofrece telemetría anti-cheat, análisis de anomalías y revisión de UID para Free Fire con estados de severidad claros.',
    about: 'Conoce la marca NAHUAL, su inspiración cultural y su propósito como sistema de telemetría anti-cheat.',
    methodology: 'Revisa los rangos de severidad, límites del análisis y criterios de seguridad del sistema NAHUAL.',
    privacy: 'Consulta cómo NAHUAL procesa UID, región, servicios externos, publicidad, cookies y solicitudes de contacto.',
    terms: 'Lee los términos de uso de NAHUAL, sus límites, reglas de uso aceptable y avisos sobre servicios externos.',
    contact: 'Contacta al operador de NAHUAL para soporte, privacidad, correcciones, cumplimiento o divulgación responsable.',
  },
  en: {
    scanner: 'NAHUAL provides anti-cheat telemetry, anomaly analysis, and Free Fire UID review with clear severity states.',
    about: 'Learn about the NAHUAL brand, its cultural inspiration, and its role as an anti-cheat telemetry system.',
    methodology: 'Review NAHUAL severity bands, analysis limits, and safety criteria.',
    privacy: 'Read how NAHUAL processes UIDs, regions, third-party services, advertising, cookies, and contact requests.',
    terms: 'Read NAHUAL terms of use, limits, acceptable-use rules, and third-party service notices.',
    contact: 'Contact the NAHUAL operator for support, privacy, corrections, compliance, or responsible disclosure.',
  },
}

type InfoSection = {
  heading: string
  body: string[]
}

type InfoPageContent = {
  eyebrow: string
  title: string
  intro: string
  sections: InfoSection[]
}

const INFO_PAGES: Record<Language, Record<InfoPageId, InfoPageContent>> = {
  es: {
    about: {
      eyebrow: 'Visión del proyecto',
      title: 'Acerca de NAHUAL',
      intro:
        'NAHUAL es una interfaz de telemetría y análisis de anomalías para revisión anti-cheat. Su identidad combina el nahual de la mitología mesoamericana y mexicana, figura de transformación y vigilancia, con una estética de ciberseguridad, ciencia de datos y operación táctica.',
      sections: [
        {
          heading: 'Propósito',
          body: [
            'El sitio funciona como una consola ligera para revisar un UID de Free Fire contra señales de telemetría procesadas por el backend. Los resultados se presentan como estados de probabilidad, no como acusaciones personales ni decisiones oficiales de sanción.',
            'La marca busca sentirse distintiva y agresiva a nivel visual, pero el producto mantiene límites claros: telemetría, análisis, severidad y prevención de abuso.',
          ],
        },
        {
          heading: 'Arquitectura bilingüe',
          body: [
            'NAHUAL usa español como idioma principal y ofrece una versión completa en inglés para navegación, escáner, avisos, páginas de cumplimiento y contenido explicativo.',
            'La estructura de traducciones permite mantener la misma intención de marca y el mismo nivel de claridad en ambos idiomas.',
          ],
        },
        {
          heading: 'Independencia',
          body: [
            'NAHUAL es un proyecto independiente. No está afiliado, patrocinado, respaldado ni operado por Garena, Sea Limited, Google, Vercel, Cloudflare o cualquier publicador de juegos.',
            'Las referencias a Free Fire se usan solo para identificar el contexto del análisis de telemetría.',
          ],
        },
        {
          heading: 'Límite de seguridad',
          body: [
            'Este sitio no proporciona instrucciones, herramientas, descargas, código fuente ni servicios para hacer trampas, evadir sistemas anti-cheat, acceder sin autorización o modificar clientes de juego.',
            'Los visitantes no deben usar resultados para acosar, amenazar, exponer o atacar a otra persona. Una anomalía alta indica una señal de revisión; no reemplaza la moderación oficial.',
          ],
        },
      ],
    },
    methodology: {
      eyebrow: 'Notas de transparencia',
      title: 'Metodología y severidad',
      intro:
        'La interfaz trata el puntaje del backend como una probabilidad de anomalía de 0 a 100. El entorno visual reacciona por severidad para que el estado se lea rápido sin ocultar los límites del análisis.',
      sections: [
        {
          heading: 'Tematización por severidad',
          body: [
            '0 a 64.9 se muestra como Parámetros Nominales. El sistema usa una señal fría de telemetría para comunicar que la instantánea no cruzó el umbral de deriva.',
            '65.0 a 89.9 se muestra como Revisión de Desviación. El color cambia a ámbar para indicar prioridad elevada sin tratar el resultado como prueba definitiva.',
            '90.0 a 100 se muestra como Anomalía Estadística. El entorno cambia a rojo y oscurece los paneles para resaltar una anomalía de alta probabilidad.',
          ],
        },
        {
          heading: 'Entradas y salidas',
          body: [
            'El visitante introduce un UID numérico y una región. El navegador envía esos campos a un worker de backend, que devuelve apodo, UID, puntaje, último evento y estado de veredicto cuando están disponibles.',
            'La interfaz pública no expone fuentes privadas de telemetría. Muestra un resultado compacto para que el visitante pueda interpretar el estado sin acceso al backend.',
          ],
        },
        {
          heading: 'Limitaciones',
          body: [
            'El puntaje puede estar incompleto, retrasado o afectado por disponibilidad de datos externos. Algunos UID, regiones o condiciones temporales pueden no devolver resultados.',
            'Los puntajes son ayudas de revisión. No deben usarse como única base para acusaciones públicas, sanciones o decisiones personales sobre otro jugador.',
          ],
        },
      ],
    },
    privacy: {
      eyebrow: `Última actualización: ${LAST_UPDATED}`,
      title: 'Política de Privacidad',
      intro:
        'Esta Política de Privacidad explica qué información procesa NAHUAL cuando usas el escáner, contactas al operador o visitas páginas que podrían incluir publicidad o analítica.',
      sections: [
        {
          heading: 'Información procesada por el escáner',
          body: [
            'Cuando ejecutas un análisis, el sitio envía el UID numérico y la región seleccionada al worker de backend. La respuesta puede incluir apodo, UID, puntaje, veredicto, último evento y mensajes del servicio.',
            'La aplicación actual no requiere cuenta, contraseña, tarjeta de pago ni registro de perfil para usar el escáner.',
          ],
        },
        {
          heading: 'Información de contacto',
          body: [
            `Si contactas al operador en ${CONTACT_EMAIL}, tu correo y el contenido del mensaje se usan para responder solicitudes, investigar problemas, revisar políticas o atender temas de privacidad y seguridad.`,
            'No envíes información personal sensible, contraseñas, credenciales privadas de juego, documentos oficiales ni datos de pago por correo.',
          ],
        },
        {
          heading: 'Publicidad y cookies',
          body: [
            'Si se habilita Google AdSense u otro proveedor de publicidad, terceros, incluido Google, pueden usar cookies para mostrar anuncios basados en visitas previas a este sitio u otros sitios web.',
            'Google y sus socios pueden usar cookies publicitarias, balizas web, direcciones IP y otros identificadores para servir anuncios, medir rendimiento, prevenir fraude y personalizar anuncios cuando la ley y el consentimiento lo permitan.',
            'Puedes gestionar anuncios personalizados en https://myadcenter.google.com/ y revisar cómo Google usa datos de sitios asociados en https://policies.google.com/technologies/partner-sites.',
          ],
        },
        {
          heading: 'Consentimiento y derechos regionales',
          body: [
            'Si se habilitan anuncios o analítica en regiones que requieren consentimiento, el sitio debe usar un flujo de gestión de consentimiento antes de activar publicidad personalizada o rastreo comparable.',
            'Según tu ubicación, puedes tener derechos de acceso, corrección, eliminación, restricción u oposición sobre cierta información personal. Contacta al operador para iniciar una solicitud.',
          ],
        },
      ],
    },
    terms: {
      eyebrow: `Última actualización: ${LAST_UPDATED}`,
      title: 'Términos de Uso',
      intro:
        'Estos Términos regulan el acceso a NAHUAL. Al usar el sitio, aceptas usarlo de forma responsable, respetar derechos de terceros y comprender los límites del análisis de anomalías.',
      sections: [
        {
          heading: 'Uso aceptable',
          body: [
            'Puedes usar el escáner para revisión de juego limpio, análisis educativo e interpretación personal de telemetría. No puedes usarlo para acosar, amenazar, avergonzar, suplantar, exponer datos personales o atacar a otra persona.',
            'No puedes intentar sobrecargar el servicio, extraerlo a volumen abusivo, evadir límites, sondear infraestructura privada, interferir con el worker de backend o enviar solicitudes automatizadas abusivas.',
          ],
        },
        {
          heading: 'Sin trampas ni acceso no autorizado',
          body: [
            'NAHUAL no autoriza trampas, acceso no autorizado, compromiso de cuentas, modificación de clientes, ingeniería inversa de servicios de juego ni evasión de sistemas anti-cheat.',
            'No uses el sitio para solicitar o distribuir instrucciones, archivos, exploits o servicios que permitan juego deshonesto o acceso no autorizado.',
          ],
        },
        {
          heading: 'Aviso sobre resultados',
          body: [
            'Los puntajes, veredictos y marcas de tiempo se ofrecen solo para revisión informativa. Pueden ser inexactos, no estar disponibles, retrasarse o estar incompletos por depender de datos externos y disponibilidad del backend.',
            'NAHUAL no es un canal oficial de sanción y no puede banear, limpiar, restaurar ni disciplinar cuentas de juego.',
          ],
        },
        {
          heading: 'Servicios externos',
          body: [
            'El sitio puede depender de hosting, workers de backend, fuentes, proveedores publicitarios y otros servicios externos. Esos servicios pueden tener sus propios términos, prácticas de privacidad, límites de disponibilidad y controles de seguridad.',
            'Si se habilita publicidad, los anuncios deben mantenerse claramente separados de navegación, controles y acciones del escáner.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'Contacto del operador',
      title: 'Contacto',
      intro:
        'Usa este canal para soporte, solicitudes de privacidad, correcciones, preguntas de cumplimiento, divulgación responsable y consultas sobre publicidad o monetización.',
      sections: [
        {
          heading: 'Correo',
          body: [
            `Contacto principal: ${CONTACT_EMAIL}. Incluye la URL de la página, UID solo si es relevante, región seleccionada, hora aproximada, navegador y una descripción breve del problema.`,
            'Para solicitudes de privacidad, describe la solicitud claramente y usa el mismo correo para seguimiento. El operador puede pedir información limitada para verificar y procesar la solicitud.',
          ],
        },
        {
          heading: 'Divulgación responsable',
          body: [
            'Si crees haber encontrado un problema de seguridad, repórtalo de forma privada antes de compartir detalles públicamente. No accedas, alteres, destruyas ni extraigas datos que no te pertenecen.',
          ],
        },
        {
          heading: 'Contenido y políticas',
          body: [
            'Envía inquietudes sobre resultados engañosos, cumplimiento, ubicación de anuncios, privacidad o contenido potencialmente inseguro al correo de contacto para revisión.',
          ],
        },
      ],
    },
  },
  en: {
    about: {
      eyebrow: 'Project overview',
      title: 'About NAHUAL',
      intro:
        'NAHUAL is an anti-cheat telemetry and anomaly analysis interface. Its identity merges the Nahual from Mesoamerican and Mexican mythology, a figure of transformation and watchfulness, with a cybersecurity, data-science, and tactical operations aesthetic.',
      sections: [
        {
          heading: 'Purpose',
          body: [
            'The site works as a lightweight console for reviewing a Free Fire UID against backend telemetry signals. Results are presented as probability states, not as personal accusations or official enforcement decisions.',
            'The brand is intentionally distinctive and hard-edged visually, while the product boundaries stay clear: telemetry, analysis, severity, and abuse prevention.',
          ],
        },
        {
          heading: 'Bilingual architecture',
          body: [
            'NAHUAL uses Spanish as the primary language and provides a complete English version for navigation, scanner copy, notices, compliance pages, and explanatory content.',
            'The translation structure keeps the same brand intent and the same level of clarity across both languages.',
          ],
        },
        {
          heading: 'Independence',
          body: [
            'NAHUAL is an independent project. It is not affiliated with, sponsored by, endorsed by, or operated by Garena, Sea Limited, Google, Vercel, Cloudflare, or any game publisher.',
            'Free Fire references are used only to identify the telemetry review context.',
          ],
        },
        {
          heading: 'Safety boundary',
          body: [
            'This site does not provide instructions, tools, downloads, source code, or services for cheating, bypassing anti-cheat systems, gaining unauthorized access, or modifying game clients.',
            'Visitors should not use results to harass, threaten, expose, or target another person. A high anomaly score means a review signal exists; it does not replace official moderation.',
          ],
        },
      ],
    },
    methodology: {
      eyebrow: 'Transparency notes',
      title: 'Methodology and Severity',
      intro:
        'The interface treats the backend score as an anomaly probability from 0 to 100. The visual environment reacts by severity so the state is easy to read without hiding the limits of the analysis.',
      sections: [
        {
          heading: 'Severity-based theming',
          body: [
            '0 to 64.9 is shown as Nominal Parameters. The system uses a cool telemetry signal to communicate that the snapshot did not cross the drift threshold.',
            '65.0 to 89.9 is shown as Drift Review. The color shifts to amber to show elevated priority without treating the result as final proof.',
            '90.0 to 100 is shown as Statistical Anomaly. The environment shifts to red and darkens panels to highlight a high-probability anomaly.',
          ],
        },
        {
          heading: 'Inputs and outputs',
          body: [
            'Visitors enter a numeric UID and region. The browser sends those fields to a backend worker, which returns nickname, UID, score, last event, and verdict state when available.',
            'The public interface does not expose private raw telemetry sources. It displays a compact result so visitors can interpret the state without backend access.',
          ],
        },
        {
          heading: 'Limitations',
          body: [
            'Anomaly scoring can be incomplete, delayed, or affected by upstream data availability. Some UIDs, regions, or temporary backend conditions may not return results.',
            'Scores are review aids. They should not be used as the sole basis for public accusations, penalties, or personal decisions about another player.',
          ],
        },
      ],
    },
    privacy: {
      eyebrow: `Last updated: ${LAST_UPDATED}`,
      title: 'Privacy Policy',
      intro:
        'This Privacy Policy explains what information NAHUAL processes when visitors use the scanner, contact the operator, or view pages that may later include advertising or analytics.',
      sections: [
        {
          heading: 'Information processed by the scanner',
          body: [
            'When you run an analysis, the site sends the numeric UID and selected region to the backend worker. The response may include nickname, UID, score, verdict, last event, and service messages.',
            'The current app does not require an account, password, payment card, or profile registration to use the scanner.',
          ],
        },
        {
          heading: 'Contact information',
          body: [
            `If you contact the operator at ${CONTACT_EMAIL}, your email address and message contents are used to respond to the request, investigate issues, review policy questions, or handle privacy and safety concerns.`,
            'Do not send sensitive personal information, passwords, private game credentials, government identifiers, or payment details through email.',
          ],
        },
        {
          heading: 'Advertising and cookies',
          body: [
            'If Google AdSense or another advertising provider is enabled, third-party vendors, including Google, may use cookies to serve ads based on prior visits to this site or other websites.',
            'Google and its partners may use advertising cookies, web beacons, IP addresses, and other identifiers for ad serving, measurement, fraud prevention, and personalization where law and consent allow.',
            'Users may manage personalized ads at https://myadcenter.google.com/ and learn how Google uses data from partner sites at https://policies.google.com/technologies/partner-sites.',
          ],
        },
        {
          heading: 'Consent and regional rights',
          body: [
            'If ads or analytics are enabled in regions that require consent, the site should use a consent management flow before personalized advertising or comparable tracking is activated.',
            'Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain personal information. Contact the operator to start a request.',
          ],
        },
      ],
    },
    terms: {
      eyebrow: `Last updated: ${LAST_UPDATED}`,
      title: 'Terms of Use',
      intro:
        'These Terms govern access to NAHUAL. By using the site, you agree to use it responsibly, respect third-party rights, and understand the limits of anomaly analysis.',
      sections: [
        {
          heading: 'Acceptable use',
          body: [
            'You may use the scanner for fair-play review, educational analysis, and personal telemetry interpretation. You may not use it to harass, threaten, shame, impersonate, dox, or target another person.',
            'You may not attempt to overload the service, scrape it at abusive volume, bypass limits, probe private infrastructure, interfere with the backend worker, or submit abusive automated requests.',
          ],
        },
        {
          heading: 'No cheating or unauthorized access',
          body: [
            'NAHUAL does not authorize cheating, unauthorized access, account compromise, client modification, reverse engineering of game services, or bypassing anti-cheat systems.',
            'Do not use the site to request or distribute instructions, files, exploits, or services that would enable dishonest gameplay or unauthorized access.',
          ],
        },
        {
          heading: 'Result disclaimers',
          body: [
            'Scores, verdicts, and timestamps are provided for informational review only. They may be inaccurate, unavailable, delayed, or incomplete because they depend on external data and backend availability.',
            'NAHUAL is not an official enforcement channel and cannot ban, clear, restore, or discipline game accounts.',
          ],
        },
        {
          heading: 'Third-party services',
          body: [
            'The site may depend on hosting, backend workers, fonts, advertising providers, and other third-party services. Those services may have their own terms, privacy practices, availability limits, and security controls.',
            'If advertising is enabled, ads must remain clearly separated from navigation, controls, and scanner actions.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'Operator contact',
      title: 'Contact',
      intro:
        'Use this channel for support, privacy requests, corrections, compliance questions, responsible disclosure, and advertising or monetization inquiries.',
      sections: [
        {
          heading: 'Email',
          body: [
            `Primary contact: ${CONTACT_EMAIL}. Include the page URL, UID only if relevant, selected region, approximate time, browser, and a short description of the issue.`,
            'For privacy requests, describe the request clearly and use the same email for follow-up. The operator may ask for limited information needed to verify and process the request.',
          ],
        },
        {
          heading: 'Responsible disclosure',
          body: [
            'If you believe you found a security problem, report it privately before sharing details publicly. Do not access, alter, destroy, or extract data that does not belong to you.',
          ],
        },
        {
          heading: 'Content and policy concerns',
          body: [
            'Send concerns about misleading results, compliance, ad placement, privacy, or potentially unsafe content to the contact email for review.',
          ],
        },
      ],
    },
  },
}

const getPageForPath = (): PageId => {
  if (typeof window === 'undefined') return 'scanner'

  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
  return ROUTE_TO_PAGE[normalizedPath] ?? 'scanner'
}

const getPathForPage = (page: PageId): string => NAV_ITEMS.find(item => item.id === page)?.path ?? '/'

const getAnomalyState = (score: number): Exclude<AnomalyState, 'idle'> => {
  if (score >= 90) return 'anomaly'
  if (score >= 65) return 'drift'
  return 'nominal'
}

const updateMetaDescription = (description: string) => {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (meta) meta.content = description
}

const InfoPage: React.FC<{ page: InfoPageId; language: Language }> = ({ page, language }) => {
  const content = INFO_PAGES[language][page]
  const contactLabel = language === 'es' ? 'Enviar correo' : 'Email'

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <article className="border border-terminal-border bg-terminal-panel/90 p-5 sm:p-8 animate-fade-in">
        <p className="font-mono text-xs text-terminal-accent tracking-widest uppercase">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase text-white">
          {content.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-7 text-terminal-text">
          {content.intro}
        </p>

        <div className="mt-8 space-y-7">
          {content.sections.map(section => (
            <section key={section.heading} className="border-t border-terminal-border pt-5">
              <h2 className="font-display text-base font-bold uppercase tracking-widest text-white">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map(paragraph => (
                  <p key={paragraph} className="text-sm leading-7 text-terminal-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {page === 'contact' && (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-flex border border-terminal-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-terminal-accent hover:bg-terminal-accent hover:text-terminal-bg"
          >
            {contactLabel} {CONTACT_EMAIL}
          </a>
        )}
      </article>
    </main>
  )
}

export default function App() {
  const [uid, setUid] = useState('')
  const [region, setRegion] = useState('US')
  const [theme, setTheme] = useState<ThemeId>('green')
  const [language, setLanguage] = useState<Language>('es')
  const [page, setPage] = useState<PageId>(getPageForPath)
  const [state, setState] = useState<ScanState>('idle')
  const [player, setPlayer] = useState<PlayerResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const t = translations[language]
  const scannerCopy = t.scanner
  const anomalyState: AnomalyState = player ? getAnomalyState(player.hacker_score) : 'idle'
  const statusLabel = anomalyState === 'idle' ? scannerCopy.ready_state : t.status[anomalyState]
  const siteHostname = typeof window === 'undefined' ? 'calculated-anomaly-scoring-tracker.pages.dev' : window.location.hostname
  const isUidValid = uid.trim().length >= 8 && uid.trim().length <= 12

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.anomaly = anomalyState
    document.documentElement.lang = language
  }, [anomalyState, language, theme])

  useEffect(() => {
    document.title = page === 'scanner'
      ? `${SITE_NAME} | ${t.tagline}`
      : `${t.nav[page]} | ${SITE_NAME}`
    updateMetaDescription(PAGE_DESCRIPTIONS[language][page])
  }, [language, page, t])

  useEffect(() => {
    const handlePopState = () => setPage(getPageForPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateToPage = (targetPage: PageId) => {
    const targetPath = getPathForPage(targetPage)
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
    setPage(targetPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageLinkClick = (targetPage: PageId) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    navigateToPage(targetPage)
  }

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
      const data = await scanPlayer(trimmedUid, region)

      if (!data) {
        setState('error')
        setErrorMsg(scannerCopy.no_response)
        return
      }

      setErrors(data.errors ?? [])

      if (!data.success) {
        setState('error')
        setErrorMsg(data.error ?? data.message ?? scannerCopy.request_failed)
      } else if (data.player) {
        setPlayer(data.player)
        setState('success')
      } else {
        setState('error')
        setErrorMsg(scannerCopy.no_player)
      }
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : scannerCopy.unexpected)
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
      <header className="border-b border-terminal-border bg-terminal-panel/85 backdrop-blur px-4 sm:px-6 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/"
            onClick={handlePageLinkClick('scanner')}
            className="flex items-center gap-3"
            aria-label={`${SITE_NAME} scanner`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-terminal-accent flex-none">
              <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
              {t.brand_name}
            </span>
          </a>

          <nav className="flex flex-wrap gap-1 sm:ml-3" aria-label="Primary navigation">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={item.path}
                onClick={handlePageLinkClick(item.id)}
                className={`
                  border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest
                  ${page === item.id
                    ? 'border-terminal-accent text-terminal-accent bg-terminal-accent/10'
                    : 'border-transparent text-terminal-muted hover:border-terminal-border hover:text-terminal-text'
                  }
                `}
              >
                {t.nav[item.id]}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-terminal-muted tracking-widest uppercase">
              {t.theme_label}
            </span>
            <select
              value={theme}
              onChange={handleThemeChange}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:border-terminal-accent"
              aria-label={t.theme_label}
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
              {t.language_label}
            </span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:border-terminal-accent"
              aria-label={t.language_label}
            >
              {LANGUAGES.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="font-mono text-xs text-terminal-muted tracking-widest">
            {t.version_label}
          </div>
        </div>
      </header>

      {page === 'scanner' ? (
        <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 gap-8 max-w-2xl mx-auto w-full">
          <div className="text-center space-y-3 animate-fade-in">
            <p className="inline-flex border border-terminal-border bg-terminal-panel px-3 py-1 font-mono text-[10px] text-terminal-accent tracking-widest uppercase">
              {statusLabel}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-white glitch">
              {t.dashboard_title}
            </h1>
            <p className="font-mono text-xs text-terminal-muted tracking-widest">
              {t.tagline}
            </p>
            <p className="mx-auto max-w-xl text-sm leading-6 text-terminal-text">
              {scannerCopy.supporting_copy}
            </p>
          </div>

          {player && (
            <div className="w-full">
              <PlayerCard player={player} copy={{
                playerProfile: t.player_card.player_profile,
                uid: t.player_card.uid,
                probabilityScore: t.player_card.probability_score,
                lastSeen: t.player_card.last_seen,
                notAvailable: t.player_card.not_available,
                threatScore: t.player_card.threat_score,
                verdicts: t.player_card.verdicts,
              }} />
            </div>
          )}

          <div className="w-full border border-terminal-border bg-terminal-panel p-6 space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-terminal-accent" />
              <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase">
                {scannerCopy.player_identification}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-terminal-muted tracking-widest uppercase block">
                {scannerCopy.player_uid}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-terminal-accent text-sm select-none">
                  &gt;_
                </span>
                <input
                  type="text"
                  value={uid}
                  onChange={e => setUid(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={handleKeyDown}
                  placeholder={scannerCopy.uid_placeholder}
                  maxLength={12}
                  disabled={state === 'loading'}
                  className="input-glow w-full bg-terminal-bg border border-terminal-border text-white font-mono text-sm pl-10 pr-4 py-3 placeholder-terminal-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-terminal-muted tracking-widest uppercase block">
                {scannerCopy.region}
              </label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setRegion(s)}
                    disabled={state === 'loading'}
                    className={`
                      px-3 py-1.5 font-mono text-xs tracking-widest uppercase border transition-all duration-150 disabled:opacity-50
                      ${region === s
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
                    {scannerCopy.scanning}
                  </span>
                ) : scannerCopy.initiate_scan}
              </button>
            </div>
          </div>

          {state === 'error' && !player && (
            <div className="w-full border border-terminal-danger bg-terminal-danger/5 p-4 animate-fade-in">
              <div className="flex items-center gap-2 font-mono text-terminal-danger text-sm">
                <span className="text-lg">!</span>
                <span className="tracking-wide">{errorMsg}</span>
              </div>
            </div>
          )}

          {state === 'success' && errors.length > 0 && (
            <div className="w-full border border-terminal-warn/30 bg-terminal-warn/5 p-4 animate-fade-in">
              <div className="font-mono text-xs text-terminal-warn tracking-widest uppercase mb-2">
                ! {scannerCopy.partial_errors_title}
              </div>
              {errors.map((error, index) => (
                <div key={`${error}-${index}`} className="font-mono text-xs text-terminal-warn/70 mt-1">
                  &gt; {error}
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        <InfoPage page={page} language={language} />
      )}

      <footer className="border-t border-terminal-border px-4 sm:px-6 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-terminal-muted tracking-widest">
            (c) 2026 Gustavo Slzar · {CONTACT_EMAIL}
          </span>
          <span className="font-mono text-xs text-terminal-muted">
            {siteHostname}
          </span>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Footer navigation">
          {NAV_ITEMS.filter(item => item.id !== 'scanner').map(item => (
            <a
              key={item.id}
              href={item.path}
              onClick={handlePageLinkClick(item.id)}
              className="font-mono text-[10px] uppercase tracking-widest text-terminal-muted hover:text-terminal-accent"
            >
              {t.nav[item.id]}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
