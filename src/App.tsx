import { useState, useEffect } from 'react'

/* ─── TYPES ───────────────────────────────── */
interface Product {
  id: number; name: string; subtitle: string; desc: string
  image: string; highlights: string[]; specs: { label: string; value: string }[]; fuels: string[]
}
interface Project {
  id: number; name: string; province: string; industry: string
  year: number; system: string; image: string
}
interface Article {
  id: number; title: string; category: string; date: string; excerpt: string; image: string
}
type Page = { t: 'home' } | { t: 'projects' } | { t: 'news' } | { t: 'project'; p: Project } | { t: 'article'; a: Article }

/* ─── DATA ───────────────────────────────── */
const PRODUCTS: Product[] = [
  {
    id: 1, name: 'เตาแก๊สซิไฟเออร์ 1.5 MW', subtitle: 'สำหรับโรงงานอุตสาหกรรมขนาดใหญ่',
    desc: 'ระบบผลิตแก๊สชีวมวลกำลังสูง ออกแบบสำหรับโรงงานที่ต้องการพลังงานความร้อนสูงอย่างต่อเนื่อง รองรับเชื้อเพลิงหลายชนิด ควบคุมอัตโนมัติด้วย PLC',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=420&fit=crop&auto=format',
    highlights: ['กำลังผลิตความร้อน 1,500 kW', 'ระบบควบคุม PLC อัตโนมัติ', 'รองรับเชื้อเพลิงหลากหลาย'],
    specs: [{ label: 'กำลังผลิต', value: '1,500 kW' }, { label: 'ประสิทธิภาพ', value: '> 85%' }, { label: 'แรงดันแก๊ส', value: '500–2,000 Pa' }, { label: 'อุณหภูมิแก๊สออก', value: '< 60°C' }],
    fuels: ['แกลบ', 'ไม้สับ', 'ชานอ้อย', 'กะลามะพร้าว'],
  },
  {
    id: 2, name: 'เตาแก๊สซิไฟเออร์ 750 kW', subtitle: 'สำหรับ SME และโรงงานขนาดกลาง',
    desc: 'ระบบแก๊สซิไฟเออร์ขนาดกลางสำหรับโรงงานที่ต้องการลดต้นทุนพลังงาน ติดตั้งง่าย ใช้พื้นที่น้อย และคืนทุนเร็ว',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=420&fit=crop&auto=format',
    highlights: ['กำลังผลิตความร้อน 750 kW', 'ขนาดกะทัดรัด ติดตั้งง่าย', 'ลดต้นทุนพลังงาน 40–60%'],
    specs: [{ label: 'กำลังผลิต', value: '750 kW' }, { label: 'ประสิทธิภาพ', value: '> 82%' }, { label: 'แรงดันแก๊ส', value: '300–1,500 Pa' }, { label: 'อุณหภูมิแก๊สออก', value: '< 65°C' }],
    fuels: ['แกลบ', 'ไม้สับ', 'เศษไม้', 'วัสดุเหลือทิ้ง'],
  },
  {
    id: 3, name: 'Cassava Pulp Rotary Dryer', subtitle: 'ระบบอบแห้งกากแป้งมันสำปะหลัง',
    desc: 'ระบบอบแห้งแบบหมุนสำหรับกากมันสำปะหลัง ออกแบบใช้ร่วมกับระบบแก๊สซิไฟเออร์ ลดความชื้นสินค้าและเพิ่มมูลค่าผลิตภัณฑ์',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=420&fit=crop&auto=format',
    highlights: ['ลดความชื้นจาก 80% เหลือ < 14%', 'ใช้ความร้อนจากแก๊สซิไฟเออร์ได้โดยตรง', 'กำลังการผลิต 5–20 ตัน/ชั่วโมง'],
    specs: [{ label: 'กำลังการผลิต', value: '5–20 ตัน/ชม.' }, { label: 'ความชื้นขาออก', value: '< 14%' }, { label: 'อุณหภูมิอบ', value: '120–200°C' }, { label: 'เส้นผ่าศูนย์กลาง', value: '1.2–2.4 ม.' }],
    fuels: ['แก๊สชีวมวล', 'LPG', 'ฟืน', 'น้ำมัน'],
  },
]

