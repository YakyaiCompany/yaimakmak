import { useEffect, useMemo, useState } from "react";
import { ContentActivity, ContentItem, DemoMessage, DownloadItem, Screen } from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { focusRing } from "../utils";
import { getJson } from "../../../lib/api";

type AnalyticsData = {
  status: "connected" | "unconfigured" | "unavailable";
  message?: string;
  range: "7d" | "28d" | "90d";
  visitors: number | null;
  sessions: number | null;
  views: number | null;
  leads: number;
  visitorsDelta: number | null;
  sessionsDelta: number | null;
  viewsDelta: number | null;
  leadsDelta: number | null;
  daily: Array<{ date: string; visitors: number; views: number }>;
  trafficSources: Array<{ label: string; sessions: number }>;
  topPages: Array<{ path: string; views: number; engagementRate: number | null }>;
  conversions: Array<{ eventName: string; count: number }>;
};

const emptyAnalytics: AnalyticsData = {
  status: "unconfigured", range: "28d", visitors: null, sessions: null, views: null,
  leads: 0, visitorsDelta: null, sessionsDelta: null, viewsDelta: null, leadsDelta: null,
  daily: [], trafficSources: [], topPages: [], conversions: [],
};

const eventLabels: Record<string, string> = {
  generate_lead: "ส่งแบบฟอร์มติดต่อ",
  click_line: "กดเปิด LINE",
  click_phone: "กดดูเบอร์โทร",
  click_facebook: "กดเปิด Facebook",
};

const sourceColors = ["bg-brand-700", "bg-blue-500", "bg-violet-500", "bg-energy-600", "bg-slate-500"];

function number(value: number | null) {
  return value === null ? "—" : value.toLocaleString("th-TH");
}

function delta(value: number | null) {
  return value === null ? "—" : `${value > 0 ? "+" : ""}${value}%`;
}

