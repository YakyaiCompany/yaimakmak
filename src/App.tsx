import { useCallback, useEffect, useRef, useState } from 'react'
import AdminPortal from './AdminPortal'
import { NotFoundPage, PrivacyPolicyPage } from './LegalPages'
import { COMPANY } from './config/company'
import DownloadsPage from './pages/DownloadsPage'
import { environment } from './config/environment'
import { INDUSTRIES, NEWS, PRODUCTS, PROJECTS, SERVICES, WHY_US } from './data/siteContent'
import { postJson } from './lib/api'
import type { Article, IndustryIconName, Product, Project } from './types/content'

/* ─── ROUTE TYPES ─────────────────────────── */
type Page =
  | { t: 'home' }
  | { t: 'products' }
  | { t: 'projects' }
  | { t: 'news' }
  | { t: 'downloads' }
  | { t: 'project'; p: Project }
  | { t: 'article'; a: Article }
  | { t: 'privacy' }
  | { t: 'admin' }
  | { t: 'not-found' }









function safeVideoUrl(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const isSupportedHost = hostname === 'youtu.be' || hostname.endsWith('.youtube.com') || hostname === 'youtube.com' || hostname === 'player.vimeo.com'
    return url.protocol === 'https:' && isSupportedHost ? url.toString() : null
  } catch {
    return null
  }
}

const HERO_VIDEO_URL = safeVideoUrl(environment.heroVideoUrl)

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

function pageFromPath(pathname: string): Page {
  const path = normalizePathname(pathname)
  if (path === '/') return { t: 'home' }
  if (path === '/products') return { t: 'products' }
  if (path === '/projects') return { t: 'projects' }
  if (path === '/news') return { t: 'news' }
  if (path === '/downloads') return { t: 'downloads' }
  if (path === '/privacy-policy') return { t: 'privacy' }
  if (path === '/admin' || path.startsWith('/admin/')) return { t: 'admin' }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const project = PROJECTS.find(item => item.slug === projectMatch[1])
    return project ? { t: 'project', p: project } : { t: 'not-found' }
  }

  const articleMatch = path.match(/^\/news\/([^/]+)$/)
  if (articleMatch) {
    const article = NEWS.find(item => item.slug === articleMatch[1])
    return article ? { t: 'article', a: article } : { t: 'not-found' }
  }

  return { t: 'not-found' }
}

function pathForPage(page: Page) {
  switch (page.t) {
    case 'home': return '/'
    case 'products': return '/products'
    case 'projects': return '/projects'
    case 'project': return `/projects/${page.p.slug}`
    case 'news': return '/news'
    case 'downloads': return '/downloads'
    case 'article': return `/news/${page.a.slug}`
    case 'privacy': return '/privacy-policy'
    case 'admin': return '/admin'
    case 'not-found': return '/404'
  }
}

function titleForPage(page: Page) {
  const suffix = 'บริษัท ยักษ์ใหญ่ 2015 จำกัด'
  switch (page.t) {
    case 'home': return `${suffix} | ระบบพลังงานชีวมวลอุตสาหกรรม`
    case 'products': return `ผลิตภัณฑ์ | ${suffix}`
    case 'projects': return `ผลงาน | ${suffix}`
    case 'project': return `${page.p.name} | ${suffix}`
    case 'news': return `ข่าวสารและบทความ | ${suffix}`
    case 'article': return `${page.a.title} | ${suffix}`
    case 'downloads': return `เอกสารดาวน์โหลด | ${suffix}`
    case 'privacy': return `นโยบายความเป็นส่วนตัว | ${suffix}`
    case 'admin': return `ระบบจัดการเนื้อหา | ${suffix}`
    case 'not-found': return `ไม่พบหน้า | ${suffix}`
  }
}

async function submitLead(kind: 'contact' | 'quote', payload: Record<string, unknown>) {
  if (!environment.contactEndpoint) {
    if (environment.demoMode) {
      await new Promise(resolve => window.setTimeout(resolve, 450))
      return
    }
    throw new Error('ยังไม่ได้ตั้งค่าปลายทางรับข้อมูล กรุณาติดต่อบริษัทผ่านโทรศัพท์หรือ LINE')
  }

  const { agree, ...lead } = payload
  const message = typeof lead.message === 'string' ? lead.message : typeof lead.detail === 'string' ? lead.detail : ''

  await postJson<{ data: { id: string; status: string } }, Record<string, unknown>>(
    environment.contactEndpoint,
    { kind, ...lead, message, consent: agree === true },
  )
}

/* ─── ICON COMPONENTS ────────────────────────────── */
const IcoCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const IcoX = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IcoMenu = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const IcoPhone = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
  </svg>
)
const IcoDownload = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)
const IcoMail = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const IcoMapPin = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IcoChevron = ({ right = true }: { right?: boolean }) => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={right ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
  </svg>
)
const IcoArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)
const IcoPlay = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
  </svg>
)
const IcoLine = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 11.5c0 4.14-3.58 7.5-8 7.5a8.9 8.9 0 01-3.6-.75L4 19l1.15-3.05A7 7 0 014 11.5C4 7.36 7.58 4 12 4s8 3.36 8 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
  </svg>
)
const IcoFacebook = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 00-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4z" />
  </svg>
)
const IcoCopy = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h7a2 2 0 012 2v10a2 2 0 01-2 2h-2M5 7h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
  </svg>
)

function IcoIndustry({ name }: { name: IndustryIconName }) {
  const paths: Record<IndustryIconName, string> = {
    leaf: 'M20 4C11 4 5 8.5 5 16c0 1.5.5 3 1.3 4C14 20 19 14.5 20 4zM4 20c3-4 6-6 11-8',
    mineral: 'M12 3l7 5v8l-7 5-7-5V8l7-5zM5 8l7 5 7-5M12 13v8',
    grain: 'M12 21V5M12 9c-3 0-5-2-5-5 3 0 5 2 5 5zm0 4c3 0 5-2 5-5-3 0-5 2-5 5zm0 4c-3 0-5-2-5-5 3 0 5 2 5 5z',
    building: 'M4 20V9l8-5 8 5v11M9 20v-5h6v5M8 10h.01M12 10h.01M16 10h.01',
    materials: 'M5 4h14v4H5zM5 12h14v4H5zM8 8v4m8-4v4',
    agriculture: 'M12 21V9M12 13c-4 0-6-2-6-6 4 0 6 2 6 6zm0 3c4 0 6-2 6-6-4 0-6 2-6 6z',
    flame: 'M13 3c1 4-3 5-3 8 0 2 1 3 3 3 3 0 4-3 3-6 3 2 4 5 4 8a8 8 0 11-16 0c0-4 2-7 5-10 0 4 4 3 4-3z',
    factory: 'M3 20V9l6 3V8l6 3V5l6 3v12H3zM7 20v-4h3v4m4-7h.01m3 0h.01',
  }
  return <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} /></svg>
}



function useDialogFocus(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusable = dialog?.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')
    focusable?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return dialogRef
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="video-title" className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="flex items-center justify-between bg-ink-950 px-4 py-3 text-white"><h2 id="video-title" className="font-heading text-sm font-semibold">วิดีโอแนะนำระบบ</h2><button onClick={onClose} className="min-w-11 min-h-11 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="ปิดวิดีโอ"><IcoX /></button></div>
        <div className="aspect-video"><iframe src={url} title="วิดีโอแนะนำระบบของยักษ์ใหญ่ 2015" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      </div>
    </div>
  )
}

