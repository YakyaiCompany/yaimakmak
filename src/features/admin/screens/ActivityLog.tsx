import { useState, useMemo } from "react";
import { ContentActivity, Screen, ActivityAction, ActivityContentType } from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { focusRing } from "../utils";

export function ActivityLog({ activities, onNavigate }: { activities: ContentActivity[]; onNavigate: (screen: Screen) => void }) {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<ActivityAction | "ทั้งหมด">("ทั้งหมด");
  const [typeFilter, setTypeFilter] = useState<ActivityContentType | "ทั้งหมด">("ทั้งหมด");
  const filtered = useMemo(() => activities.filter((activity) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || activity.title.toLowerCase().includes(search) || activity.contentType.toLowerCase().includes(search);
    const matchesAction = actionFilter === "ทั้งหมด" || activity.action === actionFilter;
    const matchesType = typeFilter === "ทั้งหมด" || activity.contentType === typeFilter;
    return matchesQuery && matchesAction && matchesType;
  }), [activities, query, actionFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Content history" title="ประวัติการเปลี่ยนแปลง" />
      <p className="-mt-3 text-sm text-slate-500">ตรวจสอบว่าเนื้อหาใดถูกเพิ่ม แก้ไข เผยแพร่ ยกเลิกเผยแพร่ หรือลบ โดยเรียงรายการล่าสุดก่อนเสมอ</p>
      <section className="grid gap-3 sm:grid-cols-3">
        {[{ label: "การเปลี่ยนแปลงทั้งหมด", value: activities.length }, { label: "เพิ่มหรือแก้ไข", value: activities.filter((item) => item.action === "เพิ่ม" || item.action === "แก้ไข").length }, { label: "เผยแพร่หรือลบ", value: activities.filter((item) => item.action === "เผยแพร่" || item.action === "ลบ").length }].map((item) => <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{item.label}</p><p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p></article>)}
      </section>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_190px]">
        <label><span className="sr-only">ค้นหาประวัติ</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อเนื้อหาหรือประเภท..." className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm ${focusRing}`} /></label>
        <label><span className="sr-only">กรองการเปลี่ยนแปลง</span><select value={actionFilter} onChange={(event) => setActionFilter(event.target.value as ActivityAction | "ทั้งหมด")} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium shadow-sm ${focusRing}`}><option>ทั้งหมด</option><option>เพิ่ม</option><option>แก้ไข</option><option>เผยแพร่</option><option>กำหนดเผยแพร่</option><option>ยกเลิกเผยแพร่</option><option>ลบ</option></select></label>
        <label><span className="sr-only">กรองประเภทเนื้อหา</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ActivityContentType | "ทั้งหมด")} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium shadow-sm ${focusRing}`}><option>ทั้งหมด</option><option>ผลงาน</option><option>ข่าวสาร</option><option>สินค้า</option><option>เอกสาร</option></select></label>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {filtered.map((activity) => <article key={activity.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div className="flex min-w-0 flex-1 items-start gap-3"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${activity.id === activities[0]?.id ? "bg-energy-600 ring-4 ring-energy-600/10" : "bg-slate-300"}`} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><ActivityBadge action={activity.action} /><span className="text-xs font-medium text-slate-500">{activity.contentType}</span>{activity.id === activities[0]?.id && <span className="rounded-full bg-energy-600/10 px-2 py-0.5 text-[11px] font-semibold text-energy-600">ล่าสุด</span>}</div><h2 className="mt-2 text-sm font-semibold text-slate-800">{activity.title}</h2><p className="mt-1 text-xs text-slate-500">{activity.at} · {activity.actor}</p></div></div><button type="button" onClick={() => onNavigate(activity.screen)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>เปิดรายการ</button></article>)}
          {!filtered.length && <p className="px-6 py-12 text-center text-sm text-slate-500">ไม่พบประวัติที่ตรงกับตัวกรอง</p>}
        </div>
        <div className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-500">แสดง {filtered.length} จาก {activities.length} รายการ</div>
      </section>
    </div>
  );
}