export function Dashboard({ portfolio, news, products, messages, documents, activities, onNavigate }: {
  portfolio: ContentItem[];
  news: ContentItem[];
  products: ContentItem[];
  messages: DemoMessage[];
  documents: DownloadItem[];
  activities: ContentActivity[];
  onNavigate: (screen: Screen) => void;
}) {
  const [range, setRange] = useState<"7" | "28" | "90">("28");
  const [chartMetric, setChartMetric] = useState<"visitors" | "views">("visitors");
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");
    getJson<{ data: AnalyticsData }>(`/api/v1/admin/analytics?range=${range}`)
      .then((response) => { if (active) setAnalytics(response.data); })
      .catch(() => { if (active) setLoadError("ไม่สามารถโหลดข้อมูลสถิติได้ กรุณาลองใหม่อีกครั้ง"); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [range]);

  const chartValues = analytics.daily.map((day) => chartMetric === "visitors" ? day.visitors : day.views);
  const chartMax = Math.max(1, ...chartValues);
  const sourceTotal = analytics.trafficSources.reduce((total, source) => total + source.sessions, 0);
  const conversionTotal = analytics.conversions.reduce((total, event) => total + event.count, 0);
  const publishedCount = [...portfolio, ...news, ...products].filter((item) => item.status === "เผยแพร่").length;
  const draftsCount = [...portfolio, ...news, ...products].filter((item) => item.status !== "เผยแพร่").length;
  const unreadCount = messages.filter((message) => message.status === "ใหม่").length;
  const publishedDocuments = documents.filter((document) => document.status === "เผยแพร่").length;
  const analyticsStatus = analytics.status === "connected" ? "เชื่อมต่อ GA4 แล้ว" : analytics.status === "unconfigured" ? "ยังไม่เชื่อมต่อ GA4" : "GA4 ไม่พร้อมใช้งาน";

  const summaryCards = useMemo(() => [
    { label: "ผู้เข้าชม", value: number(analytics.visitors), change: delta(analytics.visitorsDelta) },
    { label: "เซสชัน", value: number(analytics.sessions), change: delta(analytics.sessionsDelta) },
    { label: "การดูหน้าเว็บ", value: number(analytics.views), change: delta(analytics.viewsDelta) },
    { label: "การติดต่อจากเว็บไซต์", value: number(analytics.leads), change: delta(analytics.leadsDelta), real: true },
  ], [analytics]);

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="Website analytics" title="ภาพรวมเว็บไซต์">
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">ช่วงเวลา</span>
          <select value={range} onChange={(event) => setRange(event.target.value as "7" | "28" | "90")} className={`rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ${focusRing}`}>
            <option value="7">7 วันล่าสุด</option><option value="28">28 วันล่าสุด</option><option value="90">90 วันล่าสุด</option>
          </select>
        </label>
      </PageHeading>

      <div className="-mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>สถิติผู้เข้าชมจาก Google Analytics 4 และจำนวนการติดต่อจากฐานข้อมูล</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${analytics.status === "connected" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{analyticsStatus}</span>
        {isLoading && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 animate-pulse">กำลังโหลด...</span>}
      </div>
      {(analytics.message || loadError) && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError || analytics.message}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-slate-500">{stat.label}</p><span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">{stat.change}</span></div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
          <p className="mt-2 text-xs text-slate-500">{stat.real ? "ข้อมูลลีดจากฐานข้อมูลจริง" : "เทียบกับช่วงเวลาก่อนหน้า"}</p>
        </article>)}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><h2 className="font-semibold text-slate-900">แนวโน้มการเข้าชม</h2><p className="mt-1 text-sm text-slate-500">ข้อมูลรายวันจาก GA4 ในช่วงเวลาที่เลือก</p></div>
            <div className="inline-flex self-start rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setChartMetric("visitors")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${chartMetric === "visitors" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>ผู้เข้าชม</button><button type="button" onClick={() => setChartMetric("views")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${chartMetric === "views" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>การดูหน้า</button></div>
          </div>
          {chartValues.length ? <><div className="mt-7 grid h-64 items-end gap-1.5 border-b border-slate-200 px-1" style={{ gridTemplateColumns: `repeat(${chartValues.length}, minmax(0, 1fr))` }}>{chartValues.map((value, index) => <div key={analytics.daily[index].date} className="group relative flex h-full items-end"><div style={{ height: `${(value / chartMax) * 100}%` }} className="w-full min-h-0 rounded-t-md bg-brand-700/70 transition-colors group-hover:bg-brand-700" /><span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block">{number(value)}</span></div>)}</div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>{range} วันที่แล้ว</span><span>วันนี้</span></div></> : <div className="mt-7 grid h-64 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">ยังไม่มีข้อมูลจาก GA4 สำหรับช่วงเวลานี้</div>}
        </section>
        <section className="rounded-2xl bg-slate-800 p-5 text-white shadow-sm"><p className="text-sm font-medium text-white/65">สถานะข้อมูล Analytics</p><p className="mt-3 text-2xl font-semibold">{analyticsStatus}</p><p className="mt-3 text-sm leading-6 text-white/70">{analytics.status === "connected" ? "ตัวเลขผู้เข้าชมและแหล่งที่มาด้านล่างดึงจาก Google Analytics Data API" : "เพิ่มค่า GA4_PROPERTY_ID และข้อมูล service account ใน environment ของหลังบ้านเพื่อเริ่มดึงสถิติ"}</p><div className="mt-5 border-t border-white/10 pt-4"><p className="text-xs font-semibold text-white/50">การติดต่อที่ได้รับช่วงนี้</p><p className="mt-2 text-3xl font-semibold">{number(analytics.leads)}</p></div></section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">แหล่งที่มาของผู้เข้าชม</h2><p className="mt-1 text-sm text-slate-500">จัดกลุ่มตามช่องทางของ GA4</p><div className="mt-5 space-y-4">{analytics.trafficSources.length ? analytics.trafficSources.map((source, index) => <div key={source.label}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{source.label}</span><span className="font-semibold text-slate-900">{number(source.sessions)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${sourceColors[index % sourceColors.length]}`} style={{ width: `${sourceTotal ? (source.sessions / sourceTotal) * 100 : 0}%` }} /></div></div>) : <p className="text-sm text-slate-500">ยังไม่มีข้อมูล</p>}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">เหตุการณ์ที่ตั้งเป็น Conversion</h2><p className="mt-1 text-sm text-slate-500">ต้องตั้งชื่อ event ให้ตรงกับ GA4_CONVERSION_EVENTS</p><div className="mt-5 space-y-4">{analytics.conversions.length ? analytics.conversions.map((event) => <div key={event.eventName}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{eventLabels[event.eventName] ?? event.eventName}</span><span className="font-semibold text-slate-900">{number(event.count)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-energy-600" style={{ width: `${conversionTotal ? (event.count / conversionTotal) * 100 : 0}%` }} /></div></div>) : <p className="text-sm text-slate-500">ยังไม่มี event ที่ตรงกับการตั้งค่า</p>}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-900">สถานะงานเนื้อหา</h2><p className="mt-1 text-sm text-slate-500">สรุปจากข้อมูลในระบบจัดการเนื้อหา</p><dl className="mt-5 divide-y divide-slate-100"><div className="flex justify-between py-3"><dt className="text-sm text-slate-600">เผยแพร่แล้ว</dt><dd className="font-semibold">{publishedCount}</dd></div><div className="flex justify-between py-3"><dt className="text-sm text-slate-600">ร่าง/รอกำหนดเวลา</dt><dd className="font-semibold">{draftsCount}</dd></div><div className="flex justify-between py-3"><dt className="text-sm text-slate-600">ข้อความใหม่</dt><dd className="font-semibold">{unreadCount}</dd></div><div className="flex justify-between py-3"><dt className="text-sm text-slate-600">เอกสารเผยแพร่</dt><dd className="font-semibold">{publishedDocuments}</dd></div></dl></section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-900">หน้าที่มีผู้เข้าชมมากที่สุด</h2><p className="mt-1 text-sm text-slate-500">จาก Google Analytics 4</p></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead className="bg-slate-50 text-xs font-semibold text-slate-500"><tr><th className="px-6 py-3">หน้า</th><th className="px-4 py-3 text-right">การดูหน้า</th><th className="px-6 py-3 text-right">การมีส่วนร่วม</th></tr></thead><tbody className="divide-y divide-slate-100">{analytics.topPages.length ? analytics.topPages.map((item, index) => <tr key={item.path}><td className="px-6 py-3.5"><div className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">{index + 1}</span><p className="text-sm font-semibold text-slate-800">{item.path}</p></div></td><td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">{number(item.views)}</td><td className="px-6 py-3.5 text-right text-sm text-slate-600">{item.engagementRate === null ? "—" : `${Math.round(item.engagementRate * 100)}%`}</td></tr>) : <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">ยังไม่มีข้อมูล</td></tr>}</tbody></table></div></section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">การเปลี่ยนแปลงล่าสุด</h2><p className="mt-1 text-sm text-slate-500">ข้อมูลจากหลังบ้าน</p></div><button type="button" onClick={() => onNavigate("activity")} className={`text-sm font-semibold text-brand-700 hover:text-brand-900 ${focusRing}`}>ดูทั้งหมด</button></div><div className="divide-y divide-slate-100">{activities.length ? activities.slice(0, 5).map((activity, index) => <button key={activity.id} type="button" onClick={() => onNavigate(activity.screen)} className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 ${focusRing}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index === 0 ? "bg-energy-600 ring-4 ring-energy-600/10" : "bg-slate-300"}`} /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><ActivityBadge action={activity.action} /></span><span className="mt-1.5 block truncate text-sm font-semibold text-slate-800">{activity.title}</span><span className="mt-1 block text-xs text-slate-500">{activity.contentType} · {activity.at}</span></span></button>) : <p className="px-5 py-8 text-center text-sm text-slate-500">ยังไม่มีประวัติการเปลี่ยนแปลง</p>}</div></section>
      </div>
    </div>
  );
}