/* ─── LOGO ───────────────────────────────────────── */
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-heading font-bold ${light ? 'bg-white/20 text-white' : 'bg-brand-900 text-white'}`}>YY</div>
      <div>
        <div className={`font-heading font-semibold text-sm leading-tight ${light ? 'text-white' : 'text-brand-900'}`}>ยักษ์ใหญ่ 2015</div>
      </div>
    </div>
  )
}

/* ─── HEADER ─────────────────────────────────────── */
function Header({ scrolled, isHome, setPage, onQuote }: { scrolled: boolean; isHome: boolean; setPage: (p: Page) => void; onQuote: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLight = isHome && !scrolled

  const navLinks: Array<{ label: string; id?: string; page?: Page }> = [
    { label: 'หน้าแรก', id: 'hero' },
    { label: 'เกี่ยวกับเรา', id: 'about' },
    { label: 'สินค้า', page: { t: 'products' } },
    { label: 'บริการ', id: 'services' },
  ]

  const openNavItem = (item: { id?: string; page?: Page }) => {
    if (item.page) {
      setPage(item.page)
      setMobileOpen(false)
      return
    }
    if (item.id) scrollTo(item.id)
  }

  const scrollTo = (id: string) => {
    setPage({ t: 'home' })
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
    setMobileOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLight ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 md:h-18 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="cursor-pointer rounded-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-energy-400" aria-label="กลับสู่หน้าแรก">
            <Logo light={isLight} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.label} onClick={() => openNavItem(l)}
                className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
                {l.label}
              </button>
            ))}
            <button onClick={() => setPage({ t: 'projects' })}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
              ผลงาน
            </button>
            <button onClick={() => setPage({ t: 'news' })}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
              ข่าวสาร
            </button>
            <button onClick={() => setPage({ t: 'downloads' })}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
              เอกสาร
            </button>
            <button onClick={() => scrollTo('contact')}
            className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
            ติดต่อเรา
          </button>
          </nav>

          <div className="flex items-center gap-2 lg:ml-4">
            <button onClick={onQuote} className="hidden lg:flex items-center gap-2 bg-energy-600 hover:bg-energy-400 text-white text-sm font-body px-4 py-2.5 rounded-lg transition-colors duration-200">
              ขอใบเสนอราคา
            </button>
            <button onClick={() => setMobileOpen(true)} className={`lg:hidden min-w-11 min-h-11 p-2 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-energy-400 ${isLight ? 'text-white' : 'text-ink-950'}`} aria-label="เปิดเมนู">
              <IcoMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-ink-300">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="min-w-11 min-h-11 p-2 text-ink-700 hover:text-ink-950 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700" aria-label="ปิดเมนู"><IcoX /></button>
            </div>
            <nav className="flex-1 p-5 flex flex-col gap-1">
              {navLinks.map(l => (
                <button key={l.label} onClick={() => openNavItem(l)} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">{l.label}</button>
              ))}
              <button onClick={() => { setPage({ t: 'projects' }); setMobileOpen(false) }} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ผลงาน</button>
              <button onClick={() => { setPage({ t: 'news' }); setMobileOpen(false) }} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ข่าวสาร</button>
              <button onClick={() => { setPage({ t: 'downloads' }); setMobileOpen(false) }} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">เอกสาร</button>
              <button onClick={() => scrollTo('contact')} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ติดต่อเรา</button>
            </nav>
            <div className="p-5 border-t border-ink-300 flex flex-col gap-3">
              <button onClick={() => { onQuote(); setMobileOpen(false) }} className="w-full bg-energy-600 text-white py-3 rounded-lg text-sm font-body font-medium">ขอใบเสนอราคา</button>
              <a href={COMPANY.phoneHref} className="w-full flex items-center justify-center gap-2 border border-brand-700 text-brand-700 py-3 rounded-lg text-sm font-body font-medium hover:bg-brand-700 hover:text-white transition-colors">
                <IcoPhone />โทรหาเรา
              </a>
              <a href={COMPANY.lineUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 border border-[#06C755] text-[#068b3f] py-3 rounded-lg text-sm font-body font-medium hover:bg-[#06C755] hover:text-white transition-colors">
                <IcoLine />LINE
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── HERO ───────────────────────────────────────── */
function Hero({ onQuote, onProducts, onVideo }: { onQuote: () => void; onProducts: () => void; onVideo?: () => void }) {
  return (
    <section id="hero" className="relative flex min-h-[calc(100svh-4rem)] items-center lg:min-h-[calc(100svh-5rem)]">
      <div className="absolute inset-0 bg-brand-900">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop&auto=format" alt="โรงงานอุตสาหกรรม" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-brand-900/50" />
        <div className="absolute inset-0 bg-linear-to-b from-brand-900/65 via-brand-900/45 to-brand-900/55 md:bg-linear-to-r" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 pt-24 pb-20 w-full">
        <div className="max-w-2xl">
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl lg:text-[56px] leading-[1.2] mb-5">
            ระบบเตาแก๊สซิไฟเออร์<br />และเครื่องจักรอบแห้ง<br />
            <span className="text-brand-500">สำหรับโรงงานอุตสาหกรรม</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg font-body leading-relaxed mb-8 max-w-lg">
            ออกแบบ ผลิต ติดตั้ง และทดสอบระบบพลังงานชีวมวล ให้เหมาะกับกระบวนการผลิตของแต่ละโรงงาน
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            <button onClick={onQuote} className="flex items-center justify-center gap-2 bg-energy-600 hover:bg-energy-400 text-white px-6 py-3.5 rounded-lg font-body font-medium text-sm transition-all duration-200 hover:scale-[1.02]">
              ขอใบเสนอราคา <IcoArrowRight />
            </button>
            <button onClick={onProducts} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 rounded-lg font-body font-medium text-sm transition-colors duration-200">
              ดูสินค้าและบริการ
            </button>
            {onVideo && <button onClick={onVideo} className="flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white px-5 py-3.5 rounded-lg font-body font-medium text-sm transition-colors" aria-label="เล่นวิดีโอแนะนำระบบ">
              <IcoPlay />ดูวิดีโอ
            </button>}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {['ออกแบบตามหน้างาน', 'ติดตั้งครบวงจร', 'ทดสอบก่อนส่งมอบ'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-white/70 text-sm font-body">
                <span className="text-brand-500"><IcoCheck /></span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── TRUST BAR ──────────────────────────────────── */
function TrustBar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const loopedServices = [...SERVICES, ...SERVICES, ...SERVICES]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frameId = 0
    let lastFrame = performance.now()
    let offset = 0

    const animate = (timestamp: number) => {
      const sequenceWidth = track.scrollWidth / 3
      if (sequenceWidth > 0) {
        const elapsed = Math.min(timestamp - lastFrame, 64)
        offset = (offset + elapsed * 0.035) % sequenceWidth
        track.style.transform = `translate3d(${-offset}px, 0, 0)`
      }
      lastFrame = timestamp
      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [])

  return (
    <section id="services" className="overflow-hidden bg-brand-700" aria-label="บริการครบวงจรตั้งแต่เริ่มต้นจนส่งมอบ">
      <div className="w-full overflow-hidden py-3">
        <p className="sr-only">บริการครบวงจร: {SERVICES.map(service => service.title).join(', ')}</p>
        <div ref={trackRef} aria-hidden="true" className="service-marquee flex w-max items-center">
          {loopedServices.map((service, index) => (
            <div key={`${service.step}-${index}`} className="flex shrink-0 items-center border-r border-white/20 px-5 py-1.5 md:px-7">
              <span className="whitespace-nowrap font-body text-sm font-medium text-white/90">{service.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ABOUT ──────────────────────────────────────── */
function About({ onLearnMore }: { onLearnMore: () => void }) {
  return (
    <section id="about" data-scroll-reveal className="bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-ink-100">
              <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&h=520&fit=crop&auto=format" alt="ทีมงานยักษ์ใหญ่ 2015" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-brand-900 text-white rounded-xl p-4 shadow-xl hidden md:block">
              <div className="font-heading font-semibold text-sm">ออกแบบเฉพาะหน้างาน</div>
              <div className="text-white/70 text-xs font-body mt-1">ประเมินจากกระบวนการผลิตจริง</div>
            </div>
          </div>
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">เกี่ยวกับเรา</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25] mb-5">
              ผู้เชี่ยวชาญระบบพลังงาน<br />ชีวมวลอุตสาหกรรม
            </h2>
            <div className="space-y-3 text-ink-700 text-base font-body leading-relaxed mb-8">
              <p>บริษัท ยักษ์ใหญ่ 2015 จำกัด เชี่ยวชาญด้านการออกแบบ ผลิต และติดตั้งระบบแก๊สซิไฟเออร์ชีวมวลและเครื่องจักรอบแห้ง สำหรับโรงงานอุตสาหกรรมในประเทศไทย</p>
              <p>เราให้บริการครบวงจรตั้งแต่ให้คำปรึกษา ออกแบบระบบให้เหมาะกับโรงงานของคุณ จนถึงการติดตั้ง ทดสอบ และดูแลหลังการขาย</p>
              <p>ระบบของเราช่วยให้โรงงานลดต้นทุนพลังงานได้ 40–60% เมื่อเปลี่ยนจาก LPG หรือน้ำมันเตามาใช้เชื้อเพลิงชีวมวลในท้องถิ่น</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'สำรวจหน้างาน', desc: 'วิเคราะห์พื้นที่ เชื้อเพลิง และความต้องการความร้อน' },
                { title: 'ออกแบบเฉพาะระบบ', desc: 'วางแนวทางให้สอดคล้องกับกระบวนการผลิต' },
                { title: 'ทดสอบก่อนส่งมอบ', desc: 'ตรวจสอบการทำงานก่อนเริ่มใช้งานจริง' },
                { title: 'ดูแลต่อเนื่อง', desc: 'วางแผนการบำรุงรักษาหลังติดตั้ง' },
              ].map(item => (
                <div key={item.title} className="bg-ink-100 rounded-xl p-4">
                  <div className="font-heading font-semibold text-brand-700 text-sm">{item.title}</div>
                  <div className="text-ink-700 text-xs font-body mt-1 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={onLearnMore} className="mt-6 inline-flex items-center gap-2 text-brand-700 font-body text-sm font-medium hover:text-brand-900 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700 rounded-lg">
              ดูสินค้าและบริการ <IcoArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── PRODUCTS ───────────────────────────────────── */
function Products({ onProduct, onQuote, onViewAll }: { onProduct: (p: Product) => void; onQuote: () => void; onViewAll: () => void }) {
  return (
    <section id="products" data-scroll-reveal className="bg-ink-100 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ผลิตภัณฑ์</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">ระบบและเครื่องจักรที่ออกแบบ<br className="hidden md:block" />ตามการใช้งานจริง</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="aspect-[3/2] bg-ink-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <h3 className="font-heading font-semibold text-ink-950 text-lg leading-tight">{p.name}</h3>
                  <p className="text-brand-700 text-sm font-body mt-0.5">{p.subtitle}</p>
                </div>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-body text-ink-700">
                      <span className="text-brand-700 mt-0.5 shrink-0"><IcoCheck /></span>{h}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-4 border-t border-ink-300/60">
                  <button onClick={() => onProduct(p)} className="flex-1 text-brand-700 border border-brand-700 hover:bg-brand-700 hover:text-white text-sm font-body py-2.5 rounded-lg transition-colors duration-200">ดูรายละเอียด</button>
                  <button onClick={onQuote} className="flex-1 bg-energy-600 hover:bg-energy-400 text-white text-sm font-body py-2.5 rounded-lg transition-colors duration-200">ขอใบเสนอราคา</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button onClick={onViewAll} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-brand-700 px-6 py-3 font-body text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white">
            ดูผลิตภัณฑ์ทั้งหมด <IcoArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── INDUSTRIES ─────────────────────────────────── */
function Industries() {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <section data-scroll-reveal className="bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">อุตสาหกรรมที่รองรับ</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">ระบบเหมาะกับโรงงานประเภทใดบ้าง</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              className={`rounded-xl p-5 border transition-all duration-250 cursor-default ${hovered === i ? 'bg-brand-900 border-brand-900 -translate-y-1 shadow-lg' : 'bg-ink-100 border-ink-300/60 hover:border-brand-700/30'}`}>
              <div className={`mb-3 transition-colors duration-250 ${hovered === i ? 'text-energy-400' : 'text-brand-700'}`}><IcoIndustry name={ind.icon} /></div>
              <h4 className={`font-heading font-semibold text-sm mb-1.5 transition-colors ${hovered === i ? 'text-white' : 'text-ink-950'}`}>{ind.name}</h4>
              <p className={`text-xs font-body leading-relaxed transition-colors ${hovered === i ? 'text-white/70' : 'text-ink-700'}`}>{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



/* ─── WHY US ─────────────────────────────────────── */
function WhyUs() {
  return (
    <section id="why-us" data-scroll-reveal className="bg-brand-50 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ทำไมต้องเลือกเรา</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">จุดที่ทำให้เราแตกต่าง</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {WHY_US.map((w, i) => (
            <div key={i} className="group rounded-2xl border border-ink-300/60 bg-white p-6 hover:border-brand-700/30 hover:bg-brand-900/[0.02] transition-all duration-300">
              <div className="text-3xl text-brand-500 mb-4 group-hover:text-brand-700 transition-colors">{w.icon}</div>
              <h4 className="font-heading font-semibold text-ink-950 text-base mb-2">{w.title}</h4>
              <p className="text-ink-700 text-sm font-body leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FEATURED PROJECTS ──────────────────────────── */
function FeaturedProjects({ setPage }: { setPage: (p: Page) => void }) {
  const featured = PROJECTS.slice(0, 3)
  return (
    <section data-scroll-reveal className="bg-white py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-2">ผลงาน</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">ผลงานที่ผ่านมา</h2>
          </div>
          <button onClick={() => setPage({ t: 'projects' })} className="flex items-center gap-2 text-brand-700 text-sm font-body font-medium hover:text-brand-900 transition-colors self-start md:self-auto">
            ดูผลงานทั้งหมด <IcoArrowRight />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p, i) => (
            <button key={p.id} type="button" onClick={() => setPage({ t: 'project', p })}
              className={`group cursor-pointer text-left rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="aspect-[16/9] bg-ink-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className="bg-brand-900/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{p.industry}</span>
                </div>
                <h3 className="font-heading font-semibold text-ink-950 text-sm leading-snug mb-2">{p.name}</h3>
                <p className="line-clamp-2 text-xs font-body leading-relaxed text-ink-700">{p.summary}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-body text-ink-700">
                  <div className="flex items-center gap-1"><IcoMapPin />{p.province}</div>
                  <div>{p.year}</div>
                </div>
                <span className="mt-3 flex items-center gap-1 border-t border-ink-300/60 pt-3 font-body text-xs font-medium text-brand-700">อ่านเพิ่มเติม <IcoArrowRight /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── LATEST NEWS ────────────────────────────────── */
