import { useState, useEffect } from "react";
import { ContentItem, DemoMessage, DownloadItem, ContentActivity, Screen } from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { focusRing } from "../utils";
import { getJson } from "../../../lib/api";

type AnalyticsData = {
  visitors: string; sessions: string; views: string; leads: string;
  visitorsDelta: string; sessionsDelta: string; viewsDelta: string; leadsDelta: string;
  chart: number[];
}

const emptyAnalytics: AnalyticsData = {
  visitors: "-", sessions: "-", views: "-", leads: "-",
  visitorsDelta: "-", sessionsDelta: "-", viewsDelta: "-", leadsDelta: "-",
  chart: Array(14).fill(0)
};

export function Dashboard({ portfolio, news, products, messages, documents, activities, onNavigate }: { portfolio: ContentItem[]; news: ContentItem[]; products: ContentItem[]; messages: DemoMessage[]; documents: DownloadItem[]; activities: ContentActivity[]; onNavigate: (screen: Screen) => void }) {
  const [range, setRange] = useState<string>("28");
  const [chartMetric, setChartMetric] = useState<"visitors" | "views">("visitors");
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // TODO: The backend team needs to implement this endpoint
    getJson<{ data: AnalyticsData }>(`/api/v1/admin/analytics?range=${range}`)
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(emptyAnalytics))
      .finally(() => setIsLoading(false));
  }, [range]);

  const chartValues = chartMetric === "visitors" ? analytics.chart : analytics.chart.map((value) => Math.round(value * 2.18));
  const chartMax = Math.max(12, ...chartValues);
  
  const publishedCount = [...portfolio, ...news, ...products].filter((item) => item.status === "เผยแพร่").length;
  const draftsCount = [...portfolio, ...news, ...products].filter((item) => item.status !== "เผยแพร่").length;
  const unreadCount = messages.filter((message) => message.status === "ใหม่").length;
  const publishedDocuments = documents.filter((document) => document.status === "เผยแพร่").length;

  const topPages = [
    { title: "หน้าแรก", path: "/", views: "-", engagement: "-" },
    { title: "ผลิตภัณฑ์", path: "/products", views: "-", engagement: "-" },
    { title: "เกี่ยวกับเรา", path: "/about", views: "-", engagement: "-" },
    { title: "ผลงาน", path: "/projects", views: "-", engagement: "-" },
    { title: "ข่าวสารและบทความ", path: "/news", views: "-", engagement: "-" },
  ];
  
  const trafficSources = [
    { label: "Google Search", value: 0, color: "bg-brand-700" },
    { label: "เข้าชมโดยตรง", value: 0, color: "bg-blue-500" },
    { label: "Facebook", value: 0, color: "bg-[#1877F2]" },
    { label: "LINE", value: 0, color: "bg-[#06C755]" },
    { label: "เว็บไซต์อ้างอิง", value: 0, color: "bg-violet-500" },
  ];
  
  const conversionEvents = [
    { label: "ขอใบเสนอราคา", value: 0, percent: 0 },
    { label: "กดเปิด LINE", value: 0, percent: 0 },
    { label: "กดดูเบอร์โทร", value: 0, percent: 0 },
    { label: "กดเปิด Facebook", value: 0, percent: 0 },
  ];

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="Website analytics" title="ภาพรวมเว็บไซต์">
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">ช่วงเวลา</span>
          <select value={range} onChange={(event) => setRange(event.target.value)} className={`rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ${focusRing}`}>
            <option value="7">7 วันล่าสุด</option>
            <option value="28">28 วันล่าสุด</option>
            <option value="90">90 วันล่าสุด</option>
          </select>
        </label>
      </PageHeading>
      
      <div className="-mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>ติดตามผู้เข้าชม แหล่งที่มา และการติดต่อจากเว็บไซต์</span>
        {isLoading && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 animate-pulse">กำลังโหลดข้อมูล...</span>}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="สถิติการเข้าชมเว็บไซต์">
        {[
          { label: "ผู้เข้าชม", value: analytics.visitors, delta: analytics.visitorsDelta, note: "เทียบช่วงก่อนหน้า" },
          { label: "เซสชัน", value: analytics.sessions, delta: analytics.sessionsDelta, note: "เฉลี่ย - ครั้ง/คน" },
          { label: "การดูหน้าเว็บ", value: analytics.views, delta: analytics.viewsDelta, note: "เฉลี่ย - หน้า/เซสชัน" },
          { label: "การติดต่อทั้งหมด", value: analytics.leads, delta: analytics.leadsDelta, note: "Conversion -%" },
        ].map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-slate-500">{stat.label}</p><span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">{stat.delta}</span></div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><h2 className="font-semibold text-slate-900">แนวโน้มการเข้าชม</h2><p className="mt-1 text-sm text-slate-500">ข้อมูลรายวันจากช่วงเวลาที่เลือก</p></div>
            <div className="inline-flex self-start rounded-xl bg-slate-100 p-1">
              <button type="button" onClick={() => setChartMetric("visitors")} aria-pressed={chartMetric === "visitors"} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${chartMetric === "visitors" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>ผู้เข้าชม</button>
              <button type="button" onClick={() => setChartMetric("views")} aria-pressed={chartMetric === "views"} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${chartMetric === "views" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>การดูหน้า</button>
            </div>
          </div>
          <div className="mt-7 grid h-64 grid-cols-[repeat(14,minmax(0,1fr))] items-end gap-1.5 border-b border-slate-200 px-1 sm:gap-2" aria-label={`กราฟ${chartMetric === "visitors" ? "ผู้เข้าชม" : "การดูหน้า"}รายวัน`}>
            {chartValues.map((value, index) => (
              <div key={`${range}-${chartMetric}-${index}`} className="group relative flex h-full items-end">
                <div style={{ height: `${Math.max(12, (value / chartMax) * 100)}%` }} className="w-full rounded-t-md bg-slate-200 transition-all group-hover:bg-slate-300" />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-400"><span>{range === "7" ? "7 วันที่แล้ว" : range === "28" ? "28 วันที่แล้ว" : "90 วันที่แล้ว"}</span><span>วันนี้</span></div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-2xl bg-slate-800 p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-white/65">ผู้เข้าชมในช่วง 30 นาที</p>
            <div className="mt-3 flex items-end justify-between gap-4"><p className="text-4xl font-semibold">-</p><span className="mb-1 inline-flex items-center gap-2 text-xs text-slate-300">รอการเชื่อมต่อระบบ</span></div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold text-white/50">หน้าที่กำลังเปิด</p>
              <div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span className="text-white/75">-</span><span>-</span></div></div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">อุปกรณ์ที่ใช้</h2>
            <p className="mt-1 text-sm text-slate-500">สัดส่วนผู้เข้าชมทั้งหมด</p>
            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100"></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><p className="text-lg font-semibold text-slate-900">-</p><p className="text-xs text-slate-500">มือถือ</p></div><div><p className="text-lg font-semibold text-slate-900">-</p><p className="text-xs text-slate-500">คอมพิวเตอร์</p></div><div><p className="text-lg font-semibold text-slate-900">-</p><p className="text-xs text-slate-500">แท็บเล็ต</p></div></div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-900">แหล่งที่มาของผู้เข้าชม</h2>
          <p className="mt-1 text-sm text-slate-500">ช่องทางก่อนเข้าสู่เว็บไซต์</p>
          <div className="mt-5 space-y-4">
            {trafficSources.map((source) => <div key={source.label}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{source.label}</span><span className="font-semibold text-slate-900">-</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${source.color}`} style={{ width: `0%` }} /></div></div>)}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-900">การติดต่อจากเว็บไซต์</h2>
          <p className="mt-1 text-sm text-slate-500">จำนวนการกดปุ่มสำคัญ</p>
          <div className="mt-5 space-y-4">
            {conversionEvents.map((event) => <div key={event.label}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{event.label}</span><span className="font-semibold text-slate-900">-</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-300" style={{ width: `0%` }} /></div></div>)}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-900">พื้นที่ของผู้เข้าชม</h2>
          <p className="mt-1 text-sm text-slate-500">ตำแหน่งโดยประมาณจากการเข้าชม</p>
          <div className="mt-5 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-3"><span className="text-sm font-medium text-slate-500">รอข้อมูลจากระบบ</span></div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-900">หน้าที่มีผู้เข้าชมมากที่สุด</h2><p className="mt-1 text-sm text-slate-500">ช่วยดูว่าคนสนใจเนื้อหาส่วนใดของเว็บไซต์</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left"><thead className="bg-slate-50 text-xs font-semibold text-slate-500"><tr><th className="px-6 py-3">หน้า</th><th className="px-4 py-3 text-right">การดูหน้า</th><th className="px-6 py-3 text-right">มีส่วนร่วม</th></tr></thead><tbody className="divide-y divide-slate-100">{topPages.map((item, index) => <tr key={item.path}><td className="px-6 py-3.5"><div className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">{index + 1}</span><div><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="text-xs text-slate-400">{item.path}</p></div></div></td><td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">{item.views}</td><td className="px-6 py-3.5 text-right text-sm text-slate-600">{item.engagement}</td></tr>)}</tbody></table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">การเปลี่ยนแปลงล่าสุด</h2><p className="mt-1 text-sm text-slate-500">รายการใหม่สุดอยู่ด้านบน</p></div><button type="button" onClick={() => onNavigate("activity")} className={`text-sm font-semibold text-brand-700 hover:text-brand-900 ${focusRing}`}>ดูทั้งหมด</button></div>
          <div className="divide-y divide-slate-100">
            {activities.length > 0 ? activities.slice(0, 5).map((activity, index) => <button key={activity.id} type="button" onClick={() => onNavigate(activity.screen)} className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 ${focusRing}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index === 0 ? "bg-energy-600 ring-4 ring-energy-600/10" : "bg-slate-300"}`} /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><ActivityBadge action={activity.action} />{index === 0 && <span className="text-[11px] font-semibold text-energy-600">ล่าสุด</span>}</span><span className="mt-1.5 block truncate text-sm font-semibold text-slate-800">{activity.title}</span><span className="mt-1 block text-xs text-slate-500">{activity.contentType} · {activity.at}</span></span></button>) : <div className="px-5 py-8 text-center text-sm text-slate-500">ยังไม่มีประวัติการแก้ไขในขณะนี้</div>}
          </div>
        </section>
      </div>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4" aria-label="สถานะระบบจัดการเนื้อหา">
        {[
          { label: "เผยแพร่แล้ว", value: publishedCount, screen: "news" as Screen },
          { label: "รอตรวจหรือกำหนดเวลา", value: draftsCount, screen: "news" as Screen },
          { label: "ข้อความใหม่", value: unreadCount, screen: "messages" as Screen },
          { label: "เอกสารพร้อมใช้", value: publishedDocuments, screen: "downloads" as Screen },
        ].map((item) => <button key={item.label} type="button" onClick={() => onNavigate(item.screen)} className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50 ${focusRing}`}><span className="text-sm font-medium text-slate-600">{item.label}</span><span className="text-lg font-semibold text-slate-900">{item.value}</span></button>)}
      </section>
    </div>
  );
}