const PROJECTS: Project[] = [
  { id: 1, name: 'ระบบแก๊สซิไฟเออร์ 1.5 MW โรงงานอบปุ๋ย', province: 'นครราชสีมา', industry: 'โรงงานอบปุ๋ย', year: 2023, system: 'Gasifier 1.5 MW', image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=540&fit=crop&auto=format' },
  { id: 2, name: 'ระบบอบแห้งกากมัน 10 ตัน/ชม.', province: 'กำแพงเพชร', industry: 'โรงงานมันสำปะหลัง', year: 2022, system: 'Rotary Dryer + Gasifier 750 kW', image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=540&fit=crop&auto=format' },
  { id: 3, name: 'ระบบทดแทน LPG โรงงานเซรามิก', province: 'ลำปาง', industry: 'โรงงานเซรามิก', year: 2023, system: 'Gasifier 750 kW', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=540&fit=crop&auto=format' },
  { id: 4, name: 'ระบบผลิตความร้อนโรงงานอบแร่', province: 'เชียงราย', industry: 'โรงงานอบแร่', year: 2022, system: 'Gasifier 1.5 MW', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=540&fit=crop&auto=format' },
  { id: 5, name: 'ระบบอบทรายก่อสร้างขนาดกลาง', province: 'ขอนแก่น', industry: 'โรงงานอบทราย', year: 2023, system: 'Gasifier 750 kW', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=540&fit=crop&auto=format' },
  { id: 6, name: 'ระบบอบแห้งยิปซัม โรงงานวัสดุก่อสร้าง', province: 'สระบุรี', industry: 'โรงงานยิปซัม', year: 2021, system: 'Gasifier 1.5 MW', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&h=540&fit=crop&auto=format' },
]

const NEWS: Article[] = [
  { id: 1, title: 'เปรียบเทียบต้นทุน LPG กับระบบแก๊สซิไฟเออร์ชีวมวล', category: 'พลังงานชีวมวล', date: '15 กรกฎาคม 2568', excerpt: 'การเปลี่ยนจาก LPG มาใช้แก๊สชีวมวลสามารถลดต้นทุนพลังงานได้อย่างมีนัยสำคัญ บทความนี้เปรียบเทียบต้นทุนและระยะเวลาคืนทุนสำหรับโรงงานขนาดต่าง ๆ', image: 'https://images.unsplash.com/photo-1466611653911-0265b1e9046b?w=600&h=400&fit=crop&auto=format' },
  { id: 2, title: 'ส่งมอบระบบอบแห้งกากมันสำปะหลัง จ.กำแพงเพชร', category: 'ผลงานติดตั้ง', date: '3 มิถุนายน 2568', excerpt: 'ยักษ์ใหญ่ 2015 ส่งมอบระบบอบแห้งกากมันสำปะหลัง กำลังการผลิต 10 ตัน/ชม. พร้อมทดสอบและอบรมพนักงานเรียบร้อย', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&h=400&fit=crop&auto=format' },
  { id: 3, title: 'หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวลแบบง่าย', category: 'ความรู้', date: '20 พฤษภาคม 2568', excerpt: 'อธิบายหลักการแปลงชีวมวลเป็นแก๊สเชื้อเพลิงด้วยกระบวนการแก๊สซิฟิเคชัน พร้อมแผนภาพขั้นตอนการทำงาน', image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=600&h=400&fit=crop&auto=format' },
  { id: 4, title: 'การบำรุงรักษาระบบแก๊สซิไฟเออร์เพื่อประสิทธิภาพสูงสุด', category: 'การบำรุงรักษา', date: '5 เมษายน 2568', excerpt: 'แนะนำแผนการบำรุงรักษาระบบแก๊สซิไฟเออร์รายวัน รายเดือน และรายปี เพื่อให้ระบบทำงานได้เต็มประสิทธิภาพตลอดอายุการใช้งาน', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&auto=format' },
  { id: 5, title: 'เชื้อเพลิงชีวมวลในประเทศไทย: ชนิดและคุณสมบัติ', category: 'ความรู้', date: '18 มีนาคม 2568', excerpt: 'รวบรวมข้อมูลเชื้อเพลิงชีวมวลหลักที่ใช้ในอุตสาหกรรมไทย ได้แก่ แกลบ ไม้สับ ชานอ้อย และกะลามะพร้าว พร้อมค่าความร้อน', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format' },
  { id: 6, title: 'งานออกบูธ Subcon Thailand 2025 ณ ศูนย์การประชุมไบเทค', category: 'ข่าวบริษัท', date: '2 มีนาคม 2568', excerpt: 'บริษัทยักษ์ใหญ่ 2015 ร่วมออกบูธแสดงนวัตกรรมระบบแก๊สซิไฟเออร์และระบบอบแห้งชีวมวลในงาน Subcon Thailand 2025', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&auto=format' },
]

const DOWNLOADS = [
  { id: 1, name: 'Company Profile', type: 'PDF', size: '2.4 MB', updated: 'มิ.ย. 2568' },
  { id: 2, name: 'Product Catalog', type: 'PDF', size: '5.8 MB', updated: 'มิ.ย. 2568' },
  { id: 3, name: 'Gasifier Specification Sheet', type: 'PDF', size: '1.2 MB', updated: 'เม.ย. 2568' },
  { id: 4, name: 'Rotary Dryer Specification', type: 'PDF', size: '980 KB', updated: 'เม.ย. 2568' },
  { id: 5, name: 'Company Brochure', type: 'PDF', size: '3.1 MB', updated: 'ม.ค. 2568' },
]

const INDUSTRIES = [
  { name: 'โรงงานอบปุ๋ย', icon: '🌿', desc: 'ระบบความร้อนสำหรับการอบปุ๋ยอินทรีย์และเคมี' },
  { name: 'โรงงานอบแร่', icon: '⛏️', desc: 'เตาความร้อนสำหรับการอบแร่และแปรรูปแร่' },
  { name: 'โรงงานมันสำปะหลัง', icon: '🌾', desc: 'ระบบอบกากมันและผลิตภัณฑ์แป้ง' },
  { name: 'โรงงานอบทราย', icon: '🏗️', desc: 'ความร้อนสำหรับอบทรายก่อสร้างและอุตสาหกรรม' },
  { name: 'โรงงานอบยิปซัม', icon: '🔩', desc: 'ระบบควบคุมอุณหภูมิสำหรับกระบวนการยิปซัม' },
  { name: 'แปรรูปผลผลิตเกษตร', icon: '🌽', desc: 'อบแห้งข้าว พืชผล และวัตถุดิบการเกษตร' },
  { name: 'เปลี่ยนจาก LPG', icon: '🔥', desc: 'ทดแทน LPG หรือน้ำมันเตาด้วยชีวมวล' },
  { name: 'ผู้ประกอบการ SME', icon: '🏭', desc: 'ระบบขนาดเล็กคุ้มค่าสำหรับโรงงานขนาดกลาง-เล็ก' },
]

const SERVICES = [
  { step: '01', title: 'ให้คำปรึกษา', desc: 'ทีมวิศวกรให้คำแนะนำเบื้องต้นเกี่ยวกับความเป็นไปได้และแนวทางระบบ' },
  { step: '02', title: 'สำรวจและเก็บข้อมูล', desc: 'ลงพื้นที่สำรวจโรงงาน วิเคราะห์ชนิดเชื้อเพลิงและปริมาณความร้อนที่ต้องการ' },
  { step: '03', title: 'ออกแบบระบบ', desc: 'วิเคราะห์เชื้อเพลิง ปริมาณความร้อน พื้นที่ติดตั้ง และข้อจำกัดกระบวนการผลิต' },
  { step: '04', title: 'ผลิตเครื่องจักร', desc: 'ผลิตด้วยมาตรฐานงานวิศวกรรมพร้อมควบคุมคุณภาพทุกขั้นตอน' },
  { step: '05', title: 'ติดตั้ง', desc: 'ทีมช่างผู้เชี่ยวชาญติดตั้งและเดินระบบตามแบบที่ออกแบบไว้' },
  { step: '06', title: 'ทดสอบและอบรม', desc: 'ทดสอบระบบในสภาพจริง พร้อมอบรมพนักงานให้ใช้งานได้อย่างถูกต้อง' },
  { step: '07', title: 'บริการหลังการขาย', desc: 'ดูแลและบำรุงรักษาต่อเนื่อง พร้อมทีมซ่อมบำรุงตลอดอายุการใช้งาน' },
]

const WHY_US = [
  { icon: '◎', title: 'ออกแบบเฉพาะโครงการ', desc: 'ทุกระบบออกแบบตามความต้องการของโรงงานนั้น ๆ ไม่ใช่รูปแบบสำเร็จรูป' },
  { icon: '◈', title: 'ให้คำปรึกษาก่อนเริ่มงาน', desc: 'วิศวกรลงพื้นที่สำรวจและประเมินความเป็นไปได้ก่อนเสนอราคาทุกครั้ง' },
  { icon: '◉', title: 'ติดตั้งพร้อมทดสอบจริง', desc: 'ส่งมอบพร้อมทดสอบในสภาพการผลิตจริงและแก้ไขจนระบบทำงานสมบูรณ์' },
  { icon: '◐', title: 'ดูแลหลังการขาย', desc: 'บริการบำรุงรักษาและซ่อมแซมต่อเนื่อง พร้อมอะไหล่และทีมช่างที่พร้อมให้บริการ' },
]

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
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

/* ─── LOGO ───────────────────────────────────────── */
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-heading font-bold ${light ? 'bg-white/20 text-white' : 'bg-brand-900 text-white'}`}>YY</div>
      <div>
        <div className={`font-heading font-semibold text-sm leading-tight ${light ? 'text-white' : 'text-brand-900'}`}>ยักษ์ใหญ่ 2015</div>
        <div className={`text-[10px] leading-tight tracking-wide ${light ? 'text-white/60' : 'text-ink-700'}`}>Industrial Biomass Engineering</div>
      </div>
    </div>
  )
}

/* ─── HEADER ─────────────────────────────────────── */
function Header({ scrolled, setPage, onQuote }: { scrolled: boolean; setPage: (p: Page) => void; onQuote: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLight = !scrolled

  const navLinks = [
    { label: 'หน้าแรก', id: 'hero' },
    { label: 'เกี่ยวกับเรา', id: 'about' },
    { label: 'สินค้า', id: 'products' },
    { label: 'บริการ', id: 'services' },
  ]

  const scrollTo = (id: string) => {
    setPage({ t: 'home' })
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
    setMobileOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 md:h-18 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="cursor-pointer">
            <Logo light={isLight} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
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
            <button onClick={() => scrollTo('contact')}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${isLight ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-ink-700 hover:text-brand-900 hover:bg-ink-100'}`}>
              ติดต่อเรา
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={onQuote} className="hidden lg:flex items-center gap-2 bg-energy-600 hover:bg-energy-400 text-white text-sm font-body px-4 py-2.5 rounded-lg transition-colors duration-200">
              ขอใบเสนอราคา
            </button>
            <button onClick={() => setMobileOpen(true)} className={`lg:hidden p-2 rounded-lg ${isLight ? 'text-white' : 'text-ink-950'}`}>
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
              <button onClick={() => setMobileOpen(false)} className="p-2 text-ink-700 hover:text-ink-950"><IcoX /></button>
            </div>
            <nav className="flex-1 p-5 flex flex-col gap-1">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">{l.label}</button>
              ))}
              <button onClick={() => { setPage({ t: 'projects' }); setMobileOpen(false) }} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ผลงาน</button>
              <button onClick={() => { setPage({ t: 'news' }); setMobileOpen(false) }} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ข่าวสาร</button>
              <button onClick={() => scrollTo('contact')} className="text-left px-4 py-3 text-ink-700 hover:text-brand-900 hover:bg-ink-100 rounded-lg text-sm font-body transition-colors">ติดต่อเรา</button>
            </nav>
            <div className="p-5 border-t border-ink-300 flex flex-col gap-3">
              <button onClick={() => { onQuote(); setMobileOpen(false) }} className="w-full bg-energy-600 text-white py-3 rounded-lg text-sm font-body font-medium">ขอใบเสนอราคา</button>
              <a href="tel:+66812345678" className="w-full flex items-center justify-center gap-2 border border-brand-700 text-brand-700 py-3 rounded-lg text-sm font-body font-medium hover:bg-brand-700 hover:text-white transition-colors">
                <IcoPhone />โทรหาเรา
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── HERO ───────────────────────────────────────── */
function Hero({ onQuote, onProducts }: { onQuote: () => void; onProducts: () => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-brand-900">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop&auto=format" alt="โรงงานอุตสาหกรรม" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-900/40" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 pt-24 pb-20 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
            Industrial Biomass Solution
          </div>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl lg:text-[56px] leading-[1.2] mb-5">
            ระบบเตาแก๊สซิไฟเออร์<br />และเครื่องจักรอบแห้ง<br />
            <span className="text-brand-500">สำหรับโรงงานอุตสาหกรรม</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg font-body leading-relaxed mb-8 max-w-lg">
            ออกแบบ ผลิต ติดตั้ง และทดสอบระบบพลังงานชีวมวล ให้เหมาะกับกระบวนการผลิตของแต่ละโรงงาน
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button onClick={onQuote} className="flex items-center justify-center gap-2 bg-energy-600 hover:bg-energy-400 text-white px-6 py-3.5 rounded-lg font-body font-medium text-sm transition-all duration-200 hover:scale-[1.02]">
              ขอใบเสนอราคา <IcoArrowRight />
            </button>
            <button onClick={onProducts} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 rounded-lg font-body font-medium text-sm transition-colors duration-200">
              ดูสินค้าและบริการ
            </button>
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
  const items = [
    { icon: '⚙️', label: 'ออกแบบตามความต้องการ' },
    { icon: '🏗️', label: 'ผลิตและติดตั้งครบวงจร' },
    { icon: '✅', label: 'ทดสอบก่อนส่งมอบ' },
    { icon: '🔧', label: 'บริการหลังการขาย' },
  ]
  return (
    <section className="bg-brand-700">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {items.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 py-2 ${i < 3 ? 'md:border-r md:border-white/20 md:pr-8' : ''} ${i > 0 ? 'md:pl-8' : ''}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-white/90 text-sm font-body font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ABOUT ──────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-ink-100">
              <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&h=520&fit=crop&auto=format" alt="ทีมงานยักษ์ใหญ่ 2015" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-brand-900 text-white rounded-xl p-4 shadow-xl hidden md:block">
              <div className="font-heading font-bold text-2xl">10+</div>
              <div className="text-white/70 text-xs font-body">ปีประสบการณ์</div>
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
                { n: '50+', l: 'โครงการที่เสร็จสมบูรณ์' },
                { n: '15+', l: 'จังหวัดทั่วประเทศ' },
                { n: '3', l: 'รุ่นผลิตภัณฑ์หลัก' },
                { n: '24/7', l: 'บริการหลังการขาย' },
              ].map(s => (
                <div key={s.n} className="bg-ink-100 rounded-xl p-4">
                  <div className="font-heading font-bold text-brand-700 text-2xl">{s.n}</div>
                  <div className="text-ink-700 text-xs font-body mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── PRODUCTS ───────────────────────────────────── */
function Products({ onProduct, onQuote }: { onProduct: (p: Product) => void; onQuote: () => void }) {
  return (
    <section id="products" className="py-20 md:py-28 bg-ink-100">
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
      </div>
    </section>
  )
}

/* ─── INDUSTRIES ─────────────────────────────────── */
function Industries() {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">อุตสาหกรรมที่รองรับ</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">ระบบเหมาะกับโรงงานประเภทใดบ้าง</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              className={`rounded-xl p-5 border transition-all duration-250 cursor-default ${hovered === i ? 'bg-brand-900 border-brand-900 -translate-y-1 shadow-lg' : 'bg-white border-ink-300/60 hover:border-ink-300'}`}>
              <div className={`text-2xl mb-3 transition-all duration-250 ${hovered === i ? 'grayscale-0' : ''}`}>{ind.icon}</div>
              <h4 className={`font-heading font-semibold text-sm mb-1.5 transition-colors ${hovered === i ? 'text-white' : 'text-ink-950'}`}>{ind.name}</h4>
              <p className={`text-xs font-body leading-relaxed transition-colors ${hovered === i ? 'text-white/70' : 'text-ink-700'}`}>{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SERVICES ───────────────────────────────────── */
function Services() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section id="services" className="py-20 md:py-28 bg-ink-100">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">กระบวนการทำงาน</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">บริการครบวงจรตั้งแต่เริ่มต้นจนส่งมอบ</h2>
        </div>
        {/* Desktop timeline */}
        <div className="hidden md:block">
          <div className="flex items-start relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-ink-300" />
            {SERVICES.map((s, i) => (
              <div key={i} className="flex-1 px-3 cursor-pointer group" onClick={() => setActive(active === i ? null : i)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-semibold border-2 mb-4 transition-all duration-200 relative z-10 mx-auto ${active === i ? 'bg-brand-700 border-brand-700 text-white' : 'bg-white border-ink-300 text-ink-700 group-hover:border-brand-700 group-hover:text-brand-700'}`}>
                  {s.step}
                </div>
                <h4 className={`font-heading font-semibold text-center text-sm mb-2 transition-colors ${active === i ? 'text-brand-700' : 'text-ink-950'}`}>{s.title}</h4>
                {active === i && <p className="text-ink-700 text-xs font-body text-center leading-relaxed">{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>
        {/* Mobile timeline */}
        <div className="md:hidden space-y-4">
          {SERVICES.map((s, i) => (
            <div key={i} className={`rounded-xl border transition-all duration-200 overflow-hidden ${active === i ? 'border-brand-700 bg-white' : 'border-ink-300/60 bg-white'}`}>
              <button className="w-full flex items-center gap-4 p-4 text-left" onClick={() => setActive(active === i ? null : i)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-semibold shrink-0 transition-colors ${active === i ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-700'}`}>{s.step}</div>
                <span className={`font-heading font-semibold text-sm ${active === i ? 'text-brand-700' : 'text-ink-950'}`}>{s.title}</span>
                <span className={`ml-auto text-ink-300 transition-transform duration-200 ${active === i ? 'rotate-90' : ''}`}><IcoChevron /></span>
              </button>
              {active === i && <div className="px-4 pb-4 text-sm font-body text-ink-700 leading-relaxed">{s.desc}</div>}
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
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ทำไมต้องเลือกเรา</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">จุดที่ทำให้เราแตกต่าง</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((w, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-ink-300/60 hover:border-brand-700/30 hover:bg-brand-900/[0.02] transition-all duration-300">
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
    <section className="py-20 md:py-28 bg-ink-100">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ผลงาน</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">ผลงานที่ผ่านมา</h2>
          </div>
          <button onClick={() => setPage({ t: 'projects' })} className="flex items-center gap-2 text-brand-700 text-sm font-body font-medium hover:text-brand-900 transition-colors self-start md:self-auto">
            ดูผลงานทั้งหมด <IcoArrowRight />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <div key={p.id} onClick={() => setPage({ t: 'project', p })}
              className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="aspect-[16/9] bg-ink-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className="bg-brand-900/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{p.industry}</span>
                </div>
                <h3 className="font-heading font-semibold text-ink-950 text-sm leading-snug mb-3">{p.name}</h3>
                <div className="flex items-center justify-between text-xs font-body text-ink-700">
                  <div className="flex items-center gap-1"><IcoMapPin />{p.province}</div>
                  <div>{p.year}</div>
                </div>
                <div className="text-xs text-ink-700 font-body mt-1.5 pt-3 border-t border-ink-300/60">{p.system}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── LATEST NEWS ────────────────────────────────── */
function LatestNews({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-20 md:py-28">
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
            <article key={a.id} onClick={() => setPage({ t: 'article', a })}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                <div className="flex items-center gap-1 text-brand-700 text-xs font-body font-medium mt-4">อ่านเพิ่มเติม <IcoArrowRight /></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── DOWNLOADS ──────────────────────────────────── */
function Downloads() {
  return (
    <section className="py-20 md:py-28 bg-ink-100">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ดาวน์โหลด</div>
          <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25]">เอกสารและแคตตาล็อก</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOWNLOADS.map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-ink-300/60 p-4 flex items-center gap-4 hover:border-brand-700/40 hover:shadow-sm transition-all duration-200">
              <div className="w-10 h-12 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-red-600 text-xs font-heading font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-ink-950 text-sm truncate">{d.name}</div>
                <div className="text-ink-700 text-xs font-body mt-0.5">{d.size} · อัปเดต {d.updated}</div>
              </div>
              <button className="shrink-0 w-8 h-8 rounded-lg bg-brand-900/5 hover:bg-brand-700 hover:text-white text-brand-700 flex items-center justify-center transition-colors">
                <IcoDownload />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── QUOTE CTA ──────────────────────────────────── */
function QuoteCTA({ onQuote }: { onQuote: () => void }) {
  return (
    <section className="py-20 md:py-24 bg-brand-900 relative overflow-hidden">
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
          <a href="tel:+66812345678" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-lg font-body font-medium text-sm transition-colors">
            <IcoPhone />โทรปรึกษา
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', topic: '', message: '', agree: false })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1500)
  }

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="text-brand-700 text-sm font-body font-medium uppercase tracking-widest mb-3">ติดต่อเรา</div>
            <h2 className="font-heading font-bold text-ink-950 text-3xl md:text-[36px] leading-[1.25] mb-6">พร้อมให้คำปรึกษาทุกวัน</h2>
            <div className="space-y-4 text-ink-700 font-body">
              {[
                { icon: <IcoMapPin />, label: 'ที่อยู่', val: '123 ถนนอุตสาหกรรม ต.เมือง อ.เมือง จ.นครราชสีมา 30000' },
                { icon: <IcoPhone />, label: 'โทรศัพท์', val: '081-234-5678' },
                { icon: <IcoMail />, label: 'อีเมล', val: 'info@yakyai2015.co.th' },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-900/5 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">{c.icon}</div>
                  <div>
                    <div className="text-xs text-ink-700/60 mb-0.5">{c.label}</div>
                    <div className="text-sm text-ink-950">{c.val}</div>
                  </div>
                </div>
              ))}
              <div className="mt-2 text-sm">
                <span className="text-ink-700/60 text-xs block mb-0.5">เวลาทำการ</span>
                จันทร์–ศุกร์ 08:00–17:00 น.
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink-300/60 rounded-2xl p-6 md:p-8">
            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600"><IcoCheck /></div>
                <h3 className="font-heading font-semibold text-ink-950 text-xl mb-2">ส่งข้อมูลเรียบร้อยแล้ว</h3>
                <p className="text-ink-700 text-sm font-body">ทีมงานจะติดต่อกลับตามช่องทางที่คุณให้ไว้ภายใน 1 วันทำการ</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-brand-700 text-sm font-body hover:underline">ส่งข้อมูลใหม่</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-ink-700 mb-1.5">ชื่อ <span className="text-red-500">*</span></label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="ชื่อของคุณ" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-ink-700 mb-1.5">ชื่อบริษัท</label>
                    <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="ชื่อบริษัท" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-ink-700 mb-1.5">เบอร์โทร <span className="text-red-500">*</span></label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="08X-XXX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-ink-700 mb-1.5">Email หรือ LINE</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="email@company.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">หัวข้อที่สนใจ</label>
                  <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors bg-white">
                    <option value="">เลือกหัวข้อ...</option>
                    <option>เตาแก๊สซิไฟเออร์ 1.5 MW</option>
                    <option>เตาแก๊สซิไฟเออร์ 750 kW</option>
                    <option>Cassava Pulp Rotary Dryer</option>
                    <option>ขอใบเสนอราคา</option>
                    <option>สอบถามข้อมูลทั่วไป</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">ข้อความ</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors resize-none" placeholder="รายละเอียดเพิ่มเติม..." />
                </div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" id="agree" checked={form.agree} onChange={e => setForm({...form, agree: e.target.checked})} className="mt-0.5 w-4 h-4 accent-brand-700" />
                  <label htmlFor="agree" className="text-xs font-body text-ink-700 leading-relaxed">ยอมรับ<a href="#" className="text-brand-700 underline">นโยบายความเป็นส่วนตัว</a> และยินยอมให้ติดต่อกลับ</label>
                </div>
                <button type="submit" disabled={status === 'loading' || !form.agree} className="w-full bg-brand-700 hover:bg-brand-900 disabled:opacity-60 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">
                  {status === 'loading' ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 rounded-2xl overflow-hidden bg-ink-100 border border-ink-300/60 h-48 flex items-center justify-center">
          <div className="text-center text-ink-700/60">
            <IcoMapPin />
            <p className="text-sm font-body mt-2">นครราชสีมา ประเทศไทย</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────── */
function Footer({ scrollTo, setPage }: { scrollTo: (id: string) => void; setPage: (p: Page) => void }) {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Logo light />
            <p className="text-white/60 text-sm font-body leading-relaxed mt-4 mb-5">ผู้เชี่ยวชาญระบบแก๊สซิไฟเออร์ชีวมวลและเครื่องจักรอบแห้งสำหรับโรงงานอุตสาหกรรม</p>
            <div className="flex gap-3">
              {['FB', 'LINE', 'YT'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-heading font-bold text-white/70 hover:text-white transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-sm mb-4">เมนูหลัก</h5>
            <ul className="space-y-2.5">
              {[['หน้าแรก', 'hero'], ['เกี่ยวกับเรา', 'about'], ['สินค้า', 'products'], ['บริการ', 'services']].map(([l, id]) => (
                <li key={l}><button onClick={() => scrollTo(id)} className="text-white/60 hover:text-white text-sm font-body transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-sm mb-4">ข้อมูลเพิ่มเติม</h5>
            <ul className="space-y-2.5">
              <li><button onClick={() => setPage({ t: 'projects' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">ผลงาน</button></li>
              <li><button onClick={() => setPage({ t: 'news' })} className="text-white/60 hover:text-white text-sm font-body transition-colors">ข่าวสาร</button></li>
              <li><button onClick={() => scrollTo('contact')} className="text-white/60 hover:text-white text-sm font-body transition-colors">ติดต่อเรา</button></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm font-body transition-colors">ดาวน์โหลด</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-sm mb-4">ติดต่อ</h5>
            <ul className="space-y-3 text-white/60 text-sm font-body">
              <li className="flex gap-2 items-start"><IcoMapPin />123 ถนนอุตสาหกรรม นครราชสีมา</li>
              <li className="flex gap-2 items-center"><IcoPhone cls="w-4 h-4 shrink-0" />081-234-5678</li>
              <li className="flex gap-2 items-center"><IcoMail />info@yakyai2015.co.th</li>
              <li className="text-xs pt-1">จ.–ศ. 08:00–17:00 น.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs font-body">© 2568 บริษัท ยักษ์ใหญ่ 2015 จำกัด สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white/70 text-xs font-body transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="text-white/40 hover:text-white/70 text-xs font-body transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── FLOATING ACTIONS ───────────────────────────── */
function FloatingActions({ onQuote }: { onQuote: () => void }) {
  return (
    <>
      {/* Desktop: bottom-right */}
      <div className="hidden md:flex fixed bottom-6 right-6 flex-col gap-2.5 z-40">
        <a href="https://line.me" target="_blank" rel="noopener" className="w-12 h-12 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all font-heading font-bold text-xs">LINE</a>
        <a href="tel:+66812345678" className="w-12 h-12 rounded-full bg-brand-700 hover:bg-brand-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"><IcoPhone /></a>
        <button onClick={onQuote} className="w-12 h-12 rounded-full bg-energy-600 hover:bg-energy-400 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all text-xs font-heading font-bold leading-tight text-center">ราคา</button>
      </div>
      {/* Mobile: sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-300 flex">
        <a href="tel:+66812345678" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-brand-700 text-xs font-body"><IcoPhone cls="w-5 h-5" />โทรหาเรา</a>
        <a href="https://line.me" target="_blank" rel="noopener" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[#06C755] text-xs font-body"><span className="font-bold text-sm">LINE</span>LINE</a>
        <button onClick={onQuote} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 bg-energy-600 text-white text-xs font-body"><IcoArrowRight />ขอใบเสนอราคา</button>
      </div>
    </>
  )
}

/* ─── QUOTE MODAL ────────────────────────────────── */
function QuoteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', contact: '', factory: '', system: '', detail: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-ink-300 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h3 className="font-heading font-semibold text-ink-950 text-lg">ขอใบเสนอราคา</h3>
            <p className="text-ink-700 text-xs font-body mt-0.5">ทีมวิศวกรจะติดต่อกลับภายใน 1 วันทำการ</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-700 transition-colors"><IcoX /></button>
        </div>
        <div className="p-5">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
              <h4 className="font-heading font-semibold text-ink-950 text-xl mb-2">ส่งข้อมูลเรียบร้อยแล้ว</h4>
              <p className="text-ink-700 text-sm font-body mb-6">ทีมงานจะติดต่อกลับโดยเร็ว</p>
              <button onClick={onClose} className="bg-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-body">ปิด</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">ชื่อผู้ติดต่อ <span className="text-red-500">*</span></label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="ชื่อ-นามสกุล" />
                </div>
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">บริษัท</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="ชื่อบริษัท/โรงงาน" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">เบอร์โทร <span className="text-red-500">*</span></label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="08X-XXX-XXXX" />
                </div>
                <div>
                  <label className="block text-xs font-body text-ink-700 mb-1.5">LINE หรือ Email</label>
                  <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors" placeholder="LINE ID หรือ Email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-body text-ink-700 mb-1.5">ประเภทโรงงาน</label>
                <select value={form.factory} onChange={e => setForm({...form, factory: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors bg-white">
                  <option value="">เลือกประเภทโรงงาน...</option>
                  {INDUSTRIES.map(i => <option key={i.name}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-body text-ink-700 mb-1.5">ระบบที่สนใจ</label>
                <select value={form.system} onChange={e => setForm({...form, system: e.target.value})} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors bg-white">
                  <option value="">เลือกระบบ...</option>
                  {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
                  <option>ไม่แน่ใจ ขอให้แนะนำ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-body text-ink-700 mb-1.5">รายละเอียดเบื้องต้น</label>
                <textarea value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} rows={3} className="w-full border border-ink-300 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-700 transition-colors resize-none" placeholder="เช่น ปริมาณเชื้อเพลิง พื้นที่ติดตั้ง หรือรายละเอียดอื่น ๆ" />
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full bg-energy-600 hover:bg-energy-400 disabled:opacity-60 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">
                {status === 'loading' ? 'กำลังส่ง...' : 'ส่งขอใบเสนอราคา'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── PRODUCT MODAL ──────────────────────────────── */
function ProductModal({ product: p, onClose, onQuote }: { product: Product; onClose: () => void; onQuote: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-ink-300 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h3 className="font-heading font-semibold text-ink-950">{p.name}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-700 transition-colors"><IcoX /></button>
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

          <div className="mb-8">
            <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">เชื้อเพลิงที่รองรับ</h4>
            <div className="flex flex-wrap gap-2">
              {p.fuels.map(f => <span key={f} className="bg-brand-900/5 text-brand-700 text-xs font-body px-3 py-1.5 rounded-full">{f}</span>)}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-ink-300/60">
            <button onClick={onQuote} className="flex-1 bg-energy-600 hover:bg-energy-400 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors">ขอใบเสนอราคาสำหรับสินค้านี้</button>
            <button className="flex items-center gap-1.5 border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-4 py-3 rounded-lg font-body text-sm transition-colors"><IcoDownload />PDF</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── PROJECTS PAGE ──────────────────────────────── */
function ProjectsPage({ setPage, onQuote }: { setPage: (p: Page) => void; onQuote: () => void }) {
  const [filter, setFilter] = useState('ทั้งหมด')
  const industries = ['ทั้งหมด', ...Array.from(new Set(PROJECTS.map(p => p.industry)))]
  const filtered = filter === 'ทั้งหมด' ? PROJECTS : PROJECTS.filter(p => p.industry === filter)

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-brand-900 py-14">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 text-white/50 text-xs font-body mb-3">
            <button onClick={() => setPage({ t: 'home' })} className="hover:text-white transition-colors">หน้าแรก</button>
            <IcoChevron /><span className="text-white/80">ผลงาน</span>
          </div>
          <h1 className="font-heading font-bold text-white text-3xl md:text-4xl">ผลงานของเรา</h1>
          <p className="text-white/70 font-body text-base mt-2">โครงการที่ออกแบบ ผลิต และติดตั้งทั่วประเทศไทย</p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {industries.map(ind => (
            <button key={ind} onClick={() => setFilter(ind)}
              className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${filter === ind ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-300/60'}`}>
              {ind}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} onClick={() => setPage({ t: 'project', p })}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[16/9] bg-ink-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="bg-brand-900/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{p.industry}</span>
                <h3 className="font-heading font-semibold text-ink-950 text-sm leading-snug mt-2 mb-3 group-hover:text-brand-700 transition-colors">{p.name}</h3>
                <div className="flex items-center justify-between text-xs font-body text-ink-700">
                  <div className="flex items-center gap-1"><IcoMapPin />{p.province}</div>
                  <span>{p.year}</span>
                </div>
                <div className="text-xs text-ink-700 font-body pt-3 mt-2 border-t border-ink-300/60">{p.system}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-brand-900 rounded-2xl p-8 text-center">
          <h3 className="font-heading font-bold text-white text-xl mb-3">สนใจระบบลักษณะเดียวกัน?</h3>
          <p className="text-white/70 font-body text-sm mb-6">ติดต่อทีมวิศวกรเพื่อประเมินระบบที่เหมาะกับโรงงานของคุณ</p>
          <button onClick={onQuote} className="bg-energy-600 hover:bg-energy-400 text-white px-6 py-3 rounded-lg font-body text-sm font-medium transition-colors">ขอใบเสนอราคา</button>
        </div>
      </div>
    </div>
  )
}

/* ─── PROJECT DETAIL PAGE ────────────────────────── */
function ProjectDetailPage({ p, setPage, onQuote }: { p: Project; setPage: (page: Page) => void; onQuote: () => void }) {
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
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[{ l: 'จังหวัด', v: p.province }, { l: 'ประเภทโรงงาน', v: p.industry }, { l: 'ระบบที่ติดตั้ง', v: p.system }, { l: 'ปีที่ติดตั้ง', v: String(p.year) }].map(i => (
            <div key={i.l} className="bg-ink-100 rounded-xl p-4">
              <div className="text-xs font-body text-ink-700 mb-1">{i.l}</div>
              <div className="font-heading font-semibold text-ink-950 text-sm">{i.v}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-ink-300/60 rounded-2xl p-8 mb-6">
          <h2 className="font-heading font-semibold text-ink-950 text-xl mb-4">ภาพรวมโครงการ</h2>
          <p className="text-ink-700 font-body text-sm leading-relaxed">โครงการนี้เป็นการติดตั้งระบบ {p.system} สำหรับ{p.industry} ใน{p.province} ออกแบบเฉพาะตามกระบวนการผลิตของโรงงาน โดยทีมวิศวกรของยักษ์ใหญ่ 2015 ดูแลตั้งแต่การสำรวจ ออกแบบ ผลิต ติดตั้ง จนถึงทดสอบและอบรมพนักงาน</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={onQuote} className="flex items-center justify-center gap-2 bg-energy-600 hover:bg-energy-400 text-white px-6 py-3 rounded-lg font-body text-sm font-medium transition-colors">สนใจระบบลักษณะนี้ <IcoArrowRight /></button>
          <button onClick={() => setPage({ t: 'projects' })} className="flex items-center justify-center gap-2 border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white px-6 py-3 rounded-lg font-body text-sm transition-colors"><IcoChevron right={false} />กลับผลงานทั้งหมด</button>
        </div>
      </div>
    </div>
  )
}

/* ─── NEWS LIST PAGE ─────────────────────────────── */
function NewsListPage({ setPage }: { setPage: (p: Page) => void }) {
  const [cat, setCat] = useState('ทั้งหมด')
  const cats = ['ทั้งหมด', 'ความรู้', 'ผลงานติดตั้ง', 'พลังงานชีวมวล', 'ข่าวบริษัท', 'การบำรุงรักษา']
  const filtered = cat === 'ทั้งหมด' ? NEWS : NEWS.filter(a => a.category === cat)

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-brand-900 py-14">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 text-white/50 text-xs font-body mb-3">
            <button onClick={() => setPage({ t: 'home' })} className="hover:text-white transition-colors">หน้าแรก</button>
            <IcoChevron /><span className="text-white/80">ข่าวสาร</span>
          </div>
          <h1 className="font-heading font-bold text-white text-3xl md:text-4xl">ข่าวสารและบทความ</h1>
          <p className="text-white/70 font-body text-base mt-2">ความรู้ด้านพลังงานชีวมวลและข่าวสารจากยักษ์ใหญ่ 2015</p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${cat === c ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-300/60'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => (
            <article key={a.id} onClick={() => setPage({ t: 'article', a })}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-ink-300/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[16/9] bg-ink-100 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-brand-500/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">{a.category}</span>
                  <span className="text-ink-700/60 text-xs font-body">{a.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-ink-950 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">{a.title}</h3>
                <p className="text-ink-700 text-xs font-body leading-relaxed line-clamp-3">{a.excerpt}</p>
                <div className="flex items-center gap-1 text-brand-700 text-xs font-body font-medium mt-4">อ่านเพิ่มเติม <IcoArrowRight /></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── ARTICLE DETAIL PAGE ────────────────────────── */
function ArticleDetailPage({ a, setPage }: { a: Article; setPage: (p: Page) => void }) {
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
        </div>
        <h1 className="font-heading font-bold text-ink-950 text-2xl md:text-3xl leading-snug mb-6">{a.title}</h1>
        <div className="rounded-xl overflow-hidden aspect-video mb-8 bg-ink-100">
          <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-sm max-w-none font-body text-ink-700 leading-relaxed space-y-4">
          <p className="text-base">{a.excerpt}</p>
          <p>ระบบแก๊สซิไฟเออร์ชีวมวลเป็นเทคโนโลยีที่ได้รับการพิสูจน์แล้วในระดับอุตสาหกรรม โดยแปลงชีวมวลแข็ง เช่น แกลบ ไม้สับ หรือชานอ้อย ให้กลายเป็นแก๊สเชื้อเพลิงที่สามารถนำมาใช้ผลิตความร้อนหรือไฟฟ้าได้</p>
          <p>การลงทุนในระบบแก๊สซิไฟเออร์โดยทั่วไปมีระยะเวลาคืนทุน 2–4 ปี ขึ้นอยู่กับขนาดระบบ ราคาเชื้อเพลิงชีวมวลในพื้นที่ และปริมาณการใช้งาน</p>
        </div>
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [page, setPage] = useState<Page>({ t: 'home' })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page.t])

  const scrollTo = (id: string) => {
    if (page.t !== 'home') {
      setPage({ t: 'home' })
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      <Header scrolled={scrolled} setPage={setPage} onQuote={() => setQuoteOpen(true)} />

      {page.t === 'home' && (
        <>
          <Hero onQuote={() => setQuoteOpen(true)} onProducts={() => scrollTo('products')} />
          <TrustBar />
          <About />
          <Products onProduct={setSelectedProduct} onQuote={() => setQuoteOpen(true)} />
          <Industries />
          <Services />
          <WhyUs />
          <FeaturedProjects setPage={setPage} />
          <LatestNews setPage={setPage} />
          <Downloads />
          <QuoteCTA onQuote={() => setQuoteOpen(true)} />
          <Contact />
          <Footer scrollTo={scrollTo} setPage={setPage} />
        </>
      )}

      {page.t === 'projects' && <ProjectsPage setPage={setPage} onQuote={() => setQuoteOpen(true)} />}
      {page.t === 'project' && <ProjectDetailPage p={(page as { t: 'project'; p: Project }).p} setPage={setPage} onQuote={() => setQuoteOpen(true)} />}
      {page.t === 'news' && <NewsListPage setPage={setPage} />}
      {page.t === 'article' && <ArticleDetailPage a={(page as { t: 'article'; a: Article }).a} setPage={setPage} />}

      {page.t !== 'home' && (
        <footer className="bg-brand-900 py-6 text-center">
          <p className="text-white/40 text-xs font-body">© 2568 บริษัท ยักษ์ใหญ่ 2015 จำกัด</p>
        </footer>
      )}

      <div className="pb-14 md:pb-0">
        <FloatingActions onQuote={() => setQuoteOpen(true)} />
      </div>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onQuote={() => { setSelectedProduct(null); setQuoteOpen(true) }} />}
    </div>
  )
}