function LatestNews({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section data-scroll-reveal className="py-20 md:py-28 bg-ink-100">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ข่าวสาร</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">บทความและข่าวล่าสุด</h2>
          </div>
          <button onClick={() => setPage({ t: 'news' })} className="flex items-center gap-2 text-brand-700 text-sm font-body font-medium hover:text-brand-900 transition-colors self-start md:self-auto">
            ดูข่าวสารทั้งหมด <IcoArrowRight />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {NEWS.slice(0, 3).map(a => (
            <button key={a.id} type="button" onClick={() => setPage({ t: 'article', a })}
              className="group text-left cursor-pointer rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700">
              <div className="aspect-[16/9] bg-ink-100 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-brand-500/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{a.category}</span>
                  <span className="text-ink-700/60 text-xs font-body">{a.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-ink-950 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">{a.title}</h3>
                <p className="text-ink-700 text-xs font-body leading-relaxed line-clamp-2">{a.excerpt}</p>
                <span className="flex items-center gap-1 text-brand-700 text-xs font-body font-medium mt-4">อ่านเพิ่มเติม <IcoArrowRight /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── QUOTE CTA ──────────────────────────────────── */
function QuoteCTA({ onQuote }: { onQuote: () => void }) {
  return (
    <section data-scroll-reveal className="py-20 md:py-24 bg-brand-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-10" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 text-center">
        <h2 className="font-heading font-bold text-white text-3xl md:text-[40px] leading-[1.25] mb-4">
          กำลังมองหาระบบผลิตความร้อน<br className="hidden md:block" />ที่เหมาะกับโรงงานของคุณ?
        </h2>
        <p className="text-white/70 font-body text-base md:text-lg mb-10 max-w-xl mx-auto">
          ส่งรายละเอียดเบื้องต้นให้ทีมวิศวกรช่วยประเมินระบบ ไม่มีค่าใช้จ่าย
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onQuote} className="flex items-center justify-center gap-2 bg-energy-600 hover:bg-energy-400 text-white px-7 py-3.5 rounded-lg font-body font-medium text-sm transition-colors">
            ขอใบเสนอราคา <IcoArrowRight />
          </button>
          <a href={COMPANY.phoneHref} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-lg font-body font-medium text-sm transition-colors">
            <IcoPhone />โทรปรึกษา
          </a>
          <a href={COMPANY.lineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-lg font-body font-medium text-sm transition-colors">
            <IcoLine />LINE
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ────────────────────────────────────── */
function Contact({ onPrivacy }: { onPrivacy: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', topic: '', message: '', agree: false, website: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [requestError, setRequestError] = useState('')
  const fieldIds: Record<string, string> = { name: 'contact-name', phone: 'contact-phone', email: 'contact-email', agree: 'agree' }

  const inputClass = (field: string) => `w-full border rounded-lg px-3 py-2.5 text-sm font-body transition-colors ${errors[field] ? 'border-red-600 focus:border-red-600' : 'border-ink-300 focus:border-brand-700'}`

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = 'กรุณาระบุชื่อผู้ติดต่อ'
    if (!/^[0-9+\s()\-]{8,20}$/.test(form.phone.trim())) nextErrors.phone = 'กรุณาระบุเบอร์โทรที่ติดต่อได้'
    if (form.email && form.email.includes('@') && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    if (!form.agree) nextErrors.agree = 'กรุณายอมรับนโยบายความเป็นส่วนตัว'
    setErrors(nextErrors)
    setRequestError('')

    if (Object.keys(nextErrors).length) {
      const firstInvalidField = Object.keys(nextErrors)[0]
      window.setTimeout(() => document.getElementById(fieldIds[firstInvalidField] ?? firstInvalidField)?.focus(), 0)
      return
    }

    if (form.website) return

    setStatus('loading')
    try {
      await submitLead('contact', { ...form, website: undefined })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setRequestError(error instanceof Error ? error.message : 'ไม่สามารถส่งข้อมูลได้ในขณะนี้')
    }
  }

  return (
    <section id="contact" data-scroll-reveal className="bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ติดต่อเรา</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25] mb-6">พร้อมให้คำปรึกษาเกี่ยวกับโครงการ</h2>
            <div className="space-y-4 text-ink-700 font-body">
              <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0"><IcoMapPin /></div><div><div className="text-xs text-ink-700/60 mb-0.5">ที่อยู่</div><div className="text-sm text-ink-950">{COMPANY.publicAddress}</div></div></div>
              <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0"><IcoPhone /></div><div><div className="text-xs text-ink-700/60 mb-0.5">โทรศัพท์</div><a href={COMPANY.phoneHref} className="text-sm text-ink-950 hover:text-brand-700">{COMPANY.phone}</a></div></div>
              <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0"><IcoMail /></div><div><div className="text-xs text-ink-700/60 mb-0.5">อีเมล</div><a href={COMPANY.emailHref} className="text-sm text-ink-950 hover:text-brand-700">{COMPANY.email}</a></div></div>
              <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0"><IcoLine /></div><div><div className="text-xs text-ink-700/60 mb-0.5">LINE</div><a href={COMPANY.lineUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-950 hover:text-brand-700">ติดต่อผ่าน LINE</a></div></div>
              <div className="flex gap-3"><div className="w-11 h-11 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0"><IcoFacebook /></div><div><div className="text-xs text-ink-700/60 mb-0.5">Facebook</div>{COMPANY.facebookUrl ? <a href={COMPANY.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-950 hover:text-brand-700">{COMPANY.facebookLabel}</a> : <span className="text-sm text-ink-700/60">รอลิงก์ Facebook จากบริษัท</span>}</div></div>
              <div className="mt-2 text-sm"><span className="text-ink-700/60 text-xs block mb-0.5">เวลาทำการ</span>{COMPANY.businessHours}</div>
            </div>
          </div>

          <div className="bg-white border border-ink-300/60 rounded-2xl p-6 md:p-8">
            {status === 'success' ? (
              <div className="text-center py-10" role="status" aria-live="polite">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600"><IcoCheck /></div>
                <h3 className="font-heading font-semibold text-ink-950 text-xl mb-2">ส่งข้อมูลเรียบร้อยแล้ว</h3>
                <p className="text-ink-700 text-sm font-body">{environment.demoMode && !environment.contactEndpoint ? 'ทดสอบขั้นตอนส่งข้อมูลสำเร็จแล้ว โดยยังไม่มีข้อมูลถูกส่งออกจากเว็บไซต์' : 'ทีมงานจะติดต่อกลับตามช่องทางที่คุณให้ไว้ภายใน 1 วันทำการ'}</p>
                <button onClick={() => { setStatus('idle'); setForm({ name: '', company: '', phone: '', email: '', topic: '', message: '', agree: false, website: '' }) }} className="mt-6 text-brand-700 text-sm font-body hover:underline">ส่งข้อมูลใหม่</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-body text-red-700">{requestError}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label htmlFor="contact-name" className="block text-xs font-body text-ink-700 mb-1.5">ชื่อ <span className="text-red-500">*</span></label><input id="contact-name" autoComplete="name" maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} className={inputClass('name')} placeholder="ชื่อของคุณ" />{errors.name && <p id="contact-name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
                  <div><label htmlFor="contact-company" className="block text-xs font-body text-ink-700 mb-1.5">ชื่อบริษัท</label><input id="contact-company" autoComplete="organization" maxLength={150} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass('company')} placeholder="ชื่อบริษัท" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label htmlFor="contact-phone" className="block text-xs font-body text-ink-700 mb-1.5">เบอร์โทร <span className="text-red-500">*</span></label><input id="contact-phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contact-phone-error' : undefined} className={inputClass('phone')} placeholder="08X-XXX-XXXX" />{errors.phone && <p id="contact-phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>}</div>
                  <div><label htmlFor="contact-email" className="block text-xs font-body text-ink-700 mb-1.5">Email หรือ LINE</label><input id="contact-email" autoComplete="email" maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} className={inputClass('email')} placeholder="email@company.com หรือ LINE ID" />{errors.email && <p id="contact-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}</div>
                </div>
                <div><label htmlFor="contact-topic" className="block text-xs font-body text-ink-700 mb-1.5">หัวข้อที่สนใจ</label><select id="contact-topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className={inputClass('topic')}><option value="">เลือกหัวข้อ...</option>{PRODUCTS.map(product => <option key={product.id}>{product.name}</option>)}<option>ขอใบเสนอราคา</option><option>สอบถามข้อมูลทั่วไป</option></select></div>
                <div><label htmlFor="contact-message" className="block text-xs font-body text-ink-700 mb-1.5">ข้อความ</label><textarea id="contact-message" maxLength={2000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className={`${inputClass('message')} resize-none`} placeholder="รายละเอียดเพิ่มเติม..." /></div>
                <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="company-website">Website</label><input id="company-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                <div className="flex items-start gap-2.5"><input type="checkbox" id="agree" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} aria-invalid={Boolean(errors.agree)} className="mt-0.5 w-5 h-5 accent-brand-700" /><label htmlFor="agree" className="text-xs font-body text-ink-700 leading-relaxed">ยอมรับ<a href="/privacy-policy" onClick={event => { event.preventDefault(); onPrivacy() }} className="ml-1 text-brand-700 underline">นโยบายความเป็นส่วนตัว</a> และยินยอมให้ติดต่อกลับ</label></div>
                {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}
                <button type="submit" disabled={status === 'loading'} className="w-full bg-brand-700 hover:bg-brand-900 disabled:opacity-60 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">{status === 'loading' ? 'กำลังส่ง...' : 'ส่งข้อมูล'}</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────── */
function Footer({ scrollTo, setPage, onPrivacy }: { scrollTo: (id: string) => void; setPage: (p: Page) => void; onPrivacy: () => void }) {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo light />
            <p className="text-white/60 text-sm font-body leading-relaxed mt-4 mb-5">ผู้เชี่ยวชาญระบบแก๊สซิไฟเออร์ชีวมวลและเครื่องจักรอบแห้งสำหรับโรงงานอุตสาหกรรม</p>
            <div className="flex gap-3">
              <a href={COMPANY.lineUrl} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อผ่าน LINE" className="min-w-11 min-h-11 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-heading font-bold text-white/70 hover:text-white transition-colors">LINE</a>
              {COMPANY.facebookUrl ? <a href={COMPANY.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="เปิด Facebook Page" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"><IcoFacebook /></a> : <span title="รอลิงก์ Facebook จากบริษัท" aria-label="Facebook รอลิงก์จากบริษัท" className="flex min-h-11 min-w-11 cursor-not-allowed items-center justify-center rounded-lg bg-white/5 text-white/30"><IcoFacebook /></span>}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-sm mb-4">เมนูหลัก</h5>
            <ul className="space-y-2.5">
              {[['หน้าแรก', 'hero'], ['เกี่ยวกับเรา', 'about'], ['บริการ', 'services']].map(([l, id]) => (
                <li key={l}><button onClick={() => scrollTo(id)} className="text-white/60 hover:text-white text-sm font-body transition-colors">{l}</button></li>
              ))}
              <li><button onClick={() => setPage({ t: 'products' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">สินค้า</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-sm mb-4">ข้อมูลเพิ่มเติม</h5>
            <ul className="space-y-2.5">
              <li><button onClick={() => setPage({ t: 'projects' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">ผลงาน</button></li>
              <li><button onClick={() => setPage({ t: 'news' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">ข่าวสาร</button></li>
              <li><button onClick={() => scrollTo('contact')} className="text-white/60 hover:text-white text-sm font-body transition-colors">ติดต่อเรา</button></li>
              <li><button onClick={() => setPage({ t: 'downloads' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">ดาวน์โหลด</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h5 className="font-heading font-semibold text-sm mb-4">แผนที่</h5>
            <div className="overflow-hidden rounded-xl border border-white/15 bg-brand-900/40">
              <iframe title="แผนที่บริษัท ยักษ์ใหญ่ 2015" src={COMPANY.map.embedUrl} loading="lazy" referrerPolicy="no-referrer" className="h-52 w-full border-0 md:h-60" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs font-body">© {new Date().getFullYear() + 543} บริษัท ยักษ์ใหญ่ 2015 จำกัด สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <button onClick={onPrivacy} className="text-white/40 hover:text-white/70 text-xs font-body transition-colors">นโยบายความเป็นส่วนตัว</button>
            <button onClick={() => setPage({ t: 'admin' })} className="text-white/40 hover:text-white/70 text-xs font-body transition-colors">ผู้ดูแลระบบ</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── FLOATING ACTIONS ───────────────────────────── */
function LineContactModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="ปิดช่องทาง LINE" />
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="line-contact-title" className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100" aria-label="ปิด"><IcoX /></button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#06C755] text-white"><IcoLine /></div>
        <h2 id="line-contact-title" className="mt-5 font-heading text-2xl font-semibold text-ink-950">ติดต่อผ่าน LINE</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink-700">สแกน QR Code บนคอมพิวเตอร์ หรือกดปุ่มด้านล่างเพื่อเปิด LINE บนมือถือ</p>

        <div className="mx-auto mt-6 grid aspect-square w-52 place-items-center overflow-hidden rounded-2xl border border-ink-300 bg-white p-3">
          {COMPANY.lineQrImage ? <img src={COMPANY.lineQrImage} alt="QR Code สำหรับติดต่อ LINE ยักษ์ใหญ่ 2015" className="h-full w-full object-contain" /> : <div className="grid h-full w-full place-items-center rounded-xl border-2 border-dashed border-ink-300 bg-ink-100 p-5"><div><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#06C755] text-white"><IcoLine /></div><p className="mt-3 font-body text-xs leading-relaxed text-ink-700">พื้นที่ QR Code LINE OA<br />รอไฟล์จากบริษัท</p></div></div>}
        </div>

        <a href={COMPANY.lineUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#06C755] px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-[#05b34c]"><IcoLine />เปิด LINE อัตโนมัติ</a>
        <p className="mt-3 font-body text-xs text-ink-700/60">เมื่อได้รับ LINE OA และ QR Code จริง สามารถเปลี่ยนได้จากข้อมูลบริษัทจุดเดียว</p>
      </section>
    </div>
  )
}

function PhoneContactModal({ onClose }: { onClose: () => void }) {
  const [copyStatus, setCopyStatus] = useState('')
  const dialogRef = useDialogFocus(onClose)

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY.phone)
      setCopyStatus('คัดลอกเบอร์โทรแล้ว')
    } catch {
      setCopyStatus('ไม่สามารถคัดลอกอัตโนมัติได้')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="ปิดข้อมูลโทรศัพท์" />
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="phone-contact-title" className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100" aria-label="ปิด"><IcoX /></button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white"><IcoPhone cls="h-6 w-6" /></div>
        <h2 id="phone-contact-title" className="mt-5 font-heading text-2xl font-semibold text-ink-950">โทรปรึกษาทีมงาน</h2>
        <p className="mt-2 font-body text-sm text-ink-700">{COMPANY.businessHours}</p>
        <p className="mt-6 font-heading text-3xl font-bold tracking-wide text-brand-900">{COMPANY.phone}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href={COMPANY.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-brand-900"><IcoPhone />โทรออก</a>
          <button type="button" onClick={copyPhone} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-700 px-5 py-3 font-body text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"><IcoCopy />คัดลอกเบอร์</button>
        </div>
        {copyStatus && <p role="status" className="mt-3 font-body text-xs text-brand-700">{copyStatus}</p>}
      </section>
    </div>
  )
}

function FloatingActions({ onQuote, onPhone, onLine }: { onQuote: () => void; onPhone: () => void; onLine: () => void }) {
  const facebookAction = COMPANY.facebookUrl ? (
    <a
      href={COMPANY.facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="เปิด Facebook Page"
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#0f69db]"
    >
      <IcoFacebook />
    </a>
  ) : (
    <button
      type="button"
      disabled
      title="รอลิงก์ Facebook จากบริษัท"
      aria-label="Facebook รอลิงก์จากบริษัท"
      className="flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-full bg-[#1877F2]/45 text-white shadow-lg"
    >
      <IcoFacebook />
    </button>
  )

  return (
    <>
      {/* Desktop: bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
        {facebookAction}
        <button type="button" onClick={onLine} aria-label="เปิดช่องทางติดต่อผ่าน LINE" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] font-heading text-sm font-bold text-white shadow-lg transition-all hover:scale-110 hover:bg-[#05b34c]">LINE</button>
        <button type="button" onClick={onPhone} aria-label="แสดงเบอร์โทรศัพท์" className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg transition-all hover:scale-110 hover:bg-brand-900"><IcoPhone cls="h-6 w-6" /></button>
        <button onClick={onQuote} aria-label="ขอใบเสนอราคา" className="flex h-14 w-14 items-center justify-center rounded-full bg-energy-600 font-heading text-sm font-bold leading-tight text-white shadow-lg transition-all hover:scale-110 hover:bg-energy-400">ราคา</button>
      </div>
      {/* Mobile: sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-300 flex">
        <button type="button" onClick={onPhone} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-brand-700 text-xs font-body"><IcoPhone cls="w-5 h-5" />โทรหาเรา</button>
        <button type="button" onClick={onLine} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[#06C755] text-xs font-body"><IcoLine /><span>LINE</span></button>
        {COMPANY.facebookUrl ? (
          <a href={COMPANY.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="เปิด Facebook Page" className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 font-body text-xs text-[#1877F2]"><IcoFacebook /><span>Facebook</span></a>
        ) : (
          <button type="button" disabled title="รอลิงก์ Facebook จากบริษัท" aria-label="Facebook รอลิงก์จากบริษัท" className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 py-2.5 font-body text-xs text-[#1877F2]/45"><IcoFacebook /><span>Facebook</span></button>
        )}
        <button onClick={onQuote} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 bg-energy-600 text-white text-xs font-body"><IcoArrowRight />ขอใบเสนอราคา</button>
      </div>
    </>
  )
}

/* ─── QUOTE MODAL ────────────────────────────────── */
function QuoteModal({ onClose, context, onPrivacy }: { onClose: () => void; context?: { product?: string; project?: string }; onPrivacy: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', contact: '', factory: '', system: context?.product ?? '', detail: '', reference: context?.project ?? '', agree: false, website: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [requestError, setRequestError] = useState('')
  const fieldIds: Record<string, string> = { name: 'quote-name', phone: 'quote-phone', agree: 'quote-agree' }
  const dialogRef = useDialogFocus(onClose)
  const inputClass = (field: string) => `w-full border rounded-lg px-3 py-2.5 text-sm font-body transition-colors ${errors[field] ? 'border-red-600 focus:border-red-600' : 'border-ink-300 focus:border-brand-700'}`

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = 'กรุณาระบุชื่อผู้ติดต่อ'
    if (!/^[0-9+\s()\-]{8,20}$/.test(form.phone.trim())) nextErrors.phone = 'กรุณาระบุเบอร์โทรที่ติดต่อได้'
    if (!form.agree) nextErrors.agree = 'กรุณายอมรับนโยบายความเป็นส่วนตัว'
    setErrors(nextErrors)
    setRequestError('')
    if (Object.keys(nextErrors).length) {
      const firstInvalidField = Object.keys(nextErrors)[0]
      window.setTimeout(() => document.getElementById(fieldIds[firstInvalidField] ?? firstInvalidField)?.focus(), 0)
      return
    }
    if (form.website) return

    setStatus('loading')
    try {
      await submitLead('quote', { ...form, website: undefined })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setRequestError(error instanceof Error ? error.message : 'ไม่สามารถส่งข้อมูลได้ในขณะนี้')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="quote-title" className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-ink-300 sticky top-0 bg-white rounded-t-2xl z-10">
          <div><h3 id="quote-title" className="font-heading font-semibold text-ink-950 text-lg">ขอใบเสนอราคา</h3><p className="text-ink-700 text-xs font-body mt-0.5">ทีมวิศวกรจะติดต่อกลับภายใน 1 วันทำการ</p></div>
          <button onClick={onClose} className="min-w-11 min-h-11 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-700 transition-colors" aria-label="ปิดแบบฟอร์ม"><IcoX /></button>
        </div>
        <div className="p-5">
          {status === 'success' ? <div className="text-center py-8" role="status" aria-live="polite"><div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600"><IcoCheck /></div><h4 className="font-heading font-semibold text-ink-950 text-xl mb-2">{environment.demoMode && !environment.contactEndpoint ? 'ทดสอบขั้นตอนสำเร็จแล้ว' : 'ส่งข้อมูลเรียบร้อยแล้ว'}</h4><p className="text-ink-700 text-sm font-body mb-6">{environment.demoMode && !environment.contactEndpoint ? 'นี่คือโหมดสาธิต ข้อมูลยังไม่ถูกส่งหรือจัดเก็บ' : 'ทีมงานจะติดต่อกลับโดยเร็ว'}</p><button onClick={onClose} className="bg-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-body">ปิด</button></div> : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {context?.product && <div className="rounded-lg bg-brand-900/5 px-3 py-2 text-xs font-body text-brand-900">สินค้าอ้างอิง: <strong>{context.product}</strong></div>}
              {context?.project && <div className="rounded-lg bg-brand-900/5 px-3 py-2 text-xs font-body text-brand-900">โครงการอ้างอิง: <strong>{context.project}</strong></div>}
              {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-body text-red-700">{requestError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label htmlFor="quote-name" className="block text-xs font-body text-ink-700 mb-1.5">ชื่อผู้ติดต่อ <span className="text-red-500">*</span></label><input id="quote-name" autoComplete="name" maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} className={inputClass('name')} placeholder="ชื่อ-นามสกุล" />{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div><div><label htmlFor="quote-company" className="block text-xs font-body text-ink-700 mb-1.5">บริษัท</label><input id="quote-company" autoComplete="organization" maxLength={150} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass('company')} placeholder="ชื่อบริษัท/โรงงาน" /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label htmlFor="quote-phone" className="block text-xs font-body text-ink-700 mb-1.5">เบอร์โทร <span className="text-red-500">*</span></label><input id="quote-phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} aria-invalid={Boolean(errors.phone)} className={inputClass('phone')} placeholder="08X-XXX-XXXX" />{errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}</div><div><label htmlFor="quote-contact" className="block text-xs font-body text-ink-700 mb-1.5">LINE หรือ Email</label><input id="quote-contact" maxLength={254} value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputClass('contact')} placeholder="LINE ID หรือ Email" /></div></div>
              <div><label htmlFor="quote-factory" className="block text-xs font-body text-ink-700 mb-1.5">ประเภทโรงงาน</label><select id="quote-factory" value={form.factory} onChange={e => setForm({ ...form, factory: e.target.value })} className={inputClass('factory')}><option value="">เลือกประเภทโรงงาน...</option>{INDUSTRIES.map(industry => <option key={industry.name}>{industry.name}</option>)}</select></div>
              <div><label htmlFor="quote-system" className="block text-xs font-body text-ink-700 mb-1.5">ระบบที่สนใจ</label><select id="quote-system" value={form.system} onChange={e => setForm({ ...form, system: e.target.value })} className={inputClass('system')}><option value="">เลือกระบบ...</option>{PRODUCTS.map(product => <option key={product.id}>{product.name}</option>)}<option>ไม่แน่ใจ ขอให้แนะนำ</option></select></div>
              <div><label htmlFor="quote-detail" className="block text-xs font-body text-ink-700 mb-1.5">รายละเอียดเบื้องต้น</label><textarea id="quote-detail" maxLength={2000} value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} rows={3} className={`${inputClass('detail')} resize-none`} placeholder="เช่น ปริมาณเชื้อเพลิง พื้นที่ติดตั้ง หรือรายละเอียดอื่น ๆ" /></div>
              <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="quote-website">Website</label><input id="quote-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
              <div className="flex items-start gap-2.5"><input type="checkbox" id="quote-agree" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} aria-invalid={Boolean(errors.agree)} aria-describedby={errors.agree ? 'quote-agree-error' : undefined} className="mt-0.5 h-5 w-5 accent-brand-700" /><label htmlFor="quote-agree" className="text-xs font-body leading-relaxed text-ink-700">ยอมรับ<a href="/privacy-policy" onClick={event => { event.preventDefault(); onPrivacy() }} className="ml-1 text-brand-700 underline">นโยบายความเป็นส่วนตัว</a> และยินยอมให้ติดต่อกลับ</label></div>
              {errors.agree && <p id="quote-agree-error" className="text-xs text-red-600">{errors.agree}</p>}
              <button type="submit" disabled={status === 'loading'} className="w-full bg-energy-600 hover:bg-energy-400 disabled:opacity-60 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">{status === 'loading' ? 'กำลังส่ง...' : 'ส่งขอใบเสนอราคา'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── PRODUCT MODAL ──────────────────────────────── */
function ProductModal({ product: p, onClose, onQuote }: { product: Product; onClose: () => void; onQuote: () => void }) {
  const dialogRef = useDialogFocus(onClose)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="product-title" className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-ink-300 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h3 id="product-title" className="font-heading font-semibold text-ink-950">{p.name}</h3>
          <button onClick={onClose} className="min-w-11 min-h-11 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-700 transition-colors" aria-label="ปิดรายละเอียดสินค้า"><IcoX /></button>
        </div>
        <div className="p-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-ink-100 mb-6">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-brand-700 text-sm font-body font-medium mb-2">{p.subtitle}</p>
          <p className="text-ink-700 text-sm font-body leading-relaxed mb-6">{p.desc}</p>

          <div className="mb-6">
            <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">จุดเด่น</h4>
            <ul className="space-y-2">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-body text-ink-700">
                  <span className="w-5 h-5 rounded-full bg-brand-700/10 text-brand-700 flex items-center justify-center shrink-0 mt-0.5"><IcoCheck /></span>{h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">Specification</h4>
            <div className="rounded-xl border border-ink-300/60 overflow-hidden">
              {p.specs.map((s, i) => (
                <div key={i} className={`flex justify-between px-4 py-3 text-sm font-body ${i % 2 === 0 ? 'bg-white' : 'bg-ink-100/60'}`}>
                  <span className="text-ink-700">{s.label}</span>
                  <span className="font-medium text-ink-950">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div><h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">เชื้อเพลิงที่รองรับ</h4><div className="flex flex-wrap gap-2">{p.fuels.map(fuel => <span key={fuel} className="bg-brand-900/5 text-brand-700 text-xs font-body px-3 py-1.5 rounded-full">{fuel}</span>)}</div></div>
            <div><h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">เหมาะกับ</h4><p className="text-ink-700 text-sm font-body leading-relaxed">โรงงานที่ต้องการใช้ความร้อนอย่างต่อเนื่องและต้องประเมินตามชนิดเชื้อเพลิง พื้นที่ติดตั้ง และกระบวนการผลิตจริง</p></div>
          </div>
          <div className="mb-8 rounded-xl bg-ink-100 p-4"><h4 className="font-heading font-semibold text-ink-950 text-sm mb-2">หลักการทำงาน</h4><p className="text-ink-700 text-sm font-body leading-relaxed">ทีมวิศวกรประเมินเชื้อเพลิง ความต้องการความร้อน และข้อจำกัดของโรงงาน เพื่อนำไปออกแบบระบบ ควบคุมการทำงาน และทดสอบก่อนส่งมอบ</p></div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-ink-300/60">
            <button onClick={onQuote} className="flex-1 bg-energy-600 hover:bg-energy-400 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">ขอใบเสนอราคาสำหรับสินค้านี้</button>
            <span title="รออัปโหลดเอกสารที่ผ่านการตรวจสอบ" className="inline-flex items-center justify-center gap-1.5 border border-ink-300 text-ink-700/60 px-4 py-3 rounded-lg font-body text-sm cursor-not-allowed"><IcoDownload />PDF รออัปโหลด</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── PRODUCTS PAGE ──────────────────────────────── */
function ProductsPage({ setPage, onProduct, onQuote }: { setPage: (p: Page) => void; onProduct: (p: Product) => void; onQuote: (product?: Product) => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ทั้งหมด')
  const [sort, setSort] = useState<'recommended' | 'name-asc' | 'name-desc'>('recommended')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const categories = ['ทั้งหมด', ...Array.from(new Set(PRODUCTS.map(product => product.category)))]
  const normalizedQuery = query.trim().toLocaleLowerCase('th')
  const filteredProducts = PRODUCTS
    .filter(product => {
      const searchable = `${product.name} ${product.subtitle} ${product.desc} ${product.category} ${product.fuels.join(' ')} ${product.highlights.join(' ')}`.toLocaleLowerCase('th')
      return (category === 'ทั้งหมด' || product.category === category) && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
    .sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name, 'th')
      if (sort === 'name-desc') return b.name.localeCompare(a.name, 'th')
      return a.id - b.id
    })
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateQuery = (value: string) => {
    setQuery(value)
    setCurrentPage(1)
  }

  const updateCategory = (value: string) => {
    setCategory(value)
    setCurrentPage(1)
  }

  const updateSort = (value: 'recommended' | 'name-asc' | 'name-desc') => {
    setSort(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('ทั้งหมด')
    setSort('recommended')
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="bg-brand-900 py-14 md:py-18">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 font-body text-xs text-white/50">
            <button onClick={() => setPage({ t: 'home' })} className="transition-colors hover:text-white">หน้าแรก</button>
            <IcoChevron />
            <span className="text-white/80">ผลิตภัณฑ์</span>
          </nav>
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">ระบบและเครื่องจักรอุตสาหกรรม</h1>
              <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-white/70">ค้นหาและเปรียบเทียบเตาแก๊สซิไฟเออร์ ระบบอบแห้ง และเครื่องจักรสำหรับโรงงาน พร้อมรองรับการเพิ่มรุ่นสินค้าในอนาคต</p>
            </div>
            <button onClick={() => onQuote()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-energy-600 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400">
              ขอให้ช่วยเลือกระบบ <IcoArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-10 md:py-14">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
            <aside aria-label="ค้นหาและกรองผลิตภัณฑ์" className="rounded-2xl border border-ink-300/60 bg-white p-4 shadow-sm md:p-5 lg:sticky lg:top-24">
              <h2 className="font-heading text-base font-semibold text-ink-950">ค้นหาผลิตภัณฑ์</h2>
              <div className="mt-4">
                <label htmlFor="product-search" className="sr-only">ค้นหาผลิตภัณฑ์</label>
                <div className="relative">
                  <svg aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                  </svg>
                  <input id="product-search" value={query} onChange={event => updateQuery(event.target.value)} maxLength={120} placeholder="ชื่อสินค้า รุ่น หรือเชื้อเพลิง" className="min-h-12 w-full rounded-xl border border-ink-300 bg-ink-100/50 py-3 pl-11 pr-3 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-700/50 focus:border-brand-700 focus:bg-white" />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="product-sort" className="sr-only">เรียงผลิตภัณฑ์</label>
                <select id="product-sort" value={sort} onChange={event => updateSort(event.target.value as 'recommended' | 'name-asc' | 'name-desc')} className="min-h-12 w-full rounded-xl border border-ink-300 bg-white px-3 py-3 font-body text-sm text-ink-700 outline-none focus:border-brand-700">
                  <option value="recommended">เรียงตามรายการแนะนำ</option>
                  <option value="name-asc">ชื่อสินค้า ก–ฮ / A–Z</option>
                  <option value="name-desc">ชื่อสินค้า ฮ–ก / Z–A</option>
                </select>
              </div>
              <div className="mt-5 border-t border-ink-300/60 pt-5">
                <p className="mb-3 font-body text-xs font-medium text-ink-950">หมวดหมู่</p>
                <div className="flex flex-wrap gap-2 lg:flex-col" aria-label="กรองหมวดหมู่">
                  {categories.map(item => {
                    const count = item === 'ทั้งหมด' ? PRODUCTS.length : PRODUCTS.filter(product => product.category === item).length
                    return <button key={item} onClick={() => updateCategory(item)} aria-pressed={category === item} className={`flex min-h-10 items-center justify-between rounded-xl px-4 py-2 text-left font-body text-xs font-medium transition-colors ${category === item ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-300/60 hover:text-brand-700'}`}><span>{item}</span><span className={category === item ? 'text-white/65' : 'text-ink-700/50'}>{count}</span></button>
                  })}
                </div>
              </div>
              <p aria-live="polite" className="mt-5 border-t border-ink-300/60 pt-4 font-body text-xs text-ink-700">พบ <strong className="text-ink-950">{filteredProducts.length}</strong> รายการ</p>
            </aside>

            <div className="min-w-0">
          {visibleProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {visibleProducts.map(product => (
                <article key={product.id} className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-ink-300/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/25 hover:shadow-lg">
                  <button onClick={() => onProduct(product)} className="relative aspect-[3/2] overflow-hidden bg-ink-100 text-left focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-700" aria-label={`ดูรายละเอียด ${product.name}`}>
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-brand-900/90 px-3 py-1.5 font-body text-xs font-medium text-white backdrop-blur-sm">{product.category}</span>
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <h2 className="font-heading text-lg font-semibold leading-snug text-ink-950">{product.name}</h2>
                      <p className="mt-1 font-body text-sm text-brand-700">{product.subtitle}</p>
                      <p className="mt-3 line-clamp-3 font-body text-xs leading-relaxed text-ink-700">{product.desc}</p>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-center justify-between border-t border-ink-300/60 pt-4">
                        <p className="font-body text-[11px] text-ink-700/60">รองรับเชื้อเพลิง {product.fuels.length} ประเภท</p>
                        <button onClick={() => onProduct(product)} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 font-body text-xs font-medium text-brand-700 hover:bg-brand-50">ดูรายละเอียด <IcoArrowRight /></button>
                      </div>
                      <button onClick={() => onQuote(product)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-energy-600 px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400">ขอใบเสนอราคา</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center">
              <h2 className="font-heading text-lg font-semibold text-ink-950">ไม่พบผลิตภัณฑ์ที่ตรงกับคำค้นหา</h2>
              <p className="mt-2 font-body text-sm text-ink-700">ลองเปลี่ยนคำค้นหาหรือเลือกดูทุกหมวดหมู่</p>
              <button onClick={clearFilters} className="mt-5 min-h-11 rounded-lg border border-brand-700 px-5 py-2.5 font-body text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white">ล้างตัวกรอง</button>
            </div>
          )}

          {pageCount > 1 && (
            <nav aria-label="หน้าผลิตภัณฑ์" className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={currentPage === 1} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-ink-300 bg-white px-4 font-body text-sm text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><IcoChevron right={false} />ก่อนหน้า</button>
              <span aria-current="page" className="inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-4 font-body text-sm font-medium text-white">หน้า {currentPage} จาก {pageCount}</span>
              <button onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-ink-300 bg-white px-4 font-body text-sm text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40">ถัดไป<IcoChevron /></button>
            </nav>
          )}
            </div>
          </div>

          <section className="mt-12 rounded-2xl bg-brand-900 p-7 text-center md:p-10">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-energy-400">Engineering Consultation</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white">ยังไม่แน่ใจว่าระบบไหนเหมาะกับโรงงาน?</h2>
            <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-white/70">กำลังการผลิต ชนิดเชื้อเพลิง พื้นที่ติดตั้ง และกระบวนการเดิมมีผลต่อการเลือกระบบ ส่งข้อมูลเบื้องต้นให้ทีมงานช่วยประเมินได้</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => onQuote()} className="rounded-lg bg-energy-600 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400">ปรึกษาและขอใบเสนอราคา</button>
              <a href={COMPANY.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-white/10"><IcoPhone />โทรปรึกษาทีมงาน</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

/* ─── PROJECTS PAGE ──────────────────────────────── */
function ProjectsPage({ setPage, onQuote }: { setPage: (p: Page) => void; onQuote: () => void }) {
  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="bg-brand-900 py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-body text-xs text-white/50">
            <button onClick={() => setPage({ t: 'home' })} className="transition-colors hover:text-white">หน้าแรก</button>
            <IcoChevron />
            <span className="text-white/80">ผลงาน</span>
          </nav>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">ผลงานของเรา</h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-white/70">ตัวอย่างงานออกแบบ ผลิต และติดตั้งระบบพลังงานชีวมวลและเครื่องจักรอบแห้งสำหรับโรงงานอุตสาหกรรม</p>
        </div>
      </section>

      <section className="bg-ink-100 py-12 md:py-16" aria-labelledby="project-gallery-heading">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <h2 id="project-gallery-heading" className="font-heading text-2xl font-bold text-ink-950">ผลงานติดตั้งบางส่วน</h2>
            <p className="hidden font-body text-xs text-ink-700 sm:block">กดภาพเพื่อดูรายละเอียดโครงการ</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {PROJECTS.map(project => (
              <button key={project.id} type="button" onClick={() => setPage({ t: 'project', p: project })} className="group relative min-h-72 overflow-hidden rounded-2xl bg-brand-900 text-left shadow-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700 md:min-h-[350px]">
                <img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-70" />
                <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2 font-body text-xs text-white/70">
                    <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">{project.industry}</span>
                    <span className="inline-flex items-center gap-1"><IcoMapPin />{project.province}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold leading-snug text-white md:text-xl">{project.name}</h3>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <p className="line-clamp-1 font-body text-xs text-white/60">{project.system}</p>
                    <span className="inline-flex shrink-0 items-center gap-1 font-body text-xs font-medium text-white">ดูรายละเอียด <IcoArrowRight /></span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-brand-900 px-6 py-8 text-center md:flex-row md:px-8 md:text-left">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">มีโครงการที่ต้องการให้ช่วยประเมิน?</h2>
              <p className="mt-2 font-body text-sm text-white/65">ส่งข้อมูลเบื้องต้นให้ทีมวิศวกรแนะนำแนวทางที่เหมาะกับหน้างาน</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button onClick={onQuote} className="min-h-11 rounded-lg bg-energy-600 px-6 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400">ขอประเมินโครงการ</button>
              <a href={COMPANY.phoneHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-white/10"><IcoPhone />โทรปรึกษา</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ─── PROJECT DETAIL PAGE ────────────────────────── */
function ProjectGalleryModal({ project, activeIndex, onChange, onClose }: { project: Project; activeIndex: number; onChange: (index: number) => void; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose)
  const previous = () => onChange((activeIndex - 1 + project.gallery.length) % project.gallery.length)
  const next = () => onChange((activeIndex + 1) % project.gallery.length)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-label="ปิดแกลเลอรี" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`แกลเลอรี ${project.name}`} className="relative w-full max-w-5xl">
        <img src={project.gallery[activeIndex]} alt={`${project.name} ภาพประกอบ ${activeIndex + 1}`} className="mx-auto max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
        <button type="button" onClick={onClose} className="absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80" aria-label="ปิดแกลเลอรี"><IcoX /></button>
        {project.gallery.length > 1 && <>
          <button type="button" onClick={previous} className="absolute left-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80" aria-label="ภาพก่อนหน้า"><IcoChevron right={false} /></button>
          <button type="button" onClick={next} className="absolute right-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80" aria-label="ภาพถัดไป"><IcoChevron /></button>
        </>}
        <p className="mt-3 text-center font-body text-sm text-white/80">ภาพ {activeIndex + 1} จาก {project.gallery.length}</p>
      </div>
    </div>
  )
}

function ProjectDetailPage({ p, setPage, onQuote }: { p: Project; setPage: (page: Page) => void; onQuote: () => void }) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const relatedProduct = PRODUCTS.find(product => product.id === p.relatedProductId)
  const relatedProjects = PROJECTS.filter(project => project.id !== p.id && (project.industry === p.industry || project.relatedProductId === p.relatedProductId)).slice(0, 3)

  return (
    <div className="min-h-screen pt-20">
      <div className="relative h-64 md:h-80 bg-brand-900">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 pb-10 w-full">
            <div className="flex items-center gap-2 text-white/50 text-xs font-body mb-3">
              <button onClick={() => setPage({ t: 'home' })} className="hover:text-white transition-colors">หน้าแรก</button>
              <IcoChevron />
              <button onClick={() => setPage({ t: 'projects' })} className="hover:text-white transition-colors">ผลงาน</button>
              <IcoChevron /><span className="text-white/80 line-clamp-1">{p.name}</span>
            </div>
            <h1 className="font-heading font-bold text-white text-2xl md:text-3xl leading-snug">{p.name}</h1>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[{ l: 'จังหวัด', v: p.province }, { l: 'ประเภทโรงงาน', v: p.industry }, { l: 'ระบบที่ติดตั้ง', v: p.system }, { l: 'ปีที่ติดตั้ง', v: String(p.year) }].map(i => (
            <div key={i.l} className="bg-ink-100 rounded-xl p-4">
              <div className="text-xs font-body text-ink-700 mb-1">{i.l}</div>
              <div className="font-heading font-semibold text-ink-950 text-sm">{i.v}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-ink-300/60 rounded-2xl p-8 mb-6">
          <h2 className="font-heading font-semibold text-ink-950 text-xl mb-4">ภาพรวมโครงการ</h2>
          <p className="text-ink-700 font-body text-sm leading-relaxed">{p.summary}</p>
        </div>

        <section className="mb-8 grid gap-5 md:grid-cols-2" aria-label="รายละเอียดโครงการ">
          <article className="rounded-2xl border border-ink-300/60 bg-white p-6"><p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">โจทย์ของโครงการ</p><h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">ความต้องการของหน้างาน</h2><p className="mt-3 font-body text-sm leading-relaxed text-ink-700">{p.challenge}</p></article>
          <article className="rounded-2xl border border-ink-300/60 bg-white p-6"><p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">แนวทางที่ออกแบบ</p><h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">ระบบและการเชื่อมต่อ</h2><p className="mt-3 font-body text-sm leading-relaxed text-ink-700">{p.solution}</p></article>
          <article className="rounded-2xl bg-ink-100 p-6"><p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">ขอบเขตงาน</p><h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">งานที่ดำเนินการ</h2><ul className="mt-4 space-y-2">{p.scope.map(item => <li key={item} className="flex items-start gap-2 font-body text-sm leading-relaxed text-ink-700"><span className="mt-0.5 text-brand-700"><IcoCheck /></span>{item}</li>)}</ul></article>
          <article className="rounded-2xl bg-brand-900 p-6 text-white"><p className="font-body text-xs font-medium uppercase tracking-widest text-energy-400">สถานะและผลลัพธ์</p><h2 className="mt-2 font-heading text-lg font-semibold">ผลการดำเนินงาน</h2><p className="mt-3 font-body text-sm leading-relaxed text-white/75">{p.result}</p></article>
        </section>

        <section className="mb-8" aria-labelledby="project-gallery-title">
          <div className="flex items-end justify-between gap-4 mb-4"><div><p className="text-brand-700 text-sm font-body font-medium tracking-widest">ภาพประกอบ</p><h2 id="project-gallery-title" className="font-heading font-semibold text-ink-950 text-xl">แกลเลอรีโครงการ</h2></div><p className="text-xs font-body text-ink-700">กดรูปเพื่อดูขนาดใหญ่</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{p.gallery.map((image, index) => <button type="button" key={`${p.id}-${index}`} onClick={() => setGalleryIndex(index)} className="group aspect-[4/3] overflow-hidden rounded-xl bg-ink-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700"><img src={image} alt={`${p.name} ภาพประกอบ ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></button>)}</div>
        </section>

        <section className="mb-8 grid gap-5 lg:grid-cols-2" aria-label="เนื้อหาที่เกี่ยวข้อง">
          {relatedProduct && <article className="overflow-hidden rounded-2xl border border-ink-300/60 bg-white sm:flex"><img src={relatedProduct.image} alt={relatedProduct.name} className="aspect-video w-full object-cover sm:w-44" /><div className="p-5"><p className="font-body text-xs font-medium text-brand-700">สินค้าที่เกี่ยวข้อง</p><h2 className="mt-1 font-heading text-base font-semibold text-ink-950">{relatedProduct.name}</h2><p className="mt-2 font-body text-xs leading-relaxed text-ink-700">{relatedProduct.subtitle}</p></div></article>}
          {relatedProjects.length > 0 && <article className="rounded-2xl border border-ink-300/60 bg-white p-5"><div className="flex items-center justify-between"><div><p className="font-body text-xs font-medium text-brand-700">โครงการที่เกี่ยวข้อง</p><h2 className="mt-1 font-heading text-base font-semibold text-ink-950">ดูผลงานลักษณะใกล้เคียง</h2></div><button type="button" onClick={() => setPage({ t: 'projects' })} className="font-body text-xs font-medium text-brand-700">ดูทั้งหมด</button></div><div className="mt-4 space-y-2">{relatedProjects.map(project => <button type="button" key={project.id} onClick={() => setPage({ t: 'project', p: project })} className="flex w-full items-center justify-between gap-3 rounded-lg bg-ink-100 px-3 py-2.5 text-left font-body text-xs text-ink-700 transition-colors hover:bg-ink-300/60 hover:text-brand-700"><span className="line-clamp-1">{project.name}</span><IcoArrowRight /></button>)}</div></article>}
        </section>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={onQuote} className="flex items-center justify-center gap-2 bg-energy-600 hover:bg-energy-400 text-white px-6 py-3 rounded-lg font-body text-sm font-medium transition-colors">สนใจระบบลักษณะนี้ <IcoArrowRight /></button>
          <a href={COMPANY.phoneHref} className="flex items-center justify-center gap-2 border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-6 py-3 rounded-lg font-body text-sm transition-colors"><IcoPhone />โทรปรึกษาทีมงาน</a>
          <button onClick={() => setPage({ t: 'projects' })} className="flex items-center justify-center gap-2 border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-6 py-3 rounded-lg font-body text-sm transition-colors"><IcoChevron right={false} />กลับผลงานทั้งหมด</button>
        </div>
      </div>
      {galleryIndex !== null && <ProjectGalleryModal project={p} activeIndex={galleryIndex} onChange={setGalleryIndex} onClose={() => setGalleryIndex(null)} />}
    </div>
  )
}

/* ─── NEWS LIST PAGE ─────────────────────────────── */
function NewsListPage({ setPage, onQuote }: { setPage: (p: Page) => void; onQuote: () => void }) {
  const [cat, setCat] = useState('ทั้งหมด')
  const cats = ['ทั้งหมด', ...Array.from(new Set(NEWS.map(article => article.category)))]
  const filtered = cat === 'ทั้งหมด' ? NEWS : NEWS.filter(article => article.category === cat)
  const featured = NEWS[0]

  return (
    <main className="min-h-screen pt-20"><div className="bg-brand-900 py-14"><div className="max-w-[1200px] mx-auto px-5 md:px-8"><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/50 text-xs font-body mb-3"><button onClick={() => setPage({ t: 'home' })} className="hover:text-white transition-colors">หน้าแรก</button><IcoChevron /><span className="text-white/80">ข่าวสาร</span></nav><h1 className="font-heading font-bold text-white text-3xl md:text-4xl">ข่าวสารและบทความ</h1><p className="text-white/70 font-body text-base mt-2">ความรู้ด้านพลังงานชีวมวลและข่าวสารจากยักษ์ใหญ่ 2015</p></div></div>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
        <section aria-labelledby="featured-news-heading" className="mb-10"><p className="text-sm font-body font-medium tracking-widest uppercase text-brand-700">บทความแนะนำ</p><button onClick={() => setPage({ t: 'article', a: featured })} className="group mt-3 grid overflow-hidden rounded-2xl border border-ink-300/60 bg-white text-left md:grid-cols-2 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700"><div className="aspect-video overflow-hidden bg-ink-100"><img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6 md:p-8"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-brand-900/10 px-2.5 py-1 font-body text-xs text-brand-700">{featured.category}</span><span className="font-body text-xs text-ink-700/60">{featured.date}</span></div><h2 id="featured-news-heading" className="mt-4 font-heading text-xl font-semibold leading-snug text-ink-950 group-hover:text-brand-700 md:text-2xl">{featured.title}</h2><p className="mt-3 font-body text-sm leading-relaxed text-ink-700">{featured.excerpt}</p><span className="mt-5 inline-flex items-center gap-1 font-body text-sm font-medium text-brand-700">อ่านบทความ <IcoArrowRight /></span></div></button></section>
        <div className="flex flex-wrap gap-2 mb-8" aria-label="กรองหมวดหมู่">{cats.map(category => <button key={category} onClick={() => setCat(category)} aria-pressed={cat === category} className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${cat === category ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-300/60'}`}>{category}</button>)}</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map(article => <article key={article.id}><button onClick={() => setPage({ t: 'article', a: article })} className="group h-full w-full text-left rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700"><div className="aspect-video bg-ink-100 overflow-hidden"><img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div><div className="p-5"><div className="flex items-center gap-2 mb-3"><span className="bg-brand-500/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{article.category}</span><span className="text-ink-700/60 text-xs font-body">{article.date}</span></div><h2 className="font-heading font-semibold text-ink-950 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">{article.title}</h2><p className="text-ink-700 text-xs font-body leading-relaxed line-clamp-3">{article.excerpt}</p><span className="flex items-center gap-1 text-brand-700 text-xs font-body font-medium mt-4">อ่านเพิ่มเติม <IcoArrowRight /></span></div></button></article>)}</div>
        <section className="mt-12 rounded-2xl bg-ink-100 p-7 text-center"><h2 className="font-heading text-xl font-bold text-ink-950">ต้องการคำแนะนำสำหรับโรงงานของคุณ?</h2><p className="mx-auto mt-2 max-w-xl font-body text-sm text-ink-700">ส่งข้อมูลเบื้องต้นเพื่อให้ทีมวิศวกรช่วยประเมินแนวทางที่เหมาะสม</p><button onClick={onQuote} className="mt-5 rounded-lg bg-energy-600 px-6 py-3 font-body text-sm font-medium text-white hover:bg-energy-400">ขอใบเสนอราคา</button></section>
      </div>
    </main>
  )
}

function ShareActions({ title }: { title: string }) {
  const [copyStatus, setCopyStatus] = useState('')
  const pageUrl = window.location.href
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopyStatus('คัดลอกลิงก์แล้ว')
    } catch {
      setCopyStatus('ไม่สามารถคัดลอกอัตโนมัติได้')
    }
  }

  return (
    <section className="mt-10 border-t border-ink-300 pt-6" aria-labelledby="share-article-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="share-article-title" className="font-heading text-sm font-semibold text-ink-950">แชร์บทความนี้</h2>
        <div className="flex flex-wrap gap-2">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-300 px-3 py-2 text-sm font-body text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700"><IcoFacebook />Facebook</a>
          <a href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-300 px-3 py-2 text-sm font-body text-ink-700 transition-colors hover:border-[#06C755] hover:text-[#068b3f]"><IcoLine />LINE</a>
          <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-300 px-3 py-2 text-sm font-body text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700"><IcoCopy />คัดลอกลิงก์</button>
        </div>
      </div>
      {copyStatus && <p role="status" className="mt-2 text-right font-body text-xs text-brand-700">{copyStatus}</p>}
    </section>
  )
}

/* ─── ARTICLE DETAIL PAGE ────────────────────────── */
function ArticleDetailPage({ a, setPage, onQuote }: { a: Article; setPage: (p: Page) => void; onQuote: () => void }) {
  const related = NEWS.filter(article => article.id !== a.id)
    .sort((left, right) => Number(right.category === a.category) - Number(left.category === a.category))
    .slice(0, 3)

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[800px] mx-auto px-5 md:px-8 py-12">
        <div className="flex items-center gap-2 text-ink-700/60 text-xs font-body mb-6">
          <button onClick={() => setPage({ t: 'home' })} className="hover:text-brand-700 transition-colors">หน้าแรก</button>
          <IcoChevron />
          <button onClick={() => setPage({ t: 'news' })} className="hover:text-brand-700 transition-colors">ข่าวสาร</button>
          <IcoChevron /><span className="text-ink-950 line-clamp-1">{a.title}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-brand-500/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{a.category}</span>
          <span className="text-ink-700/60 text-sm font-body">{a.date}</span>
          <span className="text-ink-700/60 text-sm font-body">· {a.author}</span>
        </div>
        <h1 className="font-heading font-bold text-ink-950 text-2xl md:text-3xl leading-snug mb-6">{a.title}</h1>
        <div className="rounded-xl overflow-hidden aspect-video mb-8 bg-ink-100">
          <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-sm max-w-none font-body text-ink-700 leading-relaxed space-y-4">
          <p className="text-base">{a.excerpt}</p>
          {a.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <ShareActions title={a.title} />

        <section className="mt-12" aria-labelledby="related-articles-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="related-articles-title" className="font-heading text-xl font-semibold text-ink-950">บทความที่เกี่ยวข้อง</h2>
            <button type="button" onClick={() => setPage({ t: 'news' })} className="font-body text-sm font-medium text-brand-700 hover:text-brand-900">ดูทั้งหมด</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {related.map(article => <button key={article.id} type="button" onClick={() => setPage({ t: 'article', a: article })} className="rounded-xl border border-ink-300/70 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-700/40 hover:shadow-md"><span className="font-body text-xs text-brand-700">{article.category}</span><h3 className="mt-2 line-clamp-3 font-heading text-sm font-semibold leading-snug text-ink-950">{article.title}</h3></button>)}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-brand-900 p-6 text-center text-white sm:p-8">
          <h2 className="font-heading text-xl font-semibold">ต้องการประเมินระบบสำหรับโรงงานของคุณ?</h2>
          <p className="mx-auto mt-2 max-w-xl font-body text-sm leading-relaxed text-white/70">ส่งข้อมูลเบื้องต้นให้ทีมงานช่วยแนะนำแนวทางที่เหมาะกับหน้างาน</p>
          <button type="button" onClick={onQuote} className="mt-5 rounded-lg bg-energy-600 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400">ขอใบเสนอราคา</button>
        </section>

        <div className="flex gap-3 mt-10 pt-8 border-t border-ink-300">
          <button onClick={() => setPage({ t: 'news' })} className="flex items-center gap-1.5 border border-ink-300 text-ink-700 hover:border-brand-700 hover:text-brand-700 px-4 py-2.5 rounded-lg font-body text-sm transition-colors">
            <IcoChevron right={false} />บทความทั้งหมด
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── APP ────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteContext, setQuoteContext] = useState<{ product?: string; project?: string }>()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [contactPopup, setContactPopup] = useState<'line' | 'phone' | null>(null)
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))

  const navigate = useCallback((next: Page) => {
    const nextPath = pathForPage(next)
    if (normalizePathname(window.location.pathname) !== nextPath) window.history.pushState({}, '', nextPath)
    setPage(next)
  }, [])

  const openQuote = useCallback((context?: { product?: string; project?: string }) => {
    setQuoteContext(context)
    setQuoteOpen(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    const handlePopState = () => setPage(pageFromPath(window.location.pathname))
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrolled(false)
    document.title = titleForPage(page)
  }, [page])

  useEffect(() => {
    if (page.t !== 'home') return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'))
    if (!sections.length) return

    const reveal = (element: HTMLElement) => element.classList.add('is-revealed')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      sections.forEach((element) => {
        element.classList.add('scroll-reveal')
        reveal(element)
      })
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        reveal(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    sections.forEach((element) => {
      element.classList.add('scroll-reveal')
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [page.t])

  const scrollTo = useCallback((id: string) => {
    if (page.t !== 'home') {
      navigate({ t: 'home' })
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [navigate, page.t])

  if (page.t === 'privacy') return <PrivacyPolicyPage onHome={() => navigate({ t: 'home' })} />
  if (page.t === 'not-found') return <NotFoundPage onHome={() => navigate({ t: 'home' })} />
  if (page.t === 'admin') return <AdminPortal onExit={() => navigate({ t: 'home' })} />

  const isHome = page.t === 'home'
  return (
    <div className="min-h-screen">
      <Header scrolled={scrolled} isHome={isHome} setPage={navigate} onQuote={() => openQuote()} />
      {page.t === 'home' && <>
        <Hero onQuote={() => openQuote()} onProducts={() => navigate({ t: 'products' })} onVideo={HERO_VIDEO_URL ? () => setVideoOpen(true) : undefined} />
        <TrustBar /><About onLearnMore={() => navigate({ t: 'products' })} /><Products onProduct={setSelectedProduct} onQuote={() => openQuote()} onViewAll={() => navigate({ t: 'products' })} /><Industries /><WhyUs /><FeaturedProjects setPage={navigate} /><LatestNews setPage={navigate} /><QuoteCTA onQuote={() => openQuote()} /><Contact onPrivacy={() => navigate({ t: 'privacy' })} />
      </>}
      {page.t === 'products' && <ProductsPage setPage={navigate} onProduct={setSelectedProduct} onQuote={product => openQuote(product ? { product: product.name } : undefined)} />}
      {page.t === 'projects' && <ProjectsPage setPage={navigate} onQuote={() => openQuote()} />}
      {page.t === 'project' && <ProjectDetailPage p={page.p} setPage={navigate} onQuote={() => openQuote({ project: page.p.name })} />}
      {page.t === 'news' && <NewsListPage setPage={navigate} onQuote={() => openQuote()} />}
      {page.t === 'downloads' && <DownloadsPage onHome={() => navigate({ t: 'home' })} onQuote={() => openQuote()} />}
      {page.t === 'article' && <ArticleDetailPage a={page.a} setPage={navigate} onQuote={() => openQuote()} />}
      <Footer scrollTo={scrollTo} setPage={navigate} onPrivacy={() => navigate({ t: 'privacy' })} />
      <div className="pb-14 md:pb-0"><FloatingActions onQuote={() => openQuote()} onPhone={() => setContactPopup('phone')} onLine={() => setContactPopup('line')} /></div>
      {quoteOpen && <QuoteModal context={quoteContext} onClose={() => { setQuoteOpen(false); setQuoteContext(undefined) }} onPrivacy={() => navigate({ t: 'privacy' })} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onQuote={() => { setSelectedProduct(null); openQuote({ product: selectedProduct.name }) }} />}
      {videoOpen && HERO_VIDEO_URL && <VideoModal url={HERO_VIDEO_URL} onClose={() => setVideoOpen(false)} />}
      {contactPopup === 'line' && <LineContactModal onClose={() => setContactPopup(null)} />}
      {contactPopup === 'phone' && <PhoneContactModal onClose={() => setContactPopup(null)} />}
    </div>
  )
}
