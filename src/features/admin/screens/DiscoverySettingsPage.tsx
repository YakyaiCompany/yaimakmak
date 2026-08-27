import { FormEvent, useEffect, useState } from "react";
import { DiscoverySettings } from "../types";
import { PageHeading } from "../components/PageHeading";
import { focusRing } from "../utils";

export function DiscoverySettingsPage({ settings, onChange }: { settings: DiscoverySettings; onChange: (settings: DiscoverySettings) => Promise<unknown> }) {
  const [draft, setDraft] = useState(settings);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setDraft(settings), [settings]);
  const update = (patch: Partial<DiscoverySettings>) => { setNotice(""); setError(""); setDraft((current) => ({ ...current, ...patch })); };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true); setError(""); setNotice("");
    try { await onChange(draft); setNotice("บันทึกการตั้งค่าแล้ว"); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : "ไม่สามารถบันทึกการตั้งค่าได้"); }
    finally { setIsSaving(false); }
  };

  return <div className="space-y-6">
    <PageHeading eyebrow="ตั้งค่าครั้งเดียว" title="การค้นหาและการแชร์" />
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><h2 className="font-semibold">บันทึกค่าใน CMS แล้ว</h2><p className="mt-1">ค่านี้เก็บในหลังบ้านและใช้เป็นแหล่งข้อมูลกลาง แต่เว็บไซต์ปัจจุบันเป็น Vite แบบ static จึงยังไม่เปลี่ยน meta tag ที่ crawler อ่านโดยอัตโนมัติ ต้องเพิ่มขั้นตอน build/deploy หรือ SSR ก่อนจึงจะมีผลกับ Google, LINE และ Facebook จริง</p></section>
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{error}</p>}
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">ข้อมูลหลักสำหรับผลการค้นหา</h2><div className="mt-5 grid gap-5"><Field label="ชื่อเว็บไซต์" value={draft.siteTitle} onChange={(value) => update({ siteTitle: value })} /><TextArea label="คำอธิบายเว็บไซต์" value={draft.siteDescription} onChange={(value) => update({ siteDescription: value })} /><Field label="URL หลักของเว็บไซต์" type="url" value={draft.siteUrl} onChange={(value) => update({ siteUrl: value })} /></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">ข้อความเมื่อแชร์ลิงก์</h2><div className="mt-5 grid gap-5"><Field label="ชื่อบนการ์ดแชร์" value={draft.shareTitle} onChange={(value) => update({ shareTitle: value })} /><TextArea label="คำอธิบายบนการ์ดแชร์" value={draft.shareDescription} onChange={(value) => update({ shareDescription: value })} /><Field label="ลิงก์ภาพสำหรับแชร์" type="url" value={draft.shareImage} onChange={(value) => update({ shareImage: value })} /></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">การยืนยันและการจัดทำดัชนี</h2><div className="mt-5 grid gap-5"><Field label="Google verification" value={draft.googleVerification} onChange={(value) => update({ googleVerification: value })} /><label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={draft.allowIndexing} onChange={(event) => update({ allowIndexing: event.target.checked })} className="h-4 w-4 accent-brand-700" />อนุญาตให้ search engine จัดทำดัชนี</label></div></section>
      </div>
      <aside className="h-fit space-y-5 xl:sticky xl:top-6"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-900">ตัวอย่างในผลการค้นหา</h2><p className="mt-4 truncate text-xs text-emerald-700">{draft.siteUrl || "https://example.com"}</p><p className="mt-1 text-lg font-medium leading-6 text-blue-700">{draft.siteTitle || "ชื่อเว็บไซต์"}</p><p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{draft.siteDescription || "คำอธิบายเว็บไซต์"}</p></section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="aspect-[1.91/1] bg-slate-100">{draft.shareImage ? <img src={draft.shareImage} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">ภาพสำหรับการแชร์</div>}</div><div className="p-4"><p className="font-semibold text-slate-900">{draft.shareTitle || "ชื่อบนการ์ดแชร์"}</p><p className="mt-1 text-sm text-slate-500">{draft.shareDescription || "คำอธิบายบนการ์ดแชร์"}</p></div></section><button type="submit" disabled={isSaving} className={`w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50 ${focusRing}`}>{isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}</button></aside>
    </form>
  </div>;
}

function Field({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>;
}
