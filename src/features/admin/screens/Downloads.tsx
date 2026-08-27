import { FormEvent, useState } from "react";
import { DownloadItem, ContentActivity } from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { focusRing } from "../utils";

type NewDocument = { title: string; slug: string; category: string; description: string; file: File };

export function Downloads({ documents, latestActivity, onAddDocument, onToggleStatus }: {
  documents: DownloadItem[];
  latestActivity?: ContentActivity;
  onAddDocument: (document: NewDocument) => Promise<void>;
  onToggleStatus: (document: DownloadItem) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", category: "เอกสารทั่วไป", description: "", file: null as File | null });

  const addDocument = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.file) { setError("กรุณาเลือกไฟล์ PDF"); return; }
    setError("");
    setIsSaving(true);
    try {
      await onAddDocument({ title: form.title, slug: form.slug, category: form.category, description: form.description, file: form.file });
      setForm({ title: "", slug: "", category: "เอกสารทั่วไป", description: "", file: null });
      setIsOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "ไม่สามารถเพิ่มเอกสารได้");
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="คลังเอกสาร" title="เอกสารดาวน์โหลด">
        <button type="button" onClick={() => { setError(""); setIsOpen(true); }} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เพิ่มเอกสาร</button>
      </PageHeading>
      <p className="-mt-3 text-sm text-slate-500">อัปโหลด PDF ก่อนสร้างรายการ เอกสารจึงจะมีไฟล์ให้ผู้เข้าชมดาวน์โหลดได้จริง</p>
      {latestActivity && <section className="flex flex-col gap-3 rounded-2xl border border-energy-600/20 bg-energy-600/[0.06] px-4 py-3.5 sm:flex-row sm:items-center"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-energy-600 ring-4 ring-energy-600/10" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-energy-600">เปลี่ยนแปลงล่าสุด</span><ActivityBadge action={latestActivity.action} /></div><p className="mt-1 truncate text-sm font-semibold text-slate-800">{latestActivity.title}</p><p className="mt-0.5 text-xs text-slate-500">{latestActivity.at} · {latestActivity.actor}</p></div></section>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{documents.map((document) => <article key={document.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-sm font-semibold text-slate-800">{document.name}</h2>{!document.fileUrl && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">ยังไม่มีไฟล์</span>}{latestActivity?.contentId === document.id && <span className="rounded-full bg-energy-600/10 px-2 py-0.5 text-[11px] font-semibold text-energy-600">ล่าสุด</span>}</div><p className="mt-1 text-sm text-slate-500">{document.category} · อัปเดต {document.updatedAt}</p></div><StatusBadge status={document.status} /><button type="button" disabled={!document.fileUrl} onClick={() => void onToggleStatus(document)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto ${focusRing}`}>{document.status === "เผยแพร่" ? "ยกเลิกเผยแพร่" : "เผยแพร่"}</button></article>)}{!documents.length && <p className="px-6 py-10 text-center text-sm text-slate-500">ยังไม่มีเอกสาร</p>}</div></section>

      {isOpen && <div className="fixed inset-0 z-50 grid place-items-center p-4"><button type="button" onClick={() => !isSaving && setIsOpen(false)} className="absolute inset-0 bg-slate-950/50" aria-label="ปิด" /><form onSubmit={addDocument} className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-900">เพิ่มเอกสารดาวน์โหลด</h2><p className="mt-1 text-sm text-slate-500">รองรับ PDF ขนาดไม่เกิน 10 MB</p></div><button type="button" onClick={() => !isSaving && setIsOpen(false)} className={`rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 ${focusRing}`}>ปิด</button></div>{error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}<div className="mt-5 space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ชื่อเอกสาร</span><input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">URL ของเอกสาร</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value.toLowerCase() }))} placeholder="gasifier-catalog" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /><span className="mt-1 block text-xs text-slate-500">ใช้ตัวอักษรอังกฤษ ตัวเลข และขีดกลาง</span></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">หมวดหมู่</span><input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">คำอธิบาย</span><textarea rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ไฟล์ PDF</span><input required accept="application/pdf" type="file" onChange={(event) => setForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} className={`block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={isSaving} onClick={() => setIsOpen(false)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 ${focusRing}`}>ยกเลิก</button><button type="submit" disabled={isSaving} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50 ${focusRing}`}>{isSaving ? "กำลังอัปโหลด..." : "อัปโหลดและบันทึก"}</button></div></form></div>}
    </div>
  );
}
