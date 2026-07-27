import { useState } from "react"
import { DOWNLOADS, type DownloadCategory } from "../data/downloads"

interface DownloadsPageProps {
  onHome: () => void
  onQuote: () => void
}

function ArrowIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0-4 4m4-4H3" /></svg>
}

function DownloadIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" /></svg>
}

export default function DownloadsPage({ onHome, onQuote }: DownloadsPageProps) {
  const [category, setCategory] = useState<"ทั้งหมด" | DownloadCategory>("ทั้งหมด")
  const categories: Array<"ทั้งหมด" | DownloadCategory> = ["ทั้งหมด", "ข้อมูลบริษัท", "สินค้า", "โบรชัวร์"]
  const documents = category === "ทั้งหมด" ? DOWNLOADS : DOWNLOADS.filter((document) => document.category === category)

  return (
    <main className="min-h-screen pt-20">
      <section className="bg-brand-900 py-14">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 font-body text-xs text-white/50">
            <button type="button" onClick={onHome} className="rounded hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-energy-400">หน้าแรก</button>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">ดาวน์โหลด</span>
          </nav>
          <p className="font-body text-sm font-medium tracking-widest text-energy-400">เอกสารสำหรับประกอบการตัดสินใจ</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">เอกสารและแคตตาล็อก</h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-white/75">รวบรวมข้อมูลบริษัท แคตตาล็อกสินค้า และเอกสาร specification เพื่อใช้ศึกษาระบบเบื้องต้น</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-16" aria-labelledby="documents-heading">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="font-body text-sm font-medium tracking-widest text-brand-700">คลังเอกสาร</p><h2 id="documents-heading" className="mt-2 font-heading text-2xl font-bold text-ink-950">เลือกเอกสารที่ต้องการ</h2></div>
          <p className="font-body text-sm text-ink-700">แสดง {documents.length} เอกสาร</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2" aria-label="กรองเอกสารตามประเภท">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full px-4 py-2 font-body text-sm transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700 ${category === item ? "bg-brand-700 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-300/60"}`}>{item}</button>)}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => <article key={document.id} className="flex flex-col rounded-2xl border border-ink-300/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4"><div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 font-heading text-xs font-bold text-red-600">PDF</div><div className="min-w-0"><p className="font-body text-xs font-medium text-brand-700">{document.category}</p><h3 className="mt-1 font-heading text-base font-semibold leading-snug text-ink-950">{document.name}</h3><p className="mt-2 font-body text-xs text-ink-700">{document.type} · {document.size} · อัปเดต {document.updated}</p></div></div>
            <div className="mt-5 border-t border-ink-300/70 pt-4">
              {document.href ? <a href={document.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-brand-900"><DownloadIcon />ดาวน์โหลดเอกสาร</a> : <div><span className="flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-ink-100 px-4 py-2.5 font-body text-sm font-medium text-ink-700/60" title="รออัปโหลดไฟล์ที่ผ่านการอนุมัติ"><DownloadIcon />รออัปโหลดเอกสาร</span><p className="mt-2 text-center font-body text-xs text-ink-700/70">ไฟล์จะปรากฏเมื่อผ่านการตรวจสอบแล้ว</p></div>}
            </div>
          </article>)}
        </div>
      </section>

      <section className="bg-ink-100"><div className="mx-auto max-w-[1200px] px-5 py-12 text-center md:px-8"><h2 className="font-heading text-2xl font-bold text-ink-950">ต้องการข้อมูลที่เฉพาะกับโรงงานของคุณ?</h2><p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink-700">ส่งรายละเอียดเบื้องต้นให้ทีมวิศวกรช่วยประเมินระบบ พร้อมแนะนำเอกสารที่เหมาะกับการตัดสินใจ</p><button type="button" onClick={onQuote} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-energy-600 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-energy-400 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-energy-600">ขอใบเสนอราคา <ArrowIcon /></button></div></section>
    </main>
  )
}
