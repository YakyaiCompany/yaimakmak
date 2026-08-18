import { DownloadItem, ContentActivity } from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { focusRing } from "../utils";

export function Downloads({ documents, latestActivity, onAddDocument, onToggleStatus }: { documents: DownloadItem[]; latestActivity?: ContentActivity; onAddDocument: () => void; onToggleStatus: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="คลังเอกสาร" title="เอกสารดาวน์โหลด">
        <button type="button" onClick={onAddDocument} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เพิ่มเอกสาร</button>
      </PageHeading>
      <p className="-mt-3 text-sm text-slate-500">จัดการโบรชัวร์ แคตตาล็อก ข้อมูลจำเพาะ และเอกสารที่เปิดให้ดาวน์โหลดบนเว็บไซต์</p>
      {latestActivity && <section className="flex flex-col gap-3 rounded-2xl border border-energy-600/20 bg-energy-600/[0.06] px-4 py-3.5 sm:flex-row sm:items-center"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-energy-600 ring-4 ring-energy-600/10" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-energy-600">เปลี่ยนแปลงล่าสุด</span><ActivityBadge action={latestActivity.action} /></div><p className="mt-1 truncate text-sm font-semibold text-slate-800">{latestActivity.title}</p><p className="mt-0.5 text-xs text-slate-500">{latestActivity.at} · {latestActivity.actor}</p></div></section>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {documents.map((document) => (
            <article key={document.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-sm font-semibold text-slate-800">{document.name}</h2>{latestActivity?.contentId === document.id && <span className="rounded-full bg-energy-600/10 px-2 py-0.5 text-[11px] font-semibold text-energy-600">ล่าสุด</span>}</div><p className="mt-1 text-sm text-slate-500">{document.category} · อัปเดต {document.updatedAt}</p></div>
              <StatusBadge status={document.status} />
              <button type="button" onClick={() => onToggleStatus(document.id)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>{document.status === "เผยแพร่" ? "ยกเลิกเผยแพร่" : "เผยแพร่"}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
