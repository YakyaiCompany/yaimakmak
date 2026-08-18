import { useState } from "react";
import { DiscoverySettings } from "../types";
import { PageHeading } from "../components/PageHeading";
import { focusRing } from "../utils";

export function DiscoverySettingsPage({ settings, onChange }: { settings: DiscoverySettings; onChange: (settings: DiscoverySettings) => void }) {
  const [notice, setNotice] = useState("");
  const update = (patch: Partial<DiscoverySettings>) => {
    setNotice("");
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ตั้งค่าครั้งเดียว" title="การค้นหาและการแชร์" />
      <section className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-5 text-sm leading-6 text-brand-900">
        <h2 className="font-semibold">ข้อมูลส่วนกลางของเว็บไซต์</h2>
        <p className="mt-1 text-brand-900/75">ใช้เป็นข้อมูลหลักเมื่อหน้าแรกปรากฏใน Google และเมื่อมีคนแชร์ลิงก์เว็บไซต์ จึงกรอกครั้งเดียวและแก้เฉพาะเมื่อชื่อบริษัท ที่อยู่เว็บไซต์ หรือข้อความแนะนำหลักเปลี่ยน</p>
      </section>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}

      <form onSubmit={(event) => { event.preventDefault(); setNotice("บันทึกการตั้งค่าการค้นหาและการแชร์แล้ว"); }} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">ข้อมูลหลักสำหรับผลการค้นหา</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">ใช้เป็นค่าเริ่มต้นของหน้าแรก และช่วยให้ระบบค้นหาเข้าใจชื่อและบริการหลักของบริษัท</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ชื่อเว็บไซต์ในผลการค้นหา</span>
                <input value={settings.siteTitle} onChange={(event) => update({ siteTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ควรมีชื่อบริษัทและบริการหลัก เพื่อให้คนรู้ว่าเว็บไซต์นี้เกี่ยวกับอะไร</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">คำอธิบายเว็บไซต์</span>
                <textarea rows={4} value={settings.siteDescription} onChange={(event) => update({ siteDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">สรุปว่าบริษัทให้บริการอะไรและเหมาะกับลูกค้ากลุ่มใด ข้อความนี้อาจปรากฏใต้ชื่อเว็บไซต์</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ที่อยู่หลักของเว็บไซต์</span>
                <input type="url" value={settings.siteUrl} onChange={(event) => update({ siteUrl: event.target.value })} placeholder="https://www.example.com" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ใช้บอกระบบค้นหาว่าที่อยู่นี้เป็นเว็บไซต์หลักของบริษัท ควรแก้เมื่อเปลี่ยนโดเมนเท่านั้น</span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">เมื่อแชร์ลิงก์ใน LINE และ Facebook</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">กำหนดข้อความและภาพเริ่มต้นที่ช่วยให้ลิงก์ดูน่าเชื่อถือและเข้าใจง่ายก่อนกดเปิด</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">ชื่อบนการ์ดแชร์</span><input value={settings.shareTitle} onChange={(event) => update({ shareTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">ข้อความบนการ์ดแชร์</span><textarea rows={3} value={settings.shareDescription} onChange={(event) => update({ shareDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ลิงก์ภาพสำหรับการแชร์</span>
                <input type="url" value={settings.shareImage} onChange={(event) => update({ shareImage: event.target.value })} placeholder="https://.../share-cover.jpg" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">แนะนำภาพแนวนอนที่มีชื่อบริษัทและภาพเครื่องจักรชัดเจน ใช้เป็นภาพสำรองเมื่อหน้านั้นไม่มีภาพเฉพาะ</span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">การเชื่อมต่อกับ Google</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">ตั้งค่าเฉพาะตอนเปิดเว็บไซต์หรือเมื่อทีมดูแลระบบแจ้งให้เปลี่ยน</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">รหัสยืนยัน Google Search Console</span>
                <input value={settings.googleVerification} onChange={(event) => update({ googleVerification: event.target.value })} placeholder="เว้นว่างได้จนกว่าจะได้รับรหัสจาก Google" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ใช้ยืนยันว่าเว็บไซต์นี้เป็นของบริษัท เพื่อดูสถานะการค้นหาและปัญหาที่ Google ตรวจพบ ไม่ใช่ช่องสำหรับใส่คำค้นหา</span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input type="checkbox" checked={settings.allowIndexing} onChange={(event) => update({ allowIndexing: event.target.checked })} className="mt-0.5 h-5 w-5 accent-brand-700" />
                <span><span className="block text-sm font-semibold text-slate-800">อนุญาตให้ระบบค้นหาเก็บข้อมูลเว็บไซต์</span><span className="mt-1 block text-xs leading-5 text-slate-500">ควรเปิดเมื่อเว็บไซต์พร้อมใช้งานจริง หากปิด หน้าเว็บอาจไม่ปรากฏในผลการค้นหา</span></span>
              </label>
            </div>
          </section>

          <button type="submit" className={`w-full rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 sm:w-auto ${focusRing}`}>บันทึกการตั้งค่า</button>
        </div>

        <aside className="h-fit space-y-5 xl:sticky xl:top-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">ตั้งค่าตรงไหน?</h2>
            <div className="mt-4 space-y-4 text-sm leading-6">
              <div><p className="font-semibold text-slate-800">ข้อมูลส่วนกลาง</p><p className="text-slate-500">ชื่อเว็บไซต์ โดเมน ภาพแชร์หลัก และการเชื่อมต่อ Google ตั้งในหน้านี้ครั้งเดียว</p></div>
              <div className="border-t border-slate-100 pt-4"><p className="font-semibold text-slate-800">ข้อมูลของแต่ละหน้า</p><p className="text-slate-500">ข่าว ผลงาน และสินค้ามีชื่อกับคำอธิบายสำหรับการค้นหาของตัวเอง จึงแก้ในหน้ารายการนั้น</p></div>
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">ตัวอย่างผลการค้นหา</h2></div>
            <div className="p-5">
              <p className="truncate text-xs text-emerald-700">{settings.siteUrl || "https://www.yakyai2015.co.th"}</p>
              <p className="mt-1 text-lg font-medium leading-6 text-blue-700">{settings.siteTitle || "ชื่อเว็บไซต์"}</p>
              <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{settings.siteDescription || "คำอธิบายเว็บไซต์จะแสดงบริเวณนี้"}</p>
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[1.91/1] bg-slate-100">
              {settings.shareImage ? <img src={settings.shareImage} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">ภาพสำหรับการแชร์ลิงก์</div>}
            </div>
            <div className="p-4"><p className="font-semibold leading-6 text-slate-900">{settings.shareTitle || "ชื่อบนการ์ดแชร์"}</p><p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{settings.shareDescription || "ข้อความบนการ์ดแชร์"}</p></div>
          </section>
        </aside>
      </form>
    </div>
  );
}
